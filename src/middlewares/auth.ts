import { NextFunction, Request, Response } from "express";

import { userRepository } from "../repositories";
import { AuthenticationError } from "../utils/errors";

const getTokenFromHeader = (req: Request) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return undefined;
  const [scheme, token] = authHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return undefined;
  }
  return token;
};

export const attachCurrentUser = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const token = getTokenFromHeader(req);
    if (!token) {
      return next();
    }

    const user = await userRepository.findByToken(token);
    if (user) {
      req.currentUser = user;
      req.authToken = token;
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.currentUser) {
    return next(new AuthenticationError());
  }
  return next();
};
