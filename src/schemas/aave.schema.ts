import Joi from "joi";

export const authSchema = Joi.object({
    address: Joi.string().regex(/^0x[a-fA-F0-9]{40}$/).lowercase().required(),
    amount: Joi.string().required()
});

export const depositSchema = Joi.object({
    address: Joi.string().regex(/^0x[a-fA-F0-9]{40}$/).lowercase().required(),
    signature: Joi.string().required(),
    amount: Joi.string().required()
});

export const withdrawSchema = Joi.object({
    address: Joi.string().regex(/^0x[a-fA-F0-9]{40}$/).lowercase().required(),
    amount: Joi.string().required()
});