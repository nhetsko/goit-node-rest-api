import bcrypt from 'bcrypt';
import HttpError from "../helpers/HttpError.js";
import { handleErrors } from "../helpers/handleErrors.js";
import jwt from "jsonwebtoken";
import User from "../models/usersModel.js";

export const register = handleErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const emailInLowerCase = email.toLowerCase();

  try {
    const user = await User.findOne({ email: emailInLowerCase });

    if (user !== null) {
      return res.status(409).send({ message: "User already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const gravatarUrl = gravatar.url(emailInLowerCase, { s: '200', r: 'pg', d: '404' });

    const response = await axios({
      url: gravatarUrl,
      responseType: 'arraybuffer'
    });
    const buffer = Buffer.from(response.data, 'binary');

    const avatarFilename = `${emailInLowerCase}-avatar.png`;
    const avatarPath = path.resolve("public/avatars", avatarFilename);
    const image = await Jimp.read(buffer);
    await image.resize(250, 250).writeAsync(avatarPath);

    const newUser = await User.create({
      name,
      email: emailInLowerCase,
      password: passwordHash,
      avatarURL: avatarFilename,
    });

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
});

export const login = handleErrors(async (req, res, next) => {
  const { email, password } = req.body;

  const emailInLowerCase = email.toLowerCase();

  try {
    const user = await User.findOne({ email: emailInLowerCase });

    if (user === null) {
      console.log("Email");
      return res
        .status(401)
        .send({ message: "Email or password is incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      console.log("Password");
      return res
        .status(401)
        .send({ message: "Email or password is incorrect" });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: 60 * 60 },
    );

    await User.findByIdAndUpdate(user._id, { token });
 
    res.status(200).json({
      token: token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
});

export const logout = handleErrors(async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export const getCurrent = handleErrors(async (req, res, next) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
});

export default {
  register,
  login,
  logout,
  getCurrent,
};

