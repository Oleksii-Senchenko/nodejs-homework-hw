const express = require("express");
const userControllers = require("../../controllers/usersContoller");

const authenticate = require("../../middlewares/authenticate");
const upload = require("../../middlewares/upload");

const router = express.Router();

router.get(
  "/verify/:verificationToken",
  authenticate,
  userControllers.verifyEmail
);
router.get("/current", authenticate, userControllers.current);
router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  userControllers.updateAvatar
);

module.exports = router;
