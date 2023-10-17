const express = require("express");
require("dotenv").config();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HttpError = require("../../helpers/HttpError");
const User = require("../../models/user");
const { registerSchema, loginSchema } = require("../../schemasJOI/user");
const router = express.Router();
const {SECRET_KEY} = process.env;
router.post("/register", async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    const { email, password } = req.body;

    if (error) {
      throw HttpError(400, error.message);
    }
    const dublicateemail = await User.findOne({ email });

    if (dublicateemail) {
      throw HttpError(409, "user already exists");
    }
    const hashPassword = await bcryptjs.hash(password, 10);

    const newUser = await User.create({ ...req.body, password: hashPassword });

    res.status(201).json({
      email: newUser.email,
      name: newUser.name,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, "Email or password invalid");
    }
    const passwordCompare = await bcryptjs.compare(password, user.password);
    if (!passwordCompare) {
      throw HttpError(401, "Email or password invalid");
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY,{expiresIn: '23h'})
    res.json({
      token,
    });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
