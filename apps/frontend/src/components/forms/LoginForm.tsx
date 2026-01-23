"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/src/services/auth.service";
import { useAppDispatch } from "@/src/store/hooks";
import { setSession } from "@/src/store/slices/auth.slice";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { useToast } from "@/src/components/ui/ToastProvider";
import type { UserSession } from "@/src/types/user.types";

export function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data: UserSession = await authService.login({ email, password });
      dispatch(setSession(data));
      toast.success("Inicio de sesión exitoso");
      const role = data.user?.role ?? data.role;
      if (role === "ADMIN") {
        router.replace("/users");
      } else {
        router.replace("/pokemon");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-sky-200">Hellor World!</p>
          <h1 className="text-3xl font-semibold text-white">Iniciar sesión</h1>
          <p className="mt-1 text-sm text-white/70">
            Ingresa tus credenciales para gestionar usuarios y explorar Pokemon.
          </p>
        </div>
        <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/70">
          Seguro con JWT
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80">Correo</label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80">Contraseña</label>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
        <div className="space-y-3 gap-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <Button disabled={loading} type="submit">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/30 border-t-slate-900" />
                Ingresando...
              </span>
            ) : (
              "Entrar"
            )}
          </Button>

          <Button type="button" variant="ghost" onClick={() => router.push("/register")}> 
            Crear cuenta
          </Button>
        </div>
      </form>
    </div>
  );
}
