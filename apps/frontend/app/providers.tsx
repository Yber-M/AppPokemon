'use client';

import { Provider } from "react-redux";
import { store } from "@/src/store";
import { ToastProvider } from "@/src/components/ui/ToastProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ToastProvider>{children}</ToastProvider>
    </Provider>
  );
}
