const { Contact } = require("../models/contact");
const { HttpError, ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Contact.find({ owner }, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "email subscription");
  res.json(result);
};

const getById = async (req, res) => {
  const { contactId: id } = req.params;
  const result = await Contact.findById(id);
  if (!result) {
    throw HttpError(404, `Contact with id ${id} not found`);
  }
  res.json(result);
};

const addContact = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const deleteContact = async (req, res) => {
  const { contactId: id } = req.params;
  const result = await Contact.findByIdAndRemove(id);
  if (!result) {
    throw HttpError(404, `Contact with id ${id} not found`);
  }
  res.status(200).json(result);
};

const updateContact = async (req, res) => {
  const { contactId: id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, `Contact with id ${id} not found`);
  }
  res.status(200).json(result);
};

const updateStatusContact = async (req, res) => {
  const { contactId: id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, `missing field favorite`);
  }
  res.json(result);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  addContact: ctrlWrapper(addContact),
  deleteContact: ctrlWrapper(deleteContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
