import { api } from "./api";
import { LoginDto, RegisterDto, AuthResponse } from "@/src/types/auth.types";

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
};
