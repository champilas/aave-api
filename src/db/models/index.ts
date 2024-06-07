import { Sequelize } from 'sequelize';
import { User, UserSchema } from './user.model';
import { Transaction, TransactionSchema } from './transaction.model';
import { Wallet, WalletSchema } from './wallet.model';


function setupModels(sequelize: Sequelize) {
  User.init(UserSchema, User.config(sequelize));
  Transaction.init(TransactionSchema, Transaction.config(sequelize));
  Wallet.init(WalletSchema, Wallet.config(sequelize));

  User.associate(sequelize.models);
  Transaction.associate(sequelize.models);
  Wallet.associate(sequelize.models);
}

export default setupModels;