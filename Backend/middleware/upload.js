import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// __dirname fix (ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload directories
const photoDir = path.join(__dirname, "../uploads/photos");
const videoDir = path.join(__dirname, "../uploads/videos");

// Ensure folders exist
if (!fs.existsSync(photoDir)) fs.mkdirSync(photoDir, { recursive: true });
if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "photos") {
      cb(null, photoDir);
    } else if (file.fieldname === "video") {
      cb(null, videoDir);
    } else {
      cb(new Error("Unknown field: " + file.fieldname));
    }
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const imageTypes = /jpeg|jpg|png|webp/;
  const videoTypes = /mp4|mov|avi|mkv|webm/;

  const ext = path.extname(file.originalname).toLowerCase().replace(".", "");

  if (file.fieldname === "photos" && imageTypes.test(ext)) {
    cb(null, true);
  } else if (file.fieldname === "video" && videoTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type for "${file.fieldname}". Only images or videos allowed.`
      ),
      false
    );
  }
};

// Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});

// Accept multiple photos + 1 video
const uploadPropertyMedia = upload.fields([
  { name: "photos", maxCount: 10 },
  { name: "video", maxCount: 1 },
]);

// Middleware wrapper (IMPORTANT EXPORT)
export const handleUpload = (req, res, next) => {
  uploadPropertyMedia(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: "Upload error: " + err.message,
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    next();
  });
};