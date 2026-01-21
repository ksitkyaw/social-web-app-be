import mongoose, { Document, Schema } from "mongoose";

export interface ReactionDocument extends Document {
  type: string;
  post: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ReactionSchema = new Schema<ReactionDocument>(
  {
    type: {
      type: String,
      enum: ["like"],
      required: true,
      default: "like",
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

ReactionSchema.index({ post: 1, user: 1 }, { unique: true });

const serialize = (_: unknown, ret: Record<string, any>) => {
  ret.id = ret._id.toString();
  ret.postId = ret.post?.toString();
  ret.userId = ret.user?.toString();
  delete ret._id;
  delete ret.__v;
  return ret;
};

ReactionSchema.set("toObject", { getters: true, virtuals: true, transform: serialize });
ReactionSchema.set("toJSON", { getters: true, virtuals: true, transform: serialize });

export const ReactionModel = mongoose.model<ReactionDocument>("Reaction", ReactionSchema);
