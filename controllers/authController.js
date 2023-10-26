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
const { readFile } = require("fs/promises");
const { isUtf8 } = require("buffer");

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
    const newUser = await User.create({
      ...req.body,
      password: hashPass,
      avatarURL,
    });

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

  current = tryHandler(async (req, res, next) => {
    const { email, subscription } = req.user;

    res.json({
      email,
      subscription,
    });
  });

  updateAvatar = tryHandler(async (req, res, next) => {
    const { path: tempUpload, originalname } = req.file;
   
  


    const { _id: id } = req.user._id;
    const resultUpload = path.join(
      __dirname,
      "../",
      "public",
      "avatars",
      `${id}_${originalname}`
    );

    const image = await Jimp.read(tempUpload);

    image.resize(250, 250);

    await fs.renameSync(tempUpload, resultUpload);
    
    const avatarURL = path.join("public", "avatars", originalname);

    await User.findByIdAndUpdate(req.user._id, { avatarURL });
    res.json({ avatarURL });
  });

  
}




module.exports = new UserController();
