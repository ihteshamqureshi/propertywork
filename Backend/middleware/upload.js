import multer from "multer";
import path from "path";
import fs from "fs";

// ======================================================
// CONFIGURATION
// ======================================================
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_PHOTOS = 10;
const MAX_VIDEOS = 1;

// Allowed image types
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

// Allowed video types
const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/mpeg",
  "video/quicktime",
  "video/x-msvideo",
  "video/webm",
];

const ALLOWED_FILE_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

// ======================================================
// CREATE UPLOAD FOLDER
// ======================================================
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  console.log("✅ Uploads folder created:", UPLOAD_DIR);
}

// ======================================================
// MULTER STORAGE
// ======================================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const sanitizedName = file.originalname.replace(/\s+/g, "_");
    const uniqueName = `${Date.now()}-${sanitizedName}`;
    cb(null, uniqueName);
  },
});

// ======================================================
// FILE FILTER
// ======================================================
const fileFilter = (req, file, cb) => {
  if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images and videos are allowed"), false);
  }
};

// ======================================================
// MULTER INSTANCE
// ======================================================
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_PHOTOS + MAX_VIDEOS,
  },
});

// ======================================================
// UPLOAD FIELDS
// ======================================================
export const uploadFields = upload.fields([
  { name: "photos", maxCount: MAX_PHOTOS },
  { name: "video", maxCount: MAX_VIDEOS },
]);

// ======================================================
// SINGLE FILE UPLOADS
// ======================================================
export const uploadPhoto = upload.single("photo");
export const uploadVideo = upload.single("video");
export const uploadMultiple = upload.array("photos", MAX_PHOTOS);

// ======================================================
// FILE URL HELPER
// ======================================================
export const getFileUrl = (req, filename) => {
  if (!filename) return null;
  return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
};

// ======================================================
// DELETE FILE
// ======================================================
export const deleteFile = (filepath) => {
  if (!filepath) return false;
  try {
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
};

// ======================================================
// DELETE MULTIPLE FILES
// ======================================================
export const deleteMultipleFiles = (files = []) => {
  const results = [];
  files.forEach((file) => {
    if (file && typeof file === "string") {
      results.push(deleteFile(file));
    } else if (file && file.path) {
      results.push(deleteFile(file.path));
    }
  });
  return results;
};

// ======================================================
// MULTER ERROR HANDLER
// ======================================================
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "FILE_TOO_LARGE") {
      return res.status(400).json({
        success: false,
        message: `File too large. Max ${MAX_FILE_SIZE / (1024 * 1024)} MB`,
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: `Too many files. Max ${MAX_PHOTOS} photos and ${MAX_VIDEOS} video`,
      });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message: "Unexpected field. Use 'photos' or 'video'",
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  next();
};

// ======================================================
// EXPORTS
// ======================================================
export {
  UPLOAD_DIR,
  MAX_FILE_SIZE,
  MAX_PHOTOS,
  MAX_VIDEOS,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  upload,
};