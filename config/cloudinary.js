require("dotenv").config();

const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const multer = require("multer");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});



var storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'seefood',
  allowedFormats: ["jpg", "png"],
  filename: function(req, file, cb) {
    photo = new Date().getTime().toString();
    photo = bcrypt.hashSync(photo, bcrypt.genSaltSync(bcryptSalt));
    cb(undefined, photo);
  }
});

const uploadCloud = multer({ storage: storage })
module.exports = uploadCloud;
