export type UserDTO = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ProfileDTO = UserDTO & {
  postCount: number;
  reactionCount: number;
  commentCount: number;
};

export type AuthResponse = {
  token: string;
  user: UserDTO;
};

export type LogoutResponse = {
  success: boolean;
  message: string;
};

export type RegisterUserParams = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

export type LoginUserParams = {
  email: string;
  password: string;
};

export type ProfileResponse = ProfileDTO;
