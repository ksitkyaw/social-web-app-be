import {
  AuthResponse,
  LoginUserParams,
  LogoutResponse,
  ProfileResponse,
  RegisterUserParams,
  UserDTO,
} from "../types";
import {
  commentRepository,
  postRepository,
  reactionRepository,
  userRepository,
} from "../repositories";
import { validateParams } from "../utils/validator";
import { loginUserSchema, registerUserSchema } from "../validation-schemas";
import {
  AuthenticationError,
  BadRequestError,
  NotFoundError,
} from "../utils/errors";
import { compareKeys, generateAuthToken, generateSecretHash } from "../utils/auth";
import { UserDocument } from "../models";

class UserService {
  @validateParams(registerUserSchema)
  public async register(params: RegisterUserParams): Promise<AuthResponse> {
    const { name, email, password, passwordConfirmation } = params;

    if (password !== passwordConfirmation) {
      throw new BadRequestError("Password confirmation does not match");
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await userRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new BadRequestError("Email is already registered");
    }

    const hashedPassword = generateSecretHash(password);
    const user = await userRepository.createUser({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = generateAuthToken();
    await userRepository.addToken(user.id, token);

    return {
      token,
      user: this.toUserDTO(user),
    };
  }

  @validateParams(loginUserSchema)
  public async login(params: LoginUserParams): Promise<AuthResponse> {
    const { email, password } = params;

    const user = await userRepository.findByEmail(email.toLowerCase());
    if (!user) {
      throw new AuthenticationError("Invalid credentials");
    }

    const isValid = compareKeys({ storedKey: user.password, suppliedKey: password });
    if (!isValid) {
      throw new AuthenticationError("Invalid credentials");
    }

    const token = generateAuthToken();
    await userRepository.addToken(user.id, token);

    return {
      token,
      user: this.toUserDTO(user),
    };
  }

  public async logout(userId: string, token?: string): Promise<LogoutResponse> {
    if (!token) {
      throw new AuthenticationError("Authorization token not found");
    }

    await userRepository.removeToken(userId, token);

    return {
      success: true,
      message: "Logged out successfully",
    };
  }

  public async getProfile(userId: string): Promise<ProfileResponse> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const [postCount, reactionCount, commentCount] = await Promise.all([
      postRepository.countByUser(userId),
      reactionRepository.countByUser(userId),
      commentRepository.countByUser(userId),
    ]);

    return {
      ...this.toUserDTO(user),
      postCount,
      reactionCount,
      commentCount,
    };
  }

  private toUserDTO(user: UserDocument): UserDTO {
    const safeUser = user.toJSON() as UserDTO;
    return safeUser;
  }
}

export const userService = new UserService();
