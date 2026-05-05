# Wallaclone 🛍️

Plataforma de compra y venta de artículos de segunda mano, inspirada en Wallapop. Desarrollada como proyecto final del Bootcamp Full Stack de KeepCoding (Web 19).

🌐 **Demo en producción:** [wallaclone.gitgirlskcweb19.duckdns.org](https://wallaclone.gitgirlskcweb19.duckdns.org)

---

## Funcionalidades implementadas ✅

**Autenticación**
- Registro e inicio de sesión con JWT
- Logout

**Anuncios**
- Listado de anuncios con búsqueda y filtros
- Creación, edición y eliminación de anuncios
- Detalle de anuncio
- Cambio de estado: disponible, reservado, vendido

**Otras**
- Contacto con el vendedor mediante formulario con cabecera `Reply-To`
- Diseño responsive

## Funcionalidades no implementadas ❌

Las siguientes funcionalidades quedaron fuera del MVP por restricciones de tiempo:

- Carga de imágenes (los anuncios usan URLs de imagen)
- Chat en tiempo real (sustituido por formulario de contacto)
- Sistema de favoritos y notificaciones

---

## Stack tecnológico 🛠️

**Frontend**
- React 19 + React Router 7 + TypeScript + Vite + Tailwind CSS v4

**Backend**
- Node.js + Express 5 + TypeScript
- Compilado con esbuild, validación de tipos con tsc
- MongoDB Atlas + Mongoose
- JWT + bcrypt — autenticación y cifrado
- Zod — validación de datos
- Nodemailer — envío de emails de contacto

**Infraestructura**
- AWS EC2 (Ubuntu 24.04) + nginx + Supervisor + Certbot + DuckDNS
- GitHub Actions — CI/CD automático en cada push a `main`

---

## API REST 📡

Base URL: `https://wallaclone.gitgirlskcweb19.duckdns.org/api`

### Autenticación

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/auth/register` | Registro | No |
| POST | `/auth/login` | Login | No |
| POST | `/auth/logout` | Logout | Sí |

### Anuncios

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/adverts` | Listado con filtros | No |
| POST | `/adverts` | Crear anuncio | Sí |
| GET | `/adverts/:id` | Detalle | No |
| PUT/PATCH | `/adverts/:id` | Editar | Sí |
| DELETE | `/adverts/:id` | Eliminar | Sí |
| PATCH | `/adverts/:id/status` | Cambiar estado | Sí |

---

## Cómo correrlo en local 💻

### Prerrequisitos

- Node.js v22+
- Cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)
- Cuenta en [Mailtrap](https://mailtrap.io) (opcional, para emails)

### Instalación

```bash
git clone https://github.com/MarianDev22/kc-web19-gitgirls-finalproject-wallaclone.git
cd kc-web19-gitgirls-finalproject-wallaclone
```

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Rellenar las variables en .env
```

```env
API_PORT=3000
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/wallaclone
JWT_SECRET=tu_secreto_aqui
MAILTRAP_USERNAME=tu_usuario_mailtrap
MAILTRAP_PASSWORD=tu_password_mailtrap
```

**Frontend:**
```bash
cd ../frontend/wallaclone
npm install
```

### Poblar la base de datos (opcional)
```bash
cd backend
npm run seed:adverts
```

### Arrancar en desarrollo

```bash
# Backend (puerto 3000)
cd backend && npm run dev

# Frontend (puerto 5173)
cd frontend/wallaclone && npm run dev
```

---

## Despliegue 📦

CI/CD automático con GitHub Actions en cada push a `main`. El job de backend hace pull, instala dependencias, compila con esbuild y reinicia Supervisor. El job de frontend buildea con Vite y sube el `dist` al servidor por SCP.

nginx actúa como proxy inverso: `/api/*` → Express (puerto 3000), resto → archivos estáticos de React.

---

## Equipo 👩‍💻

**Git Girls** — Bootcamp Full Stack KeepCoding Web 19

- **Marian** — [MarianDev22](https://github.com/MarianDev22)
- **Sara** — [Aratea10](https://github.com/Aratea10)