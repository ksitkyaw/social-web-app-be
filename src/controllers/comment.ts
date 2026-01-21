import { NextFunction, Request, Response } from "express";

import { commentService } from "../services";
import { AuthenticationError, BadRequestError } from "../utils/errors";

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.currentUser) {
      throw new AuthenticationError();
    }
    const { content } = req.body;
    if (!content) {
      throw new BadRequestError("Comment content is required");
    }

    const comment = await commentService.createComment({
      content,
      postId: req.params.postId,
      userId: req.currentUser.id,
    });

    return res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};
