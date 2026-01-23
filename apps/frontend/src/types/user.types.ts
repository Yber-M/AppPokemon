export type User = {
  id: number;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
};

export type CreateUserDto = {
  email: string;
  name: string;
  password: string;
  role?: "USER" | "ADMIN";
};

export type UpdateUserDto = {
  email?: string;
  name?: string;
  password?: string;
  role?: "USER" | "ADMIN";
};
