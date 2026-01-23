import { api } from "./api";
import { CreateUserDto, UpdateUserDto, User } from "@/src/types/user.types";

export const usersService = {
  list: async (): Promise<User[]> => {
    const res = await api.get<User[]>("/users");
    return res.data;
  },
  create: async (dto: CreateUserDto): Promise<User> => {
    const res = await api.post<User>("/users", dto);
    return res.data;
  },
  update: async (id: number, dto: UpdateUserDto): Promise<User> => {
    const res = await api.put<User>(`/users/${id}`, dto);
    return res.data;
  },
  remove: async (id: number): Promise<{ ok: true }> => {
    const res = await api.delete<{ ok: true }>(`/users/${id}`);
    return res.data;
  },
};
