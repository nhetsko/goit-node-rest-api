import express from "express";
import validateBody from "../helpers/validateBody.js";
import { registerSchema, loginSchema, emailSchema } from "../schemas/authSchemas.js";
import AuthController from "../controllers/authControllers.js";
import { authenticate } from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const authRouter = express.Router();
const jsonParser = express.json();

authRouter.post("/register", jsonParser, validateBody(registerSchema), AuthController.register);
authRouter.post("/login", jsonParser, validateBody(loginSchema), AuthController.login);
authRouter.post("/logout", authenticate, AuthController.logout);
authRouter.get("/current", authenticate, AuthController.getCurrent);
authRouter.patch("/avatars", authenticate, upload.single("avatarURL"), AuthController.updateAvatar);
authRouter.get("/verify/:verificationToken", AuthController.verifyUser);
authRouter.post("/verify", validateBody(emailSchema), AuthController.newVerifyEmail);

export default authRouter;