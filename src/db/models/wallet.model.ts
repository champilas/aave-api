import { Model, DataTypes, Sequelize } from 'sequelize';
import { USER_TABLE } from './user.model';

const WALLET_TABLE = 'wallets';

interface WalletAttributes {
  id: string;
  address: string;
  alias?: string;
  nonce?: string;
  verified: boolean;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const WalletSchema = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  address: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  alias: {
    type: DataTypes.STRING,
  },
  nonce: {
    type: DataTypes.STRING,
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  userId: {
    field: 'user_id',
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: USER_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at',
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at',
  },
};

class Wallet extends Model<WalletAttributes> {

  public id!: string;
  public address!: string;
  public alias!: string;
  public nonce!: string;
  public userId!: number;
  public verified!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;

  static associate(models: any) {
    this.belongsTo(models.User, { as: 'user' });
  }

  static config(sequelize: Sequelize) {
    return {
      sequelize,
      tableName: WALLET_TABLE,
      modelName: 'Wallet',
      timestamps: true,
    };
  }
}

export { WALLET_TABLE, WalletSchema, Wallet, WalletAttributes };
