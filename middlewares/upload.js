const multer = require("multer");
const path = require("path");

const endPoint = path.resolve("temp");

const storage = multer.diskStorage({
  destination: endPoint,
  filename: (req, file, cb) => {
    const fileName = Date.now() + "_" + file.originalname 
    cb(null, fileName);
  },
});

// const fileFilter = (req, file, cb) => {
//   const fileExtension = file.originalname.split(".").pop();
//   if (!["jpg", "jpeg", "png", "gif"].includes(fileExtension.toLowerCase())) {
//     cb(new Error("File extentions not allow"));
//   }
//   cb(null, true);
// };
const limits = {
  fileSize: 5 * 1024 * 1024,
};
const upload = multer({
  storage,
  limits
});

module.exports = upload;
