export type RegisterDto = {
  email: string;
  name: string;
  password: string;
};

export type LoginDto = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: number;
  email: string;
  name: string;
  role?: "USER" | "ADMIN";
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};
