import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CreateUserDto, UpdateUserDto, User } from "@/src/types/user.types";
import { usersService } from "@/src/services/users.service";

type UsersState = {
  items: User[];
  loading: boolean;
  error: string | null;
};

const initialState: UsersState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk("users/fetch", async () => {
  return await usersService.list();
});

export const createUser = createAsyncThunk("users/create", async (dto: CreateUserDto) => {
  return await usersService.create(dto);
});

export const updateUser = createAsyncThunk(
  "users/update",
  async ({ id, dto }: { id: number; dto: UpdateUserDto }) => {
    return await usersService.update(id, dto);
  }
);

export const deleteUser = createAsyncThunk("users/delete", async (id: number) => {
  await usersService.remove(id);
  return id;
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUsersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchUsers.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(fetchUsers.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message ?? "Error al cargar usuarios";
      })
      .addCase(createUser.fulfilled, (s, a) => {
        s.items = [...s.items, a.payload];
      })
      .addCase(createUser.rejected, (s, a) => {
        s.error = a.error.message ?? "Error al crear usuario";
      })
      .addCase(updateUser.fulfilled, (s, a) => {
        const idx = s.items.findIndex((u) => u.id === a.payload.id);
        if (idx >= 0) s.items[idx] = a.payload;
      })
      .addCase(updateUser.rejected, (s, a) => {
        s.error = a.error.message ?? "Error al actualizar usuario";
      })
      .addCase(deleteUser.fulfilled, (s, a) => {
        s.items = s.items.filter((u) => u.id !== a.payload);
      })
      .addCase(deleteUser.rejected, (s, a) => {
        s.error = a.error.message ?? "Error al eliminar usuario";
      });
  },
});

export const { clearUsersError } = usersSlice.actions;
export default usersSlice.reducer;
