import express from "express";

import { userService } from "../services";
import { AuthenticationError } from "../utils/errors";

export const registerUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const response = await userService.register(req.body);
    return res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const response = await userService.login(req.body);
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    if (!req.currentUser) {
      throw new AuthenticationError();
    }
    const response = await userService.logout(req.currentUser.id, req.authToken);
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    if (!req.currentUser) {
      throw new AuthenticationError();
    }
    const profile = await userService.getProfile(req.currentUser.id);
    return res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};
