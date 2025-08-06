import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const userPhotoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'users',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 250, height: 250, crop: 'fill' }],
  },
});

const contactPhotoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'contacts',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const memoryStorage = multer.memoryStorage();

export const uploadUserPhoto = multer({ storage: userPhotoStorage });
export const uploadContactPhoto = multer({ storage: contactPhotoStorage });
export const uploadMemory = multer({ storage: memoryStorage });
