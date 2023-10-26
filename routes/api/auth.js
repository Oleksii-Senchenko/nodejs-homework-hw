const express = require("express");
const authController = require("../../controllers/authController");
const validateBody = require("../../middlewares/validateBody");
const { registerSchema, loginSchema } = require("../../schemasJOI/user");
const authenticate = require("../../middlewares/authenticate");
const upload = require("../../middlewares/upload");

const router = express.Router();

router.post("/register", validateBody(registerSchema), authController.register);
router.post("/login", validateBody(loginSchema), authController.login);
router.post("/logout", authenticate, authController.logout);
router.get("/current", authenticate, authController.current);
router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  authController.updateAvatar
);

module.exports = router;
