import Contact from '../models/contact.js';

export async function fetchAll() {
  return Contact.find({});
}

export async function fetchById(id) {
  return Contact.findById(id);
}
