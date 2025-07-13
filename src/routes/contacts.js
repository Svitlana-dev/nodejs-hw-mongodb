import express from 'express';
import {
  createContact,
  updateContact,
  getContactById,
  deleteContact,
} from '../controllers/contacts.js';
import validateBody from '../middlewares/validateBody.js';
import isValidId from '../middlewares/isValidId.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../schemas/contactSchemas.js';

const router = express.Router();

router.post('/', validateBody(createContactSchema), createContact);

router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  updateContact,
);

router.get('/:contactId', isValidId, getContactById);
router.delete('/:contactId', isValidId, deleteContact);

export default router;
