import { Model, DataTypes, Sequelize } from 'sequelize';

const USER_TABLE = 'users';

interface UserAttributes {
  id: string;
  username: string;
  password: string;
  isPublic: boolean;
  isActive: boolean;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  username: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
    validate: {
      is: /^[a-zA-Z0-9_-]+$/,
    }
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_public',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  },
  role: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: 'USER',
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

class User extends Model<UserAttributes> {

  public id!: string;
  public username!: string;
  public password!: string;
  public isPublic!: boolean;
  public isActive!: boolean;
  public role!: string;
  public createdAt!: Date;
  public updatedAt!: Date;


  static associate(models: any) {
    this.hasMany(models.Wallet, {
      foreignKey: 'userId',
      as: 'wallets',
    });
    this.hasMany(models.Transaction, {
      foreignKey: 'userId',
      as: 'activity',
    });
  }

  static config(sequelize: Sequelize) {
    return {
      sequelize,
      tableName: USER_TABLE,
      modelName: 'User',
      timestamps: true,
    };
  }
}

export { USER_TABLE, UserSchema, User, UserAttributes };
