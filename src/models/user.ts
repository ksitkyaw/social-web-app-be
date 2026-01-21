import mongoose, { Document, Schema } from "mongoose";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  tokens: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    tokens: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

UserSchema.index({ email: 1 }, { unique: true });

const serialize = (_: unknown, ret: Record<string, any>) => {
  ret.id = ret._id.toString();
  delete ret._id;
  delete ret.__v;
  delete ret.password;
  delete ret.tokens;
  return ret;
};

UserSchema.set("toObject", { getters: true, virtuals: true, transform: serialize });
UserSchema.set("toJSON", { getters: true, virtuals: true, transform: serialize });

export const UserModel = mongoose.model<UserDocument>("User", UserSchema);
