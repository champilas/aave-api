import boom from '@hapi/boom';
import sequelize from '../libs/sequelize';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config } from '../config/config';
import { EXPIRE_TOKEN_TIME } from '../utils/constants';
import { CreateUser } from '../utils/interfaces';

export default class AuthService {

    constructor() {}

    public async login(username: string, password: string) {

        // checking if user exists or is active
        const user = await sequelize.models.User.findOne({ 
            where: { username },
            include: [
                {
                    model: sequelize.models.Wallet,
                    as: 'wallets',
                },
            ] 
        });

        if (!user || !user.dataValues.isActive) {
            throw boom.notFound(`User: ${username} not found`);
        }

        const validPassword = await bcrypt.compare(password, user.dataValues.password);
        if (!validPassword) {
            throw boom.unauthorized('Invalid password');
        }

        const token = this.generateToken(user.dataValues.id, user.dataValues.role, user.dataValues.username);
        delete user.dataValues.password;

        return { user, token };
    }

    public async createUser(user: CreateUser) {
        
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;

        const userRecord = await sequelize.models.User.create(user as any, {
            include: [
                {
                    model: sequelize.models.Wallet,
                    as: 'wallets',
                },
            ]
        });

        const token = this.generateToken(userRecord.dataValues.id, userRecord.dataValues.role, userRecord.dataValues.username);
        delete userRecord.dataValues.password;

        return {userRecord, token};
    }

    public async autoSignIn(userId: string) {

        // Checking if user exists
        const user = await sequelize.models.User.findByPk(userId);
        if (!user) {
            throw boom.notFound('User not found');
        }

        delete user.dataValues.password;
        return user;
    }

    public generateToken(id: string, role: string, username: string): string {

        const payload = {
            id,
            role,
            username
        };

        const token = jwt.sign(payload, config.jwtSecret, { expiresIn: EXPIRE_TOKEN_TIME });

        return token;
    }
}