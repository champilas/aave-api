import { Router, Request, Response, NextFunction } from 'express';
import WalletService from '../services/wallet.service';
import passport from 'passport';
import validatorHandler from '../middlewares/validator.handler';
import { basicPaginationSchema, createWalletSchema, getWalletSchema, updateWalletSchema, verifyWalletSchema } from '../schemas/wallet.schema';


const route = Router();
const walletService = new WalletService()

/**
 * @swagger
 * tags:
 *   name: Wallets
 *   description: Wallets operations
 */
export default (app: Router) => {
  app.use('/wallets', route);

/**
  * @swagger
  * /wallets/verify:
  *   post:
  *     tags:
  *       - Wallets
  *     summary: Verify wallet user (requires an authentication token)
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
  *               nonce:
  *                 type: string
  *               signature:
  *                 type: string
  *     responses:
  *       200:
  *         description: Returns the json with the verified wallet
   *       401:
   *         description: Unauthorized, invalid signature
   *       404:
   *         description: Wallet not found or invalid nonce
   */
    route.post('/verify',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(verifyWalletSchema, 'body'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { address, nonce, signature } = req.body;
            const result = await walletService.verifyWallet(address, nonce, signature);
            return res.json(result).status(200);
        } catch (e) {
            next(e);
        }
    });

  /**
   * @swagger
   * /wallets:
   *   post:
   *     tags:
   *       - Wallets
   *     summary: Create a wallet for a user (requires an authentication token)
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
   *               alias:
   *                 type: string
   *                 required: false
   *     responses:
   *       200:
   *         description: Returns the new wallet
   *       400:
   *         description: Wallet already exists
   *       404:
   *         description: User not found
   */
    route.post('/',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(createWalletSchema, 'body'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user as { id: string };
            const { address, alias } = req.body as { address: string, alias: string };
            const response = await walletService.createWallet(id, { address, alias });
            return res.json(response).status(200);
        } catch (e) {
            next(e);
        }
    }); 

  /**
   * @swagger
   * /wallets/{address}:
   *   patch:
   *     tags:
   *       - Wallets
   *     summary: Update wallet alias (requires an authentication token)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path  
   *         name: address
   *         required: true
   *         description: wallet address
   *         schema:
   *          type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               alias:
   *                 type: string
   *     responses:
   *       200:
   *         description: Returns the updated wallet
   *       404:
   *         description: User or wallet not found
   */
    route.patch('/:address',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(updateWalletSchema, 'body'),
    validatorHandler(getWalletSchema, 'params'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user as { id: string };
            const { address } = req.params;
            const { alias } = req.body as { alias: string };
            const response = await walletService.updateWallet(id, address, alias);
            return res.json(response).status(200);
        } catch (e) {
            next(e);
        }
    });

      /**
   * @swagger
   * /wallets/nonce/{address}:
   *   get:
   *     tags:
   *       - Wallets
   *     summary: Get nonce for wallet verification (requires an authentication token)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: address
   *         required: true
   *         description: wallet address
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Returns the json with the nonce
   *       404:
   *         description: Wallet not found
   */
    route.get('/nonce/:address',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getWalletSchema, 'params'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user as { id: string };
            const { address } = req.params;
            const result = await walletService.generateNonce(id, address);
            return res.json(result).status(200);
        } catch (e) {
            next(e);
        }
    });

  /**
   * @swagger
   * /wallets/{address}:
   *   get:
   *     tags:
   *       - Wallets
   *     summary: Get specific wallet information (requires an authentication token)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: address
   *         required: true
   *         description: wallet address
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Returns the json with the wallets
   *       404:
   *         description: User not found
   */
    route.get('/:address',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getWalletSchema, 'params'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user as { id: string };
            const { address } = req.params;
            const result = await walletService.getWallet(id, address);
            return res.json(result).status(200);
        } catch (e) {
            next(e);
        }
    });
  

  /**
   * @swagger
   * /wallets:
   *   get:
   *     tags:
   *       - Wallets
   *     summary: Get all wallets for a user (requires an authentication token)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *         required: false
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         required: false
   *     responses:
   *       200:
   *         description: Returns the wallet information
   *       404:
   *         description: User not found
   */
    route.get('/',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(basicPaginationSchema, 'query'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user as { id: string };
            const { page, limit } = req.query;
            const result = await walletService.getAllWallets(id, Number(page), Number(limit));
            return res.json(result).status(200);
        } catch (e) {
            return next(e);
        }
    });
};
