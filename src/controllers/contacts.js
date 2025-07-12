import { fetchAll, fetchById } from '../services/contacts.js';

export async function getAllContacts(req, res, next) {
  try {
    const data = await fetchAll();
    res.json({ status: 200, message: 'Successfully found contacts!', data });
  } catch (err) {
    next(err);
  }
}

export async function getContactById(req, res, next) {
  try {
    const { contactId } = req.params;
    const contact = await fetchById(contactId);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (err) {
    next(err);
  }
}
