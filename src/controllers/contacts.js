import createError from 'http-errors';
import * as contactsService from '../services/contacts.js';
import { cloudinary } from '../utils/cloudinary.js';

export const getAllContacts = async (req, res) => {
  const result = await contactsService.getAllContacts(req.query, req.user._id);
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: result,
  });
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await contactsService.getContactById(contactId, req.user._id);
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Contact retrieved',
    data: contact,
  });
};

export const createContact = async (req, res, next) => {
  try {
    const data = { ...req.body };

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'contacts',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        uploadStream.end(req.file.buffer);
      });

      data.photo = result.secure_url;
    }

    const newContact = await contactsService.createContact(data, req.user._id);

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    next(createError(500, error.message));
  }
};

export const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const updated = await contactsService.updateContact(
    contactId,
    req.body,
    req.user._id,
  );
  if (!updated) {
    throw createError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updated,
  });
};

export const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const deleted = await contactsService.removeContact(contactId, req.user._id);
  if (!deleted) {
    throw createError(404, 'Contact not found');
  }
  res.status(204).send();
};
