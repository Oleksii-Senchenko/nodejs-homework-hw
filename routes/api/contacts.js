const express = require("express");

const HttpError = require("../../helpers/HttpError");
const Contact = require("../../models/contact");
const router = express.Router();
const { isValidObjectId } = require("mongoose");
const { addSchema, updateFavoriteSchema } = require("../../schemas/contact");

router.get("/", async (req, res, next) => {
  try {
    const result = await Contact.find();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    if (!isValidObjectId(contactId)) {
      throw HttpError(400, `${contactId} is not valid ID`);
    }
    const result = await Contact.findById(contactId);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await Contact.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { contactId } = req.params;
    if (!isValidObjectId(contactId)) {
      throw HttpError(400, `${contactId} is not valid ID`);
    }
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    // res.status(200).json(result);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.patch("/:contactId/favorite", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    if (!isValidObjectId(contactId)) {
      throw HttpError(400, `${contactId} is not valid ID`);
    }

    const { error } = updateFavoriteSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    if (!isValidObjectId(contactId)) {
      throw HttpError(400, `${contactId} is not valid ID`);
    }

    const result = await Contact.findByIdAndRemove(contactId);

    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
