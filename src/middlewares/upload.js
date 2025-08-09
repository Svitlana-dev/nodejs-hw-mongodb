import multer from 'multer';

const storage = multer.memoryStorage();

export const uploadContactPhoto = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 20, parts: 21 },
});

export const uploadUserPhoto = uploadContactPhoto;
