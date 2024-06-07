import boom from '@hapi/boom';
import sequelize from '../libs/sequelize';
import { generateSignString } from '../utils/random';
import { verifyMessage } from 'ethers/lib/utils';
import { Wallet } from '../utils/interfaces';
import { NONCE_LENGTH } from '../utils/constants';

export default class WalletService {
    constructor() {}

    public async getAllWallets(userId: string, page: number, limit: number) {
        const wallets = await sequelize.models.Wallet.findAll({
            where: { userId },
            limit,
            offset: (page - 1) * limit,
        });
        return wallets;
    }

    public async getWallet(userId: string, address: string) {
        address = address.toLowerCase();
        const wallet = await sequelize.models.Wallet.findOne({ where: { address, userId } });
        if (!wallet) {
            throw boom.notFound('Wallet not found for this user');
        }

        return wallet;
    }

    // Generate a nonce for the wallet for verification
    public async generateNonce(userId: string, address: string) {
        address = address.toLowerCase();
        const wallet = await this.getWallet(userId, address);
      
        if (!wallet) {
            throw boom.notFound('Wallet not found for this user');
        }
        
        const nonce = generateSignString(NONCE_LENGTH);
        await wallet.update({ nonce });
        return { address, nonce };
    }

    public async createWallet(userId: string, data: Wallet) {
        data.address = data.address.toLowerCase();
        const wallet = await sequelize.models.Wallet.findOne({ where: { address: data.address } });
        if (wallet) {
            throw boom.badRequest('Wallet already exists');
        }

        const user = await sequelize.models.User.findByPk(userId);
        if (!user) {
            throw boom.notFound('User not found');
        }

        const nonce = generateSignString(15);
        const newWallet = await sequelize.models.Wallet.create({ ...data, nonce, userId });
        return newWallet;
    }

    // Verify wallet, checking if the signature is correct
    public async verifyWallet(address: string, nonce: string, signature: string) {
        address = address.toLowerCase();
        const wallet = await sequelize.models.Wallet.findOne({ where: { address } });
        if (!wallet) {
            throw boom.notFound('Wallet not found');
        }

        if (wallet.dataValues.nonce !== nonce) {
            throw boom.unauthorized('Invalid nonce');
        }

        const verifyAddress = verifyMessage(nonce, signature);

        if (verifyAddress.toLowerCase() !== wallet.dataValues.address) {
            throw boom.unauthorized('Invalid signature');
        }

        const newNonce = generateSignString(15);
        const updatedWallet = await wallet.update({ nonce: newNonce, verified: true });
        return updatedWallet;
    }

    // Update wallet alias, only alias is allowed to be updated
    public async updateWallet(userId: string, address: string, alias: string) {
        address = address.toLowerCase();
        const wallet = await sequelize.models.Wallet.findOne({ where: { address, userId } });
        if (!wallet) {
            throw boom.notFound('Wallet not found for this user');
        }
        const updatedWallet = await wallet.update({ alias });
        return updatedWallet;
    }

    // Delete wallet, only wallet with more than one wallet is allowed to be deleted
    public async deleteWallet(userId: string, address: string) {
        address = address.toLowerCase();

        const userWalletsAmount = await sequelize.models.Wallet.count({ where: { userId } });
        if (userWalletsAmount === 1) {
            throw boom.badRequest('You cannot delete the only wallet');
        }

        const wallet = await sequelize.models.Wallet.findOne({ where: { address, userId } });
        if (!wallet) {
            throw boom.notFound('Wallet not found for this user');
        }
        await wallet.destroy();
        return { message: 'Wallet deleted' };
    }
    

}