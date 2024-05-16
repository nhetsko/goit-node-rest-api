import HttpError from "../helpers/HttpError.js";
import { handleErrors} from "../helpers/handleErrors.js";
import Contact from '../models/contactModel.js';
import {isValidObjectId } from 'mongoose';

export const getAllContacts = handleErrors(async (req, res, next) => {
  const { id: userId } = req.user;
  try {
    const result = await Contact.find({ owner: userId }).populate(
      "owner",
      "_id name email subscription"
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export const getOneContact = handleErrors(async (req, res, next) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  try {
    if (!userId.equals(result.owner._id)) {
      throw HttpError(403, "You are not authorized to access this contact");
    }

    const result = await Contact.findById(id).populate(
      "owner",
      "_id name email subscription"
    );

    if (!result) {
      throw HttpError(404);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export const deleteContact = handleErrors(async (req, res, next) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  try {
    if (!userId.equals(result.owner)) {
      throw HttpError(403, "You are not authorized to remove this contact");
    }

    const result = await Contact.findByIdAndDelete(id);
    if (!result) {
      throw HttpError(404);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export const createContact = handleErrors(async (req, res, next) => {
  const { id } = req.user;
  try {
    const result = await Contact.create({ ...req.body, owner: id });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

export const updateContact = handleErrors(async (req, res, next) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  try {
    if (!userId.equals(result.owner)) {
      throw HttpError(403, "You are not authorized to update this contact");
    }

    const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
    if (!result) {
      throw HttpError(404);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export const updateFavoriteContact = handleErrors(async (req, res, next) => {
  const { id } = req.params;
  const { favorite } = req.body;
  const { id: userId } = req.user;
  try {
    if (!userId.equals(result.owner)) {
      throw HttpError(403, "You are not authorized to update this contact");
    }

    const result = await Contact.findByIdAndUpdate(
      id,
      { favorite },
      { new: true }
    );

    if (!result) {
      throw HttpError(404);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});