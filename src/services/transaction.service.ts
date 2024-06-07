import boom from '@hapi/boom';
import sequelize from '../libs/sequelize';
import { TransactionAttributes } from '../db/models/transaction.model';

export default class TransactionService {
    constructor() {}

    // Read all transactions from the database for specific user
    public async getAllTransactions(userId: string, page: number, limit: number) {
        const transactions = await sequelize.models.Transaction.findAll({
            where: { userId },
            limit,
            offset: (page - 1) * limit,
        });
        return transactions;
    }

    // Read the transaction from the database for specific user
    public async getTransaction(userId: string, id: string) {
        const transaction = await sequelize.models.Transaction.findOne({ where: { id, userId } });
        if (!transaction) {
            throw boom.notFound('Transaction not found for this user');
        }

        return transaction;
    }

    // Create a new transaction in the database
    public async createTransaction(userId: string, data: Omit<TransactionAttributes, 'id' | 'userId'>) {
        const user = await sequelize.models.User.findByPk(userId);
        if (!user) {
            throw boom.notFound('User not found');
        }

        const newTransaction = await sequelize.models.Transaction.create({ ...data, userId });
        return newTransaction;
    }
}