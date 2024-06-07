import express, { Application, Request, Response } from 'express';
import {  errorHandler, boomErrorHandler, ormErrorHandler, logErrors, logUndefinedRoutes } from './middlewares/error.handler';
import { config } from './config/config';
import routes from './routes';
import cors from 'cors';
import passport from 'passport';
import JwtStrategy from './utils/auth/strategies/jwt.strategy';
import fetchContractData from './services/aave.service';

passport.use(JwtStrategy);

const app: Application = express();
const port = config.port;
app.use(express.json());

// Open CORS only for development porpuses
const corsOptions = {
  origin: '*'
};

app.use(cors(corsOptions));

routes(app);

// Adding middleware to handle errors.
app.use(logUndefinedRoutes);
app.use(logErrors);
app.use(ormErrorHandler)
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});