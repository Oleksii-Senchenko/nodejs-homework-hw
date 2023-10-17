const Joi = require("joi");
const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(validEmail).required(),
  password: Joi.string().min(6).required(),
});


const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});


module.exports = {
  registerSchema,
  loginSchema,
};
