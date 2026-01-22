import { NextFunction, Request, Response } from "express";

import { uploadService } from "../services";
import { AuthenticationError } from "../utils/errors";

export const generatePresignedUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.currentUser) {
      throw new AuthenticationError();
    }

    const { folder, contentType, options } = req.body ?? {};

    const result = await uploadService.generatePresignedUrl({
      folder,
      contentType,
      userId: req.currentUser.id,
      options,
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
