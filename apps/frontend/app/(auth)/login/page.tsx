"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/src/store/hooks";
import { setSession } from "@/src/store/slices/auth.slice";
import { authService } from "@/src/services/auth.service";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await authService.login({ email, password });
      dispatch(setSession(data));
      router.replace("/users");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.12),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.12),transparent_22%),radial-gradient(circle_at_50%_80%,rgba(16,185,129,0.14),transparent_28%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-10">
        <div className="mb-10 flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 shadow-lg backdrop-blur">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90">
            <span className="text-lg font-semibold text-slate-900">AP</span>
          </div>
          <div className="leading-tight">
            <p className="text-xs uppercase tracking-[0.18em] text-white/70">App Pokemon</p>
            <p className="text-sm text-white/90">Dashboard de usuarios y Pokemon</p>
          </div>
        </div>

        <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-sky-200">Bienvenido de vuelta</p>
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
              <input
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-sky-400/70 focus:bg-white/15"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Contraseña</label>
              <input
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-sky-400/70 focus:bg-white/15"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                <span className="h-2 w-2 rounded-full bg-red-400" aria-hidden />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-3">
              <button
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-400 px-4 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-sky-500/30 transition hover:from-sky-400 hover:to-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/30 border-t-slate-900" />
                    Ingresando...
                  </span>
                ) : (
                  "Entrar"
                )}
              </button>

              <button
                type="button"
                className="w-full rounded-2xl cursor-pointer border border-white/15 bg-white/5 px-4 py-3 text-white transition hover:border-white/30 hover:bg-white/10"
                onClick={() => router.push("/register")}
              >
                Crear cuenta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
