import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().lowercase().trim(),
  email: Joi.string()
    .email()
    .required()
    .lowercase()
    .trim()
    .messages({ "any.required": "Missing required field: email" }),
  password: Joi.string()
    .required()
    .messages({ "any.required": "Missing required field: password" }),
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .lowercase()
    .trim()
    .messages({ "any.required": "Missing required field: email" }),
  password: Joi.string()
    .required()
    .messages({ "any.required": "Missing required field: password" }),
});