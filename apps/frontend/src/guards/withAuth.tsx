"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { tokenStorage } from "@/src/utils/token";

export function useAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    const access = tokenStorage.getAccess();
    const refresh = tokenStorage.getRefresh();

    if (!access && !refresh) {
      router.replace("/login");
    }
  }, [router]);
}
