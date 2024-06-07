import { Application, Router } from 'express';
import swagger from './swagger';
import auth from './auth.router';
import wallet from './wallet.router';
import aave from './aave.router';

export default (app : Application) => {
    const router = Router();
    app.use('/api', router);
    swagger(router);
    auth(router);
    wallet(router);
    aave(router);
}