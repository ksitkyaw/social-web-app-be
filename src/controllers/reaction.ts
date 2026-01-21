import { NextFunction, Request, Response } from "express";

import { reactionService } from "../services";
import { AuthenticationError } from "../utils/errors";

export const toggleReaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.currentUser) {
      throw new AuthenticationError();
    }

    const reaction = await reactionService.toggleReaction({
      ...req.body,
      postId: req.params.postId,
      userId: req.currentUser.id,
    });

    return res.status(200).json(reaction);
  } catch (error) {
    next(error);
  }
};
