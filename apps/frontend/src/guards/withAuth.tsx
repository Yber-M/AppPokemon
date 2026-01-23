"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authService } from "@/src/services/auth.service";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { setUser } from "@/src/store/slices/auth.slice";
import { tokenStorage } from "@/src/utils/token";

export function useAuthGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const role = useAppSelector((s) => s.auth.user?.role);

  const applyRoleGate = (currentRole?: "USER" | "ADMIN") => {
    const onUsersPage = pathname?.startsWith("/users");
    if (onUsersPage && currentRole === "USER") {
      router.replace("/pokemon");
    }
  };

  useEffect(() => {
    const access = tokenStorage.getAccess();
    const refresh = tokenStorage.getRefresh();

    if (!access && !refresh) {
      router.replace("/login");
      return;
    }

    let active = true;

    const hydrateAndGuard = async () => {
      if (!role) {
        try {
          const me = await authService.me();
          if (!active) return;
          const user = me?.user;
          if (user) {
            dispatch(
              setUser({
                id: user.sub,
                email: user.email,
                name: user.name ?? "",
                role: user.role,
              })
            );
            applyRoleGate(user.role);
            return;
          }
        } catch (error) {
          if (!active) return;
          tokenStorage.clear();
          router.replace("/login");
          return;
        }
      }

      applyRoleGate(role);
    };

    hydrateAndGuard();

    return () => {
      active = false;
    };
  }, [pathname, role, router, dispatch]);
}
