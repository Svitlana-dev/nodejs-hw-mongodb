import { writeFile } from 'fs/promises';
import { PATH_DB } from '../constants/contacts.js';

export const writeContacts = async (updatedContacts) => {
  await writeFile(PATH_DB, JSON.stringify(updatedContacts, null, 2));
};
