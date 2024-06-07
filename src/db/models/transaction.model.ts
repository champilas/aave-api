import { Model, DataTypes, Sequelize } from 'sequelize';
import { USER_TABLE } from './user.model';


const TRANSACTION_TABLE = 'transactions';

interface TransactionAttributes {
  id: string;
  userId: string;
  type: string;
  address: string;
  amount: string;
  transactionHash: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const TransactionSchema = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    field: 'user_id',
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: USER_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  type: {
    type: DataTypes.ENUM('deposit', 'withdraw'),
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  transactionHash: {
    field: 'transaction_hash',
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    field: 'created_at',
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    field: 'updated_at',
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
};

class Transaction extends Model<TransactionAttributes> {
  public id!: string;
  public userId!: string;
  public type!: string;
  public address!: string;
  public amount!: string;
  public transactionHash?: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  static associate(models: any) {
    this.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
  }

  static config(sequelize: Sequelize) {
    return {
      sequelize,
      tableName: TRANSACTION_TABLE,
      modelName: 'Transaction',
      timestamps: true,
    };
  }
}

export { TRANSACTION_TABLE, TransactionSchema, Transaction, TransactionAttributes };
