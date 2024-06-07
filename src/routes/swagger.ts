import { Router } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { config } from '../config/config';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Express API for AAVE Protocol',
      version: '1.0.0',
      description: 'This is a REST API application for AAVE Protocol',
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api/`,
        description: 'Local server',
      }
    ],
  };
  
  const swaggerOptions = {
    definition: swaggerDefinition,
    apis: ['./src/routes/*.ts']
  };
  
  const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default (app: Router) => {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

//Schemas for swagger
/**
* @swagger
* components:
*   securitySchemes:
*     bearerAuth:
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
*/

