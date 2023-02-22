const express = require("express");
const { validateBody, isValidId } = require("../../middlewares");
const ctrl = require("../../controllers/contacts");
const { schemas } = require("../../models/contact");

const router = express.Router();

router.get("/", ctrl.getAll);
router.get("/:contactId", isValidId, ctrl.getById);
router.post("/", validateBody(schemas.addSchema), ctrl.addContact);
router.delete("/:contactId", isValidId, ctrl.deleteContact);
router.put(
  "/:contactId",
  isValidId,
  validateBody(schemas.addSchema),
  ctrl.updateContact
);
router.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  ctrl.updateStatusContact
);

module.exports = router;
