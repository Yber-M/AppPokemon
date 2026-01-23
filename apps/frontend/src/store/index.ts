import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import usersReducer from "./slices/users.slice";
import pokemonReducer from "./slices/pokemon.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    pokemon: pokemonReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
