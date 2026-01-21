import mongoose from "mongoose";

import { ReactionModel } from "../models";

const toggleReaction = async (payload: { postId: string; userId: string; type?: "like" }) => {
  const { postId, userId, type = "like" } = payload;
  const existing = await ReactionModel.findOne({ post: postId, user: userId });

  if (existing) {
    await existing.deleteOne();
    const count = await ReactionModel.countDocuments({ post: postId });
    return { reacted: false, count };
  }

  await ReactionModel.create({
    post: new mongoose.Types.ObjectId(postId),
    user: new mongoose.Types.ObjectId(userId),
    type,
  });

  const count = await ReactionModel.countDocuments({ post: postId });
  return { reacted: true, count };
};

const countByUser = (userId: string) => ReactionModel.countDocuments({ user: userId });

const countByPosts = async (postIds: string[]) => {
  if (!postIds.length) {
    return {} as Record<string, number>;
  }

  const results = await ReactionModel.aggregate<{
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
  toggleReaction,
  countByUser,
  countByPosts,
};
