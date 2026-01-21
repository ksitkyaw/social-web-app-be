import { CreateUserParams } from "../types";
import { userRepository } from "../repositories";
import { validateParams } from "../utils/validator";
import { createUserSchema } from "../validation-schemas";

class UserService {
  @validateParams(createUserSchema)
  public async createUser(params: CreateUserParams) {
    const newUser = await userRepository.createUser(params);
    return newUser;
  }
}

export const userService = new UserService();
