import { Request, Response, NextFunction } from "express";

import { postService } from "../services";
import { AuthenticationError } from "../utils/errors";

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.currentUser) {
      throw new AuthenticationError();
    }
    const post = await postService.createPost({ ...req.body, userId: req.currentUser.id });
    return res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.currentUser) {
      throw new AuthenticationError();
    }
    const post = await postService.updatePost({
      ...req.body,
      postId: req.params.postId,
      userId: req.currentUser.id,
    });
    return res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const listMyPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.currentUser) {
      throw new AuthenticationError();
    }
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const response = await postService.listMyPosts({
      page,
      limit,
      userId: req.currentUser.id,
    });
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const listPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const response = await postService.listPosts({ page, limit });
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
