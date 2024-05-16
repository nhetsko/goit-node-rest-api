import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateFavoriteContact,
} from "../controllers/contactsControllers.js";
import validateBody from '../helpers/validateBody.js'
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema
} from "../schemas/contactsSchemas.js";
import { authenticate } from "../middlewares/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.get("/",authenticate, getAllContacts);

contactsRouter.get("/:id",authenticate, getOneContact);

contactsRouter.delete("/:id",authenticate, deleteContact);
contactsRouter.post(
  "/",
  authenticate,
  validateBody(createContactSchema),
  createContact
);

contactsRouter.put(
  "/:id",
  authenticate,
  validateBody(updateContactSchema),
  updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  authenticate,
  validateBody(updateFavoriteSchema),
  updateFavoriteContact
);

export default contactsRouter;