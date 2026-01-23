import { configureStore } from "@reduxjs/toolkit";

const placeholderReducer = (state = null) => state;

export const store = configureStore({
  reducer: {
    placeholder: placeholderReducer,
    // auth: authReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
