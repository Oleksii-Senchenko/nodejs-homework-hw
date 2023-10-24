const express = require("express");

const { isValidId } = require("../../middlewares/isValidId");
const contactController = require("../../controllers/contactController");
const authenticate = require("../../middlewares/authenticate");
const router = express.Router();
router.get("/",authenticate,contactController.getAll );

router.get("/:contactId",authenticate,isValidId,contactController.getById);

router.post("/",authenticate,contactController.add );

router.put("/:contactId",authenticate, isValidId,contactController.update );

router.patch("/:contactId/favorite",authenticate, isValidId,contactController.updateElem );

router.delete("/:contactId",authenticate, isValidId,contactController.remove );

module.exports = router;
