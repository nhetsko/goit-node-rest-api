import * as fs from "node:fs/promises";
import path from "node:path";
import gravatar from 'gravatar';
import Jimp from "jimp";

import User from "../models/usersModel.js";

async function getAvatar(req, res, next) {
  try {
    const user = await User.findById(req.user.id);

    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    if (user.avatarURL === null) {
      return res.status(404).send({ message: "Avatar not found" });
    }

    res.sendFile(path.resolve("public/avatars", user.avatarURL));
  } catch (error) {
    next(error);
  }
}

async function uploadAvatar(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded" });
    }

    const avatarPath = path.resolve("public/avatars", req.file.filename);

    const image = await Jimp.read(req.file.path);
    await image.resize(250, 250).writeAsync(avatarPath);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL: req.file.filename },
      { new: true },
    );

    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(user);
  } catch (error) {
    next(error);
  }
}

export default { getAvatar, uploadAvatar };