"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/src/services/auth.service";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { useToast } from "@/src/components/ui/ToastProvider";

export function RegisterForm() {
  const router = useRouter();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.register({ email, name, password });
      toast.success("Cuenta creada. Ahora inicia sesión.");
      setTimeout(() => router.replace("/login"), 600);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "No se pudo registrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-emerald-200">Comienza ahora</p>
          <h1 className="text-3xl font-semibold text-white">Crear cuenta</h1>
          <p className="mt-1 text-sm text-white/70">
            Registra tus datos para gestionar usuarios y explorar Pokemon.
          </p>
        </div>
        <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs text-white/70">
          Acceso inmediato
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80">Nombre</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

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
            autoComplete="new-password"
            required
            minLength={6}
          />
        </div>
        <div className="space-y-3 gap-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <Button disabled={loading} type="submit" className="bg-gradient-to-r from-emerald-400 to-sky-400 text-slate-900 shadow-lg shadow-emerald-400/30 hover:from-emerald-300 hover:to-sky-300">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/30 border-t-slate-900" />
                Creando...
              </span>
            ) : (
              "Registrar"
            )}
          </Button>

          <Button type="button" variant="ghost" onClick={() => router.push("/login")}> 
            Volver a login
          </Button>
        </div>
      </form>
    </div>
  );
}
