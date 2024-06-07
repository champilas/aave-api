import { ethers, BigNumber, providers } from 'ethers';
import {
  UiPoolDataProvider,
  ChainId,
  EthereumTransactionTypeExtended,
} from '@aave/contract-helpers';
import * as markets from '@bgd-labs/aave-address-book';
import { formatReserves } from '@aave/math-utils';
import dayjs from 'dayjs';
import { Pool } from '@aave/contract-helpers';
import { config } from '../config/config';
import TransactionService from './transaction.service';
import sequelize from '../libs/sequelize';
import boom from '@hapi/boom';

export default class AaveService {
    private provider: providers.JsonRpcProvider;
    private pool: Pool;
    private transactionService: TransactionService;

    constructor() {
        this.provider = new ethers.providers.JsonRpcProvider(config.ethers.rpc);

        this.pool = new Pool(this.provider, {
            POOL: markets.AaveV3Sepolia.POOL,
            WETH_GATEWAY: markets.AaveV3Sepolia.WETH_GATEWAY,
        });

        this.transactionService = new TransactionService();
    }

    public async deposit(userId: string, address: string, amount: string, signature: string) {
        
        const wallet = await sequelize.models.Wallet.findOne({ where: { address, userId } });
        if (!wallet) {
            throw boom.notFound('Wallet not found for this user');
        }
        
        const txs: EthereumTransactionTypeExtended[] = await this.pool.supply({
            user: address,
            reserve: config.ethers.reserve,
            amount: amount,
            onBehalfOf: address,
            referralCode: '0',
            useOptimizedPath: true,
        });

        await this.submitTransaction(txs[0], address, userId, 'deposit');
    }

    public async withdraw(userId: string, address: string, amount: string) {

        const wallet = await sequelize.models.Wallet.findOne({ where: { address, userId } });
        if (!wallet) {
            throw boom.notFound('Wallet not found for this user');
        }

        const txs: EthereumTransactionTypeExtended[] = await this.pool.withdraw({
            user: address,
            reserve: config.ethers.reserve,
            amount: amount,
        });

        await this.submitTransaction(txs[0], address, userId, 'withdraw');
    }

    public async submitTransaction(tx: EthereumTransactionTypeExtended, address: string, userId: string, type: string) {
        const extendedTxData = await tx.tx();
        const { from, ...txData } = extendedTxData;
        const signer = this.provider.getSigner(from);
        const txResponse = await signer.sendTransaction({
          ...txData,
          value: txData.value ? BigNumber.from(txData.value) : undefined,
        });
        
        await this.transactionService.createTransaction(userId, {
            type: type,
            address: address,
            amount: txData.value as string,
            transactionHash: txResponse.hash,
        });

        return { message: 'Transaction submitted successfully', transactionHash: txResponse.hash };
    }

    public async getMarketData() {

        const poolDataProviderContract = new UiPoolDataProvider({
            uiPoolDataProviderAddress: markets.AaveV3Sepolia.UI_POOL_DATA_PROVIDER,
            provider: this.provider,
            chainId: ChainId.sepolia,
        });

        const reserves = await poolDataProviderContract.getReservesHumanized({
            lendingPoolAddressProvider: markets.AaveV3Sepolia.POOL_ADDRESSES_PROVIDER,
        });

        const reservesArray = reserves.reservesData;
        const baseCurrencyData = reserves.baseCurrencyData;

        const currentTimestamp = dayjs().unix();

        const formattedPoolReserves = formatReserves({
            reserves: reservesArray,
            currentTimestamp,
            marketReferenceCurrencyDecimals:
                baseCurrencyData.marketReferenceCurrencyDecimals,
            marketReferencePriceInUsd: baseCurrencyData.marketReferenceCurrencyPriceInUsd,
        });

        return { formattedPoolReserves }
    }
}
