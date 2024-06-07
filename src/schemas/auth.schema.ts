import Joi from "joi";

// Schemas used in the auth.router.ts file for validation

export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const registerSchema = Joi.object({
  username: Joi.string().pattern(/^[a-zA-Z0-9_-]+$/).max(20),
  password: Joi.string().min(8).max(25).required(),
  wallets: Joi.array().items(
    Joi.object({
      address: Joi.string().regex(/^0x[a-fA-F0-9]{40}$/).lowercase().required(),
      alias: Joi.string().required(),
    })
  ).min(1).required(),
});