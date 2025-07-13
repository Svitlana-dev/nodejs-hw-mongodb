import { isValidObjectId } from 'mongoose';
import createError from 'http-errors';

export default function isValidId(req, res, next) {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    throw createError(400, 'Invalid contact ID');
  }
  next();
}
