import { Router, Request, Response, NextFunction } from 'express';
import AuthService from '../services/auth.service';
import validatorHandler from '../middlewares/validator.handler';
import { loginSchema, registerSchema } from '../schemas/auth.schema';
import passport from 'passport';

const route = Router();
const authService = new AuthService();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication operations
 */
export default (app: Router) => {
  app.use('/auth', route);

  /**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Creates a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               wallets:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     address:
 *                       type: string
 *                     alias:
 *                       type: string
 *     responses:
 *       200:
 *         description: Retunrs the summary of the user created
 *       400:
 *         description: Error in request
 */
  route.post('/register',
    validatorHandler(registerSchema, 'body'),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const response = await authService.createUser(req.body);
        return res.status(200).json(response);
      } catch (e) {
        next(e);
      }
    });


  /**
  * @swagger
  * /auth/login:
  *   post:
  *     tags:
  *       - Auth
  *     summary: Login for user
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               username:
  *                 type: string
  *               password:
  *                 type: string
  *     responses:
  *       200:
  *         description: Returns the json with the user logged in with token
  *       401:
  *         description: Unauthorized, invalid password
  *       404:
  *         description: User not found
  */
  route.post('/login',
    validatorHandler(loginSchema, 'body'),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { username, password } = req.body;
        const result = await authService.login(username, password);
        return res.json(result).status(200);
      } catch (e) {
        next(e);
      }
    },
  );
 
/**
 * @swagger
 * /auth/auto-login:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Automatic login for user (requires authentication token)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the json with the user logged in
 *       404:
 *         description: User not found
 */
  route.get('/auto-login',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.user as { id: string };
        const result = await authService.autoSignIn(id);
        return res.json(result).status(200);
      } catch (e) {
        next(e);
      }
    },
  );
};
