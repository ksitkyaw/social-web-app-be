import { UserModel } from "../models/user";
import { CreateUserParams } from "../types";

const createUser = async (payload: CreateUserParams) => {
  const newUser = await UserModel.create(payload);
  return newUser;
};

export default {
  createUser,
};
