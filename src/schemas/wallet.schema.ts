import Joi from "joi";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "../utils/constants";

export const createWalletSchema = Joi.object({
    alias: Joi.string().optional().allow(''),
    address: Joi.string().regex(/^0x[a-fA-F0-9]{40}$/).required(),
});

export const getWalletSchema = Joi.object({
    address: Joi.string().regex(/^0x[a-fA-F0-9]{40}$/).required(),
});

export const updateWalletSchema = Joi.object({
    alias: Joi.string().optional().allow(''),
});

export const basicPaginationSchema = Joi.object({
    page: Joi.number().min(1).default(DEFAULT_PAGE),
    limit: Joi.number().min(1).default(DEFAULT_PAGE_SIZE),
});

export const verifyWalletSchema = Joi.object({
    address: Joi.string().regex(/^0x[a-fA-F0-9]{40}$/).required(),
    signature: Joi.string().required(),
    nonce: Joi.string().required(),
});