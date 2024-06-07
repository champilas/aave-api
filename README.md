# AAVE Protocol REST API

## Overview
This project provides a REST API for interacting with the AAVE Protocol. It allows users to perform various operations such as viewing available markets, depositing funds, and withdrawing funds. The API is built with Express and TypeScript, and uses PostgreSQL for data storage, with Docker for containerization.

## Prerequisites
- Docker and Docker Compose
- Node.js and npm
- Nodemon (for development)

## Getting Started

### Setting up the environment

1. Clone the repository:
    ```sh
    git clone https://github.com/champilas/aave-api.git
    cd aave-api
    ```

2. Create a `.env` file in the root directory and add the environment variables, check the .env.example

### Running the Project

1. Start the Docker containers (make sure docker is running):
    ```sh
    docker compose -f .\docker-compose-dev.yml up -d
    ```

2. Install npm dependencies:
    ```sh
    npm install
    ```

3. Install Nodemon globally:
    ```sh
    npm install -g nodemon
    ```

4. Start the development server:
    ```sh
    npm run dev
    ```

The API server should now be running on `http://localhost:3000`. Please replace the port in case used different in the .env file

## API Documentation

The API documentation is available through Swagger. You can access it by navigating to `http://localhost:3000/api/docs` in your web browser. Please replace the port in case used different in the .env file

### Quick Summary

The API includes the following endpoints:

- **/aave/markets (GET)**: Returns a list of available markets.
- **/aave/deposit (POST)**: Creates a deposit in AAVE.
- **/aave/withdraw (POST)**: Creates a withdrawal transaction.
- **/auth/register (POST)**: Registers a new user.
- **/auth/login (POST)**: Logs in a user.
- **/auth/auto-login (GET)**: Automatically logs in a user with a valid token.
- **/wallets/verify (POST)**: Verifies a wallet user.
- **/wallets (POST)**: Creates a new wallet for a user.
- **/wallets (GET)**: Gets all wallets for a user.
- **/wallets/{address} (PATCH)**: Updates a wallet alias.
- **/wallets/{address} (GET)**: Gets specific wallet information.
- **/wallets/nonce/{address} (GET)**: Gets nonce for wallet verification.

### Authentication

Most endpoints require a Bearer token for authentication. Ensure you have a valid JWT token to access these endpoints.

### Example Requests

The examples and basic call API calls are contained in Swagger.

## Database Management

### Accessing pgAdmin

pgAdmin is included in the Docker setup for easy database management. You can access it by navigating to `http://localhost:5050` in your web browser. Use the credentials provided in your `docker-compose-dev.yml` or the .env file to log in.

## Logs

### Logging with Winston

This project uses Winston for logging. Logs are generated and stored in an external file for easier monitoring and debugging. Logs are also rotated daily and archived to manage log file size and retention.

### Log Configuration

The Winston logger is configured to write logs to daily rotated files located in the `logs` directory. You can find the configuration in the logging setup of the project.

### Log Files

- **Daily Rotated Logs**: Logs are stored in `logs/application-%DATE%.log`, where `%DATE%` is replaced with the current date.
- **Console Logs**: Logs are also output to the console.

### Accessing Logs

You can access the log files by navigating to the `logs` directory in the project root. Here are the steps to view the logs:

1. **Daily Rotated Logs**:
    ```sh
    cat logs/application-YYYY-MM-DD.log
    ```
