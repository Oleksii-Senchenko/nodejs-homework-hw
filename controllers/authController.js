const jwt = require("jsonwebtoken");
const HttpError = require("../helpers/HttpError");
const tryHandler = require("../middlewares/tryHandler");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const { nanoid } = require("nanoid");
const sendEmail = require("../helpers/sendEmail");

const { SECRET_KEY } = process.env;
class UserController {
  register = tryHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, "Email in use");
    }

    const hashPass = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);

    const verificationtoken = nanoid();

    const newUser = await User.create({
      ...req.body,
      password: hashPass,
      avatarURL,
      verificationtoken,
    });

    const mail = {
      to: "wifohow843@othao.com",
      subject: "Verification email",
      html: `<a target="blank" href="http://localhost:3000/api/users/verify/${verificationtoken}">Verify your email</a>`,
    };

    await sendEmail(mail);

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL,
      },
    });
  });

  login = tryHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }
    const compirePass = await bcrypt.compare(password, user.password);

    if (!compirePass) {
      throw HttpError(401, "Email or password is wrong");
    }

    if (!user.verify) {
      throw HttpError(401, "Chek email");
    }
    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "12h" });

    await User.findByIdAndUpdate(user._id, { token });
    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  });

  logout = tryHandler(async (req, res, next) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: null });
    res.status(204).json();
  });
}

module.exports = new UserController();
