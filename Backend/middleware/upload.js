import multer from "multer";
import cloudinary from "../config/cloud.js";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({
  storage,

  fileFilter: (req, file, cb) => {

    if (
      file.mimetype.startsWith("image") ||
      file.mimetype.startsWith("video")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only images/videos allowed"));
    }
  },
});



export const uploadToCloudinary = (filePath) => {

  return new Promise((resolve, reject) => {

    cloudinary.uploader.upload(
      filePath,
      {
        folder: "properties",
        resource_type: "auto",
      },

      (error, result) => {

        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);
          }
        });

        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};