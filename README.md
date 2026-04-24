# 💈 BarberApp

Sistema de gestión de turnos y servicios para barberías, diseñado como una aplicación moderna tipo SaaS.

## 🚀 Características

- 📅 Gestión de turnos en tiempo real
- ✂️ CRUD de servicios (nombre, precio)
- 📊 Dashboard con métricas y gráficas
- 📺 Vista TV para mostrar turnos en espera
- 🔐 Autenticación con Firebase (Google + Email)
- 👤 Sistema de roles (admin / user)
- ⚙️ Configuración del negocio
- 📢 Sistema de anuncios temporales
- 💰 Registro de pagos (efectivo / Nequi)

---

## 🧠 Tecnologías

- React + TypeScript
- TailwindCSS
- Firebase (Auth + Firestore)
- Recharts

---

## 📁 Estructura

src/
├── features/
│ ├── auth/
│ ├── tickets/
│ ├── dashboard/
│ ├── services/
│ ├── settings/
│ └── announcements/
│
├── pages/
│ ├── Home.tsx
│ ├── Dashboard.tsx
│ ├── Admin.tsx
│ ├── PublicQueue.tsx
│ ├── Login.tsx
│ └── Register.tsx
│
├── shared/
│ ├── components/
│ ├── hooks/
│ └── utils/


---

## ⚙️ Configuración

1. Clonar repositorio

```bash
git clone <https://github.com/bnino/barber-tickets.git>
cd barber-tickets

2. Instalar dependencias

npm install

3. Configurar Firebase

Crear archivo:

src/shared/services/firebaseService.ts

4. Ejecutar proyecto

npm run dev