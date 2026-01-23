# 🧩 AppPokemon

Aplicación web fullstack desarrollada como **prueba técnica**, que integra autenticación con roles, consumo de la **PokeAPI**, carga incremental de datos y despliegue productivo con Docker + Traefik.

---

## 🚀 URLs de Producción

* **Frontend:**
  👉 [https://pokemonapp.globtecx.com](https://pokemonapp.globtecx.com)

* **Backend / API:**
  👉 [https://pokemonapi.globtecx.com](https://pokemonapi.globtecx.com)

---

## 🏗️ Arquitectura General

```
AppPokemon
├── apps
│   ├── backend   (NestJS + Prisma + MySQL)
│   └── frontend  (Next.js + Tailwind + Redux)
├── docker-compose.yml
├── .github/workflows/deploy.yml
└── README.md
```

---

## ⚙️ Tecnologías Utilizadas

### Backend

* **NestJS**
* **Prisma ORM**
* **MySQL**
* **JWT + Refresh Token**
* **Axios (proxy PokeAPI)**
* **Docker**

### Frontend

* **Next.js (App Router)**
* **TypeScript**
* **Redux Toolkit**
* **TailwindCSS**
* **Axios**

### Infraestructura

* **Docker Compose**
* **Traefik v2**
* **Cloudflare**
* **GitHub Actions (CI/CD)**

---

## 🔐 Autenticación y Roles

El sistema maneja **autenticación basada en JWT** con **roles**.

### Roles disponibles

* `ADMIN`
* `USER`

### Credenciales de prueba

#### 👑 ADMIN

* **Correo:** `admin@gmail.com`
* **Contraseña:** `admin@gmail.com`

#### 👤 USER

* **Correo:** `usuario@usuario.com`
* **Contraseña:** `usuario@usuario.com`

---

## 🔒 Restricciones por Rol

| Funcionalidad             | USER | ADMIN |
| ------------------------- | ---- | ----- |
| Login / Register          | ✅    | ✅     |
| Ver Pokémon               | ✅    | ✅     |
| Carga incremental Pokémon | ✅    | ✅     |
| Ver usuarios              | ❌    | ✅     |
| Crear usuarios            | ❌    | ✅     |
| Editar usuarios           | ❌    | ✅     |
| Eliminar usuarios         | ❌    | ✅     |

---

## 📦 Endpoints del Backend

### 🔑 Auth

```
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
POST   /auth/logout
```

---

### 👤 Users (solo ADMIN)

```
GET    /users
GET    /users/:id
POST   /users
PATCH  /users/:id
DELETE /users/:id
```

---

### 🧬 Pokémon

> Proxy hacia PokeAPI con control desde backend

```
GET /pokemon?limit=20&offset=0
```

Soporta:

* `limit`: cantidad por página
* `offset`: desplazamiento para carga incremental

---

### ❤️ Healthcheck

```
GET /health
```

---

## 🖥️ Frontend – Rutas

| Ruta        | Descripción                         |
| ----------- | ----------------------------------- |
| `/`         | Redirección según sesión            |
| `/login`    | Login                               |
| `/register` | Registro                            |
| `/pokemon`  | Listado Pokémon (cards + load more) |
| `/users`    | CRUD usuarios (solo ADMIN)          |

---

## 🐳 Despliegue

### Servicios Docker

* MySQL (contenedor interno)
* Backend (NestJS)
* Frontend (Next.js)
* Traefik (proxy reverso + HTTPS)

### Dominio

* `pokemonapp.globtecx.com` → Frontend
* `pokemonapi.globtecx.com` → Backend

---

## 🔁 CI/CD

Cada `push` a la rama `master`:

1. GitHub Actions ejecuta workflow
2. Conexión SSH al VPS
3. `git pull`
4. `docker compose up -d --build`
5. Limpieza de imágenes

---

## 🧪 Ejecutar Localmente

Backend: [http://localhost:3001](http://localhost:3001)
Frontend: [http://localhost:3000](http://localhost:3000)

---

## 📄 Variables de Entorno

### Backend – `.env.example`

```env
# Database
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE_NAME"

# CORS
CORS_ORIGINS=http://localhost:3000,https://pokemonapp.globtecx.com

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=15m

# Refresh Token
REFRESH_SECRET=your_refresh_secret
REFRESH_EXPIRES_IN=7d
```

---

### Frontend – `.env.example`

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001,https://pokemonapi.globtecx.com
```

---

### 📌 Notas

* Los archivos `.env` **no se versionan** por seguridad.
* En producción, las variables se definen directamente en el servidor.
* El frontend solo expone variables con el prefijo `NEXT_PUBLIC_`.


