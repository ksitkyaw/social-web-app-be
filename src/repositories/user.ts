import { UserModel, UserDocument } from "../models";

const createUser = (payload: Pick<UserDocument, "name" | "email" | "password">) => {
  return UserModel.create(payload);
};

const findByEmail = (email: string) => {
  return UserModel.findOne({ email });
};

const findById = (id: string) => {
  return UserModel.findById(id);
};

const findByToken = (token: string) => {
  return UserModel.findOne({ tokens: token });
};

const addToken = (userId: string, token: string) => {
  return UserModel.findByIdAndUpdate(
    userId,
    { $addToSet: { tokens: token } },
    { new: true },
  );
};

const removeToken = (userId: string, token: string) => {
  return UserModel.findByIdAndUpdate(
    userId,
    { $pull: { tokens: token } },
    { new: true },
  );
};

export default {
  createUser,
  findByEmail,
  findById,
  findByToken,
  addToken,
  removeToken,
};
