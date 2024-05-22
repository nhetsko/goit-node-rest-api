import express from "express";

import UserController from "../controllers/usersControllers.js";

import uploadMiddleware from "../middlewares/upload.js";

const router = express.Router();

router.get("/avatar", UserController.getAvatar);
router.patch(
  "/avatar",
  uploadMiddleware.single("avatarURL"),
  UserController.uploadAvatar,
);

export default router;
