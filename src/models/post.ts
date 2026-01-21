import mongoose, { Document, Schema } from "mongoose";

export interface PostDocument extends Document {
  title: string;
  content: string;
  image?: string;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<PostDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
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

PostSchema.index({ user: 1, createdAt: -1 });

const serialize = (_: unknown, ret: Record<string, any>) => {
  ret.id = ret._id.toString();

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

  ret.image = typeof ret.image === "string" ? ret.image : null;

  delete ret.user;
  delete ret._id;
  delete ret.__v;
  return ret;
};

PostSchema.set("toObject", { getters: true, virtuals: true, transform: serialize });
PostSchema.set("toJSON", { getters: true, virtuals: true, transform: serialize });

export const PostModel = mongoose.model<PostDocument>("Post", PostSchema);
