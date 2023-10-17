const Joi = require("joi");

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
}).messages({ "any.required": "missing required {#label} field" });

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
}).messages({ "any.required": "missing field favorite" });

module.exports = {
  addSchema,
  updateFavoriteSchema,
};
