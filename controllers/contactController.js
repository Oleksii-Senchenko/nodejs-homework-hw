// const path = require("path");
const HttpError = require("../helpers/HttpError");
const tryHandler = require("../middlewares/tryHandler");
const Contact = require("../models/contact");
const { addSchema, updateFavoriteSchema } = require("../schemasJOI/contact");
// const fs = require("fs");

// const avatarsPath = path.resolve("public", "avatars");

class ContactController {
  add = tryHandler(async (req, res, next) => {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { _id: owner } = req.user;



    const result = await Contact.create({ ...req.body, owner });
    res.status(201).json(result);
  });

  getAll = tryHandler(async (req, res, next) => {
    const { _id: owner } = req.user;

    const result = await Contact.find({ owner });
    res.json(result);
  });

  getById = tryHandler(async (req, res, next) => {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  });

  update = tryHandler(async (req, res, next) => {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { contactId } = req.params;

    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    res.json(result);
  });

  updateElem = tryHandler(async (req, res, next) => {
    const { contactId } = req.params;

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
  });
  remove = tryHandler(async (req, res, next) => {
    const { contactId } = req.params;

    const result = await Contact.findByIdAndRemove(contactId);

    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json({ message: "contact deleted" });
  });




  updateAvatar = tryHandler(async (req, res, next) => {
    const { contactId } = req.params;

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
  });
}
module.exports = new ContactController();
