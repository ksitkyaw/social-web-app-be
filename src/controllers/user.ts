import express from "express";
import { userService } from "../services";

export const createUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const userData = req.body;
  try {
    const User = await userService.createUser(userData);
    return res.status(201).json(User);
  } catch (err) {
    next(err);
  }
};
