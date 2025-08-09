import express from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../controllers/contacts.js';
import isValidId from '../middlewares/isValidId.js';
import authenticate from '../middlewares/authenticate.js';
import { uploadContactPhoto } from '../middlewares/upload.js';
import multer from 'multer';

const router = express.Router();

router.use(authenticate);

const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      status: 400,
      message: `MULTER_${err.code}`,
      data: err.message,
    });
  }
  next(err);
};

router.get('/', ctrlWrapper(getAllContacts));
router.get('/:contactId', isValidId, ctrlWrapper(getContactById));

router.post(
  '/',
  uploadContactPhoto.single('photo'),
  multerErrorHandler,
  ctrlWrapper(createContact),
);

router.patch(
  '/:contactId',
  isValidId,
  uploadContactPhoto.single('photo'),
  multerErrorHandler,
  ctrlWrapper(updateContact),
);

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContact));

router.post(
  '/_debug',
  uploadContactPhoto.single('photo'),
  multerErrorHandler,
  (req, res) => {
    res.json({
      contentType: req.headers['content-type'],
      hasFile: !!req.file,
      file: req.file && {
        fieldname: req.file.fieldname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        hasBuffer: !!req.file.buffer,
      },
      bodyKeys: Object.keys(req.body || {}),
    });
  },
);

export default router;
