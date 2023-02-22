const contacts = require("../models/contacts");
const HttpError = require("../helpers/HttpError");
const ctrlWrapper = require("../helpers/ctrlWrapper");

const getAll = async (req, res) => {
  const result = await contacts.listContacts();
  res.json(result);
};

const getById = async (req, res) => {
  const { contactId: id } = req.params;
  const result = await contacts.getContactById(id);
  if (!result) {
    throw HttpError(404, `Contact with id ${id} not found`);
  }
  res.json(result);
};

const addContact = async (req, res) => {
  const result = await contacts.addContact(req.body);
  res.status(201).json(result);
};

const deleteContact = async (req, res) => {
  const { contactId: id } = req.params;
  const result = await contacts.removeContact(id);
  if (!result) {
    throw HttpError(404, `Contact with id ${id} not found`);
  }
  res.status(200).json(result);
};

const changeContact = async (req, res) => {
  const { contactId: id } = req.params;
  const result = await contacts.updateContact(id, req.body);
  if (!result) {
    throw HttpError(404, `Contact with id ${id} not found`);
  }
  res.status(200).json(result);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  addContact: ctrlWrapper(addContact),
  deleteContact: ctrlWrapper(deleteContact),
  changeContact: ctrlWrapper(changeContact),
};
