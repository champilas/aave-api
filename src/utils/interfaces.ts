export interface CreateUser {
    username: string;
    password: string;
    wallets: Wallet[];
}

export interface Wallet {
    address: string;
    alias: string;
}