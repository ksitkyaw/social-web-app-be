import { FilterQuery } from "mongoose";

import { PostModel, PostDocument } from "../models";

type CreatePostPayload = {
  title: string;
  content: string;
  image?: string;
  userId: string;
};

const createPost = (payload: CreatePostPayload) => {
  const { userId, title, content, image } = payload;
  return PostModel.create({
    title,
    content,
    image,
    user: userId,
  });
};

const findById = (postId: string) => {
  return PostModel.findById(postId).populate("user", "name email");
};

const updatePost = (postId: string, update: Partial<PostDocument>) => {
  return PostModel.findByIdAndUpdate(postId, update, { new: true }).populate("user", "name email");
};

const findByIdAndUser = (postId: string, userId: string) => {
  return PostModel.findOne({ _id: postId, user: userId }).populate("user", "name email");
};

const listPosts = async (
  filter: FilterQuery<PostDocument>,
  options: { page: number; limit: number },
) => {
  const { page, limit } = options;
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    PostModel.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    PostModel.countDocuments(filter),
  ]);

  return { data, total };
};

const countByUser = (userId: string) => PostModel.countDocuments({ user: userId });

export default {
  createPost,
  findById,
  findByIdAndUser,
  updatePost,
  listPosts,
  countByUser,
};
