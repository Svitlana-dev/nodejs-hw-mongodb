import multer from 'multer';

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME.includes(file.mimetype)) {
    return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'photo'));
  }
  cb(null, true);
};

export const uploadUserPhoto = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE, files: 1, fields: 20, parts: 21 },
});

export const uploadContactPhoto = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE, files: 1, fields: 20, parts: 21 },
});
