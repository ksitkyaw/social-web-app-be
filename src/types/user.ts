export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserParams = Omit<User, "id" | "createdAt" | "updatedAt">;
