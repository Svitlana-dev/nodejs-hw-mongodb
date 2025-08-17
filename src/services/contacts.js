import Contact from '../models/contact.js';

export const getAllContacts = async (query, userId) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = query;

  const pageNum = Number(page);
  const limitNum = Number(perPage);
  const skip = (pageNum - 1) * limitNum;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const filter = { userId };
  if (type) filter.contactType = type;
  if (typeof isFavourite !== 'undefined') {
    filter.isFavourite = isFavourite === true || isFavourite === 'true';
  }

  const totalItems = await Contact.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(totalItems / limitNum));
  const items = await Contact.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limitNum);

  return {
    items,
    page: pageNum,
    perPage: limitNum,
    totalItems,
    totalPages,
    hasPreviousPage: pageNum > 1,
    hasNextPage: pageNum < totalPages,
  };
};

export const getContactById = async (contactId, userId) => {
  return await Contact.findOne({ _id: contactId, userId });
};

export const createContact = async (body, userId) => {
  return await Contact.create({ ...body, userId });
};

export const updateContact = async (contactId, body, userId) => {
  return await Contact.findOneAndUpdate({ _id: contactId, userId }, body, {
    new: true,
  });
};

export const removeContact = async (contactId, userId) => {
  return await Contact.findOneAndDelete({ _id: contactId, userId });
};
