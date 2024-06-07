import { Router, Request, Response, NextFunction } from 'express';
import validatorHandler from '../middlewares/validator.handler';
import passport from 'passport';
import AaveService from '../services/aave.service';
import { authSchema, depositSchema, withdrawSchema } from '../schemas/aave.schema';

const route = Router();
const aaveService = new AaveService();

/**
 * @swagger
 * tags:
 *   name: Aave
 *   description: Aave operations
 */
export default (app: Router) => {
    app.use('/aave', route);

    /**
    * @swagger
    * /aave/markets:
    *   get:
    *     tags:
    *       - Aave
    *     summary: Returns markets (requires an authentication token)
    *     security:
    *       - bearerAuth: []
    *     responses:
    *       200:
    *         description: Returns a list of markets
    *       4XX:
    *         description: Error in request
    */
    route.get('/markets',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await aaveService.getMarketData();
            return res.json(result).status(200);
        } catch (e) {
            next(e);
        }
    });

/**
  * @swagger
  * /aave/deposit:
  *   post:
  *     tags:
  *       - Aave
  *     summary: Create a deposit in Aave (requires an authentication token)
  *     security:
  *       - bearerAuth: []
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               address:
  *                 type: string
  *               signature:
  *                 type: string
  *               amount:
  *                 type: string
  *     responses:
  *       200:
  *         description: Returns the json with the transaction information
  *       4XX:
  *         description: Error in call
  */
    route.post('/deposit',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(depositSchema, 'body'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { address, amount, signature } = req.body;
            const { id } = req.user as { id: string };
            const result = await aaveService.deposit(id, address, amount, signature);
            return res.json(result).status(200);
        } catch (e) {
            next(e);
        }
    });

    /**
  * @swagger
  * /aave/withdraw:
  *   post:
  *     tags:
  *       - Aave
  *     summary: Create a withdraw transaction (requires an authentication token)
  *     security:
  *       - bearerAuth: []
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               address:
  *                 type: string
  *               amount:
  *                 type: string
  *     responses:
  *       200:
  *         description: Returns the json with the transaction information
  *       4XX:
  *         description: Error in call
  */
    route.post('/withdraw',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(withdrawSchema, 'body'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { address, amount } = req.body;
            const { id } = req.user as { id: string };
            const result = await aaveService.withdraw(id, address, amount);
            return res.json(result).status(200);
        } catch (e) {
            next(e);
        }
    });
};
