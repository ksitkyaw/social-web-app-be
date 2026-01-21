import mongoose from "mongoose";

import { CommentModel, CommentDocument } from "../models";

const createComment = async (payload: { content: string; postId: string; userId: string }) => {
  const comment = await CommentModel.create({
    content: payload.content,
    post: new mongoose.Types.ObjectId(payload.postId),
    user: new mongoose.Types.ObjectId(payload.userId),
  });

  return comment.populate("user", "name email");
};

const countByUser = (userId: string) => CommentModel.countDocuments({ user: userId });

const countByPost = (postId: string) => CommentModel.countDocuments({ post: postId });

const countByPosts = async (postIds: string[]) => {
  if (!postIds.length) {
    return {} as Record<string, number>;
  }

  const results = await CommentModel.aggregate<{
    _id: mongoose.Types.ObjectId;
    count: number;
  }>([
    { $match: { post: { $in: postIds.map((id) => new mongoose.Types.ObjectId(id)) } } },
    { $group: { _id: "$post", count: { $sum: 1 } } },
  ]);

  return results.reduce<Record<string, number>>((acc, item) => {
    acc[item._id.toString()] = item.count;
    return acc;
  }, {});
};

export default {
  createComment,
  countByUser,
  countByPost,
  countByPosts,
};
