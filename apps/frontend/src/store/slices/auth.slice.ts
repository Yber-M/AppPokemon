import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthUser } from "@/src/types/auth.types";
import { tokenStorage } from "@/src/utils/token";

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession: (
      state,
      action: PayloadAction<{
        user: AuthUser;
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      const { user, accessToken, refreshToken } = action.payload;
      tokenStorage.setAccess(accessToken);
      tokenStorage.setRefresh(refreshToken);
      state.user = user;
      state.isAuthenticated = true;
    },
    clearSession: (state) => {
      tokenStorage.clear();
      state.user = null;
      state.isAuthenticated = false;
    },
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
    },
  },
});

export const { setSession, clearSession, setUser } = authSlice.actions;
export default authSlice.reducer;
