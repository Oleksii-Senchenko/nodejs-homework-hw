const HttpError = require("../helpers/HttpError");
const tryHandler = require("../middlewares/tryHandler");
const User = require("../models/user");

class UsersController {
  verifyEmail = tryHandler(async (req, res, next) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
      throw HttpError(400, "virify token is not valid");
    }
    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.json({
      message: "Verify succsess",
    });
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

module.exports = new UsersController();
