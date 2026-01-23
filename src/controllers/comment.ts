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

export const listComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const postId = req.params.postId;

    const response = await commentService.listComments({ postId, page, limit });
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.currentUser) {
      throw new AuthenticationError();
    }
    await commentService.deleteComment({
      postId: req.params.postId,
      commentId: req.params.commentId,
      userId: req.currentUser.id,
    });
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
