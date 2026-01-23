import { api } from "./api";
import { LoginDto, RegisterDto, AuthResponse } from "@/src/types/auth.types";

type MeResponse = {
  user: {
    sub: number;
    email: string;
    name?: string;
    role: "USER" | "ADMIN";
  };
};

export const authService = {
  register: async (dto: RegisterDto) => {
    const res = await api.post("/auth/register", dto);
    return res.data;
  },

  login: async (dto: LoginDto): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/auth/login", dto);
    return res.data;
  },

  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/auth/refresh", { refreshToken });
    return res.data;
  },

  me: async (): Promise<MeResponse> => {
    const res = await api.get<MeResponse>("/me");
    return res.data;
  },
};
