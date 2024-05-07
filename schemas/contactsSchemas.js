import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().required(),
  favorite: Joi.boolean()
});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  phone: Joi.string(),
  email: Joi.string().email(),
  favorite: Joi.boolean()
})
  .min(1)
  .messages({ "object.min": "Body must have at least one field" });

export const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});