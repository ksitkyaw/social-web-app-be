import mongoose from "mongoose";

import { CommentModel } from "../models";

const createComment = async (payload: { content: string; postId: string; userId: string }) => {
  const comment = await CommentModel.create({
    content: payload.content,
    post: new mongoose.Types.ObjectId(payload.postId),
    user: new mongoose.Types.ObjectId(payload.userId),
  });

  return comment.populate("user", "name email");
};

const findById = (commentId: string) => CommentModel.findById(commentId).populate("user", "name email");

const listComments = async (
  filter: { postId: string },
  options: { page: number; limit: number },
) => {
  const { page, limit } = options;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    CommentModel.find({ post: filter.postId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name email"),
    CommentModel.countDocuments({ post: filter.postId }),
  ]);

  return { data, total };
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

const deleteComment = (commentId: string) => CommentModel.findByIdAndDelete(commentId);

export default {
  createComment,
  findById,
  listComments,
  countByUser,
  countByPost,
  countByPosts,
  deleteComment,
};
