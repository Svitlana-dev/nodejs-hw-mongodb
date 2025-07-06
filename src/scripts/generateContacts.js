import { readContacts } from '../utils/readContacts.js';
import { writeContacts } from '../utils/writeContacts.js';
import { createFakeContact } from '../utils/createFakeContact.js';

const generateContacts = async (number = 5) => {
  const contacts = await readContacts();
  const newContacts = Array.from({ length: number }, createFakeContact);
  await writeContacts([...contacts, ...newContacts]);
};

generateContacts(5);
