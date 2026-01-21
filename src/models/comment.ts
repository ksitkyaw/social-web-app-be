import mongoose, { Document, Schema } from "mongoose";

export interface CommentDocument extends Document {
  content: string;
  post: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<CommentDocument>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

const serialize = (_: unknown, ret: Record<string, any>) => {
  ret.id = ret._id.toString();
  ret.postId = ret.post?.toString();

  if (ret.user && typeof ret.user === "object") {
    const user = ret.user as Record<string, any>;
    const userId = (user._id ?? user.id)?.toString?.() ?? String(user);
    ret.author = {
      id: userId,
      name: user.name,
      email: user.email,
    };
  } else if (ret.user) {
    ret.author = {
      id: ret.user.toString(),
    };
  }

  delete ret.user;
  delete ret._id;
  delete ret.__v;
  return ret;
};

CommentSchema.set("toObject", { getters: true, virtuals: true, transform: serialize });
CommentSchema.set("toJSON", { getters: true, virtuals: true, transform: serialize });

export const CommentModel = mongoose.model<CommentDocument>("Comment", CommentSchema);
