import express from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../controllers/contacts.js';

import validateBody from '../middlewares/validateBody.js';
import isValidId from '../middlewares/isValidId.js';
import {
  contactCreateSchema,
  contactUpdateSchema,
} from '../schemas/contactSchemas.js';
import authenticate from '../middlewares/authenticate.js';
import { uploadContactPhoto } from '../middlewares/upload.js';

const router = express.Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getAllContacts));
router.get('/:contactId', isValidId, ctrlWrapper(getContactById));

router.post(
  '/',
  uploadContactPhoto.single('photo'),
  validateBody(contactCreateSchema),
  ctrlWrapper(createContact),
);

router.patch(
  '/:contactId',
  isValidId,
  uploadContactPhoto.single('photo'),
  validateBody(contactUpdateSchema),
  ctrlWrapper(updateContact),
);

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContact));

export default router;
