const express = require("express");
const {
  getAll,
  getById,
  addContact,
  deleteContact,
  changeContact,
} = require("../../controllers/contacts");
const validateBody = require("../../middlewares/validateBody");
const { addShema } = require("../../schemas/contacts");

const router = express.Router();

router.get("/", getAll);
router.get("/:contactId", getById);
router.post("/", addContact);
router.delete("/:contactId", validateBody(addShema), deleteContact);
router.put("/:contactId", validateBody(addShema), changeContact);

module.exports = router;
