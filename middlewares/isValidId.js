const { isValidObjectId } = require("mongoose");
const HttpError = require("../helpers/HttpError");

const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    throw HttpError(400, `${contactId} is not valid ID`);
  }
  next();
};



module.exports = {
  isValidId,
};
