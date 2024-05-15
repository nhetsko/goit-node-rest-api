import HttpError from "../helpers/HttpError.js";
import { handleErrors } from "../helpers/handleErrors.js";
import User from "../models/usersModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { json } from "express";

export const register = handleErrors(async (req, res, next) => {
  const { email, password } = req.body;
  const emailLowerCase = email.toLowerCase();
  const user = await User.findOne({ email: emailLowerCase });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const passHash = await bcrypt.hash(password, 10);

  const newUser = User.create({
    email: emailLowerCase,
    password: passHash,
  });

  res.status(201).json({ email, subscription: newUser.subscription });
});

export const login = handleErrors(async (req, res, next) => {
  const { email, password } = req.body;
  const emailLowerCase = email.toLowerCase();
  const user = await User.findOne({ email: emailLowerCase });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const isCompare = await bcrypt.compare(password, user.password);

  if (!isCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: 3600,
  });

  await User.findByIdAndUpdate(user._id, { token });
  res
    .status(200)
    .json({ token, user: { email, subscription: user.subscription } });
});

export const logout = handleErrors(async (req, res) => {
  const { id } = req.user;
  await User.findByIdAndUpdate(id, { token: "" });
  res.status(204).end();
});

export const getCurrent = handleErrors(async (req, res, next) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
});