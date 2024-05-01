import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactbyId,
} from "../services/contactsServices.js";
import { handleErrors } from "../helpers/handleErrors.js";
import HttpError from "../helpers/HttpError.js";


export const getAllContacts = handleErrors(async (req, res) => {
  const result = await listContacts();
  res.status(200).send(result);
});

export const getOneContact = handleErrors(async (req, res) => {
  const result = await getContactById(req.params.id);
  if(!result) {
    throw HttpError(404);
  }
  res.status(200).json(result);
});

export const deleteContact = handleErrors (async (req, res) => {
  const result = await removeContact(req.params.id);
  if (!result) {
    throw HttpError(404);
  }
  res.status(200).json(result);
});

export const createContact = handleErrors(async (req, res) => {
  const { name, email, phone } = req.body;
  const result = await addContact(name, email, phone);
  res.status(201).json(result);
});

export const updateContact = handleErrors(async (req, res) => {
  const result = await updateContactbyId(req.params.id, req.body);
  if (!result) {
    throw HttpError(404);
  }
  res.status(200).json(result);
});
