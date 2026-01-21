import mongoose from "mongoose";

import { User } from "../types";

const UserSchema = new mongoose.Schema<User>(
  {
    name: String,
    email: String,
    password: String,
  },
  { timestamps: true },
);

UserSchema.set("toObject", { getters: true, virtuals: true });
UserSchema.set("toJSON", { getters: true, virtuals: true });

export const UserModel = mongoose.model("User", UserSchema);
