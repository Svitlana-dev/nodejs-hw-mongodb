import createError from 'http-errors';
import * as contactsService from '../services/contacts.js';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadBufferToCloudinary = (buffer, folder = 'contacts') =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, result) => (err ? reject(err) : resolve(result)),
    );
    stream.end(buffer);
  });

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
  if (!contact) throw createError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: 'Contact retrieved',
    data: contact,
  });
};

export const createContact = async (req, res, next) => {
  try {
    console.log('MULTER DEBUG (create):', {
      contentType: req.headers['content-type'],
      hasFile: !!req.file,
      file: req.file && {
        fieldname: req.file.fieldname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        hasBuffer: !!req.file.buffer,
        path: req.file?.path,
      },
      bodyKeys: Object.keys(req.body || {}),
    });

    const data = { ...req.body };
    if (req.file?.buffer?.length) {
      const { secure_url } = await uploadBufferToCloudinary(
        req.file.buffer,
        'contacts',
      );
      data.photo = secure_url;
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

export const updateContact = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log('MULTER DEBUG (update):', {
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
    }

    const { contactId } = req.params;
    const data = { ...req.body };

    if (req.file?.buffer?.length) {
      const { secure_url } = await uploadBufferToCloudinary(
        req.file.buffer,
        'contacts',
      );
      data.photo = secure_url;
    }

    const updated = await contactsService.updateContact(
      contactId,
      data,
      req.user._id,
    );
    if (!updated) throw createError(404, 'Contact not found');

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updated,
    });
  } catch (error) {
    if (error.name === 'MulterError') {
      return next(createError(400, error.message));
    }
    next(createError(500, error.message));
  }
};

export const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const deleted = await contactsService.removeContact(contactId, req.user._id);
  if (!deleted) throw createError(404, 'Contact not found');
  res.status(204).send();
};
