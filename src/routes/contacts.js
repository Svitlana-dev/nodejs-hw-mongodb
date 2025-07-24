import express from 'express';
import {
  createContact,
  updateContact,
  getContactById,
  deleteContact,
  getAllContacts,
} from '../controllers/contacts.js';
import validateBody from '../middlewares/validateBody.js';
import isValidId from '../middlewares/isValidId.js';
import authenticate from '../middlewares/authenticate.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../schemas/contactSchemas.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getAllContacts);
router.get('/:contactId', isValidId, getContactById);
router.post('/', validateBody(createContactSchema), createContact);
router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  updateContact,
);
router.delete('/:contactId', isValidId, deleteContact);

export default router;
