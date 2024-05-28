import bcrypt from 'bcrypt';
import fs from "fs/promises";
import Jimp from 'jimp';
import path from "node:path";
import HttpError from "../helpers/HttpError.js";
import { handleErrors } from "../helpers/handleErrors.js";
import jwt from "jsonwebtoken";
import User from "../models/usersModel.js";
import gravatar from 'gravatar';
import { nanoid } from "nanoid";
import { sendEmail } from "../helpers/mail.js"; 

const { BASE_URL } = process.env;

export const register = handleErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  const emailInLowerCase = email.toLowerCase();

  const user = await User.findOne({ email: emailInLowerCase });
  if (user) {
    return res.status(409).json({ message: "User already registered" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();
  const gravatarUrl = gravatar.url(emailInLowerCase, { s: '200', r: 'pg', d: 'identicon' });

  const newUser = await User.create({
    name,
    email: emailInLowerCase,
    password: passwordHash,
    avatarURL: gravatarUrl,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click here to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    },
  });
});

export const login = handleErrors(async (req, res, next) => {
  const { email, password } = req.body;
  const emailInLowerCase = email.toLowerCase();

  const user = await User.findOne({ email: emailInLowerCase });
  if (!user) {
    return res.status(401).json({ message: "Email or password is incorrect" });
  }

  if (!user.verify) {
    return res.status(403).json({ message: "User not verified. Please check your email to verify your account." });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Email or password is incorrect" });
  }

  const token = jwt.sign(
    { id: user._id, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
  );

  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
});

export const logout = handleErrors(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { token: null });
  res.status(204).end();
});

export const getCurrent = handleErrors(async (req, res, next) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
});

export const updateAvatar = handleErrors(async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const { path: tempPath, filename } = req.file;
  const tempFilePath = path.resolve(tempPath);
  const outputDir = path.resolve('public/avatars');
  const outputFilePath = path.join(outputDir, filename);

  const image = await Jimp.read(tempFilePath);
  await image.resize(250, 250).writeAsync(tempFilePath);

  await fs.mkdir(outputDir, { recursive: true });
  await fs.rename(tempFilePath, outputFilePath);

  const avatarURL = `/avatars/${filename}`;
  const result = await User.findByIdAndUpdate(
    req.user.id,
    { avatarURL },
    { new: true }
  );

  res.status(200).json({ avatarURL: result.avatarURL });
});

export const verifyUser = handleErrors(async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.status(200).json({ message: "Verification successful" });
});

export const newVerifyEmail = handleErrors(async (req, res, next) => {
  const { email } = req.body;
  const emailInLowerCase = email.toLowerCase();

  const user = await User.findOne({ email: emailInLowerCase });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.verify) {
    return res.status(400).json({ message: "Verification has already been passed" });
  }

  let verificationToken = user.verificationToken;
  if (!verificationToken) {
    verificationToken = nanoid();
    await User.findByIdAndUpdate(user._id, { verificationToken });
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click here to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(200).json({ message: "Verification email sent" });
});

export default {
  register,
  login,
  logout,
  getCurrent,
  updateAvatar,
  verifyUser,
  newVerifyEmail,
};
