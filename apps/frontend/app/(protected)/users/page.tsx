"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/src/guards/withAuth";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { clearSession } from "@/src/store/slices/auth.slice";
import {
  clearUsersError,
  createUser,
  deleteUser,
  fetchUsers,
  updateUser,
} from "@/src/store/slices/users.slice";
import type { User } from "@/src/types/user.types";

function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button
            className="rounded-lg px-2 cursor-pointer py-1 text-sm text-slate-600 hover:bg-slate-100"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
        <div className="mt-4 space-y-4 text-slate-900">{children}</div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  useAuthGuard();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((s) => s.users);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  // form state
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");

  const [eEmail, setEEmail] = useState("");
  const [eName, setEName] = useState("");
  const [ePassword, setEPassword] = useState("");
  const [eRole, setERole] = useState<"USER" | "ADMIN">("USER");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (!createOpen) {
      setEmail("");
      setName("");
      setPassword("");
      setRole("USER");
    }
  }, [createOpen]);

  const openEdit = (u: User) => {
    setEditing(u);
    setEEmail(u.email);
    setEName(u.name);
    setEPassword("");
    setERole(u.role);
    setEditOpen(true);
  };

  const onLogout = () => {
    dispatch(clearSession());
    router.replace("/login");
  };

  const topbar = useMemo(() => {
    return (
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-slate-500">Panel</p>
          <h1 className="text-3xl font-semibold text-slate-200">Usuarios</h1>
          <p className="text-sm text-slate-500">CRUD protegido con JWT.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            onClick={() => router.push("/pokemon")}
          >
            Ver Pokémon
          </button>
          <button
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 cursor-pointer"
            onClick={() => setCreateOpen(true)}
          >
            Crear usuario
          </button>
          <button
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }, [router, dispatch]);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearUsersError());
    await dispatch(createUser({ email, name, password, role })).unwrap().catch(() => undefined);
    setCreateOpen(false);
  };

  const onUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    dispatch(clearUsersError());

    const dto: Partial<User> & { password?: string } = {};
    if (eEmail !== editing.email) dto.email = eEmail;
    if (eName !== editing.name) dto.name = eName;
    if (ePassword) dto.password = ePassword;
    if (eRole !== editing.role) dto.role = eRole;

    await dispatch(updateUser({ id: editing.id, dto })).unwrap().catch(() => undefined);
    setEditOpen(false);
    setEditing(null);
  };

  const onDelete = async (u: User) => {
    const ok = confirm(`¿Eliminar a ${u.email}?`);
    if (!ok) return;
    dispatch(clearUsersError());
    await dispatch(deleteUser(u.id)).unwrap().catch(() => undefined);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
          {topbar}
          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              <span className="h-2 w-2 rounded-full bg-red-300" />
              <p>{String(error)}</p>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 shadow-xl backdrop-blur">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-sm text-slate-200">
            <div>{loading ? "Cargando..." : `${items.length} usuarios`}</div>
            <button
              className="rounded-xl border border-white/20 px-3 py-2 text-xs font-medium text-white hover:border-white/40 hover:bg-white/10 cursor-pointer"
              onClick={() => dispatch(fetchUsers())}
            >
              Refrescar
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-100">
              <thead className="bg-white/5 text-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">ID</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Nombre</th>
                  <th className="px-4 py-3 font-semibold">Rol</th>
                  <th className="px-4 py-3 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((u) => (
                  <tr key={u.id} className="border-t border-white/10">
                    <td className="px-4 py-3 text-slate-200">{u.id}</td>
                    <td className="px-4 py-3 text-slate-50/90">{u.email}</td>
                    <td className="px-4 py-3 text-slate-50/90">{u.name}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          className="rounded-xl border border-white/20 px-3 py-2 text-xs font-semibold text-white hover:border-white/40 hover:bg-white/10 cursor-pointer"
                          onClick={() => openEdit(u)}
                        >
                          Editar
                        </button>
                        <button
                          className="rounded-xl border border-red-300/50 px-3 py-2 text-xs font-semibold text-red-100 hover:border-red-200 hover:bg-red-500/10 cursor-pointer"
                          onClick={() => onDelete(u)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && items.length === 0 && (
                  <tr>
                    <td className="px-4 py-12 text-center text-slate-300" colSpan={5}>
                      No hay usuarios.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal open={createOpen} title="Crear usuario" onClose={() => setCreateOpen(false)}>
        <form onSubmit={onCreate} className="space-y-3">
          <div>
            <label className="text-sm font-medium text-slate-800">Email</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-800">Nombre</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-800">Contraseña</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              type="password"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-800">Rol</label>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <button className="w-full rounded-xl bg-slate-900 px-4 py-2 text-white shadow-sm hover:bg-slate-800 cursor-pointer">
            Crear
          </button>
        </form>
      </Modal>

      <Modal open={editOpen} title="Editar usuario" onClose={() => setEditOpen(false)}>
        <form onSubmit={onUpdate} className="space-y-3">
          <div>
            <label className="text-sm font-medium text-slate-800">Email</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none"
              value={eEmail}
              onChange={(e) => setEEmail(e.target.value)}
              required
              type="email"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-800">Nombre</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none"
              value={eName}
              onChange={(e) => setEName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-800">Nueva contraseña (opcional)</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none"
              value={ePassword}
              onChange={(e) => setEPassword(e.target.value)}
              minLength={6}
              type="password"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-800">Rol</label>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none"
              value={eRole}
              onChange={(e) => setERole(e.target.value as any)}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <button className="w-full rounded-xl bg-slate-900 px-4 py-2 text-white shadow-sm hover:bg-slate-800">
            Guardar cambios
          </button>
        </form>
      </Modal>
    </div>
  );
}
