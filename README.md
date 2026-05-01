# 💈 BarberApp

> Sistema de gestión de turnos para barberías — PWA con soporte offline completo

[![Version](https://img.shields.io/badge/version-1.1.0-indigo)](https://barberialafama.web.app)
[![Firebase](https://img.shields.io/badge/Firebase-12.6.0-orange)](https://firebase.google.com)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)
[![PWA](https://img.shields.io/badge/PWA-ready-green)](https://web.dev/progressive-web-apps)

## 🌐 Demo en producción

**[https://barberialafama.web.app](https://barberialafama.web.app)**

---

## ✨ Funcionalidades

### Para clientes
- 📋 Reserva de turno en tiempo real desde cualquier dispositivo
- 👤 Pre-llenado automático del nombre si hay sesión iniciada
- 📊 Visualización de la cola de espera en tiempo real

### Para el barbero / admin
- ✂️ Gestión completa de turnos — iniciar, finalizar y cancelar
- ⏱️ Timer en tiempo real del servicio activo
- 💳 Registro de pago por método (efectivo / Nequi)
- 🔔 Inicio automático del siguiente turno al finalizar

### Dashboard (admin)
- 📈 Gráfica de ingresos por día/semana/mes
- 📊 Servicios más solicitados
- 💰 Ingresos por tipo de servicio
- 💳 Distribución de métodos de pago

### Panel de administración
- 🛠️ Gestión de servicios (CRUD completo)
- 👥 Gestión de usuarios y roles
- 📢 Sistema de anuncios con fechas de vigencia
- ⚙️ Configuración del negocio (nombre, horario, días laborales)

### Vista TV
- 📺 Pantalla dedicada para el televisor de la barbería
- 🔄 Detección automática de dispositivo TV por User Agent
- ⏱️ Timer del turno activo visible para los clientes en espera

### PWA & Offline
- 📲 Instalable en Android, iOS y escritorio
- 🌐 Funciona sin conexión a internet
- 🔄 Sincronización automática al recuperar la conexión
- 📡 Banner de estado de conexión en tiempo real

---

## 🛠️ Stack tecnológico

| Tecnología | Uso |
|---|---|
| React 19 + TypeScript | Frontend |
| Vite | Bundler y dev server |
| Tailwind CSS v4 | Estilos |
| Firebase Auth | Autenticación (Email + Google) |
| Firestore | Base de datos en tiempo real |
| Firebase Hosting | Despliegue |
| Vite PWA Plugin | Service Worker y manifest |
| Recharts | Gráficas del dashboard |
| SweetAlert2 | Alertas y confirmaciones |

---

## 📁 Estructura del proyecto

```
src/
├── features/
│   ├── auth/              # Autenticación, contexto y rutas protegidas
│   ├── tickets/           # Lógica de turnos, hooks y componentes
│   ├── services/          # Gestión de servicios de la barbería
│   ├── dashboard/         # Dashboard con gráficas y estadísticas
│   ├── announcements/     # Sistema de anuncios
│   ├── settings/          # Configuración del negocio
│   └── users/             # Gestión de usuarios
├── pages/                 # Páginas principales (Home, Dashboard, Admin, etc.)
├── shared/
│   ├── components/        # Componentes reutilizables (Navbar, Footer, etc.)
│   ├── hooks/             # Hooks globales (useAlert, useOnlineStatus, etc.)
│   ├── services/          # Firebase config
│   ├── types/             # Tipos TypeScript globales
│   └── utils/             # Utilidades (format, currency, sanitize, etc.)
└── assets/                # Recursos estáticos
```

---

## 🚀 Instalación y desarrollo local

### Prerrequisitos
- Node.js 18+
- npm 9+
- Proyecto de Firebase con Firestore y Authentication habilitados

### 1. Clona el repositorio

```bash
git clone https://github.com/bnino/BarberApp.git
cd barberapp
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Configura las variables de entorno

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Inicia el servidor de desarrollo

```bash
npm run dev
```

---

## 🔐 Configuración de Firebase

### Firestore — Reglas de seguridad

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Tickets — lectura pública, escritura autenticada
    match /tickets/{ticketId} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if request.auth != null;
    }

    // Servicios — lectura pública, escritura solo admin
    match /services/{serviceId} {
      allow read: if true;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Usuarios — solo el propio usuario o admin
    match /users/{userId} {
      allow read, write: if request.auth != null &&
        (request.auth.uid == userId ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }

    // Settings y anuncios — lectura pública, escritura solo admin
    match /settings/{doc} {
      allow read: if true;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    match /announcements/{doc} {
      allow read: if true;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### Authentication — Dominios autorizados

En Firebase Console → Authentication → Settings → Authorized domains, agrega:
- `localhost`
- `barberialafama.web.app`
- Tu dominio personalizado (si aplica)

---

## 📦 Scripts disponibles

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run preview    # Preview del build local
npm run lint       # Linting con ESLint
```

---

## 🚢 Despliegue en producción

```bash
# 1. Actualizar versión
npm version patch   # o minor / major

# 2. Build de producción
npm run build

# 3. Deploy a Firebase Hosting
firebase deploy --only hosting:app

# 4. Subir cambios a GitHub
git push
git push --tags
```

---

## 📱 Instalación como PWA

### Android (Chrome)
1. Abre la app en Chrome
2. Toca el menú (⋮) → "Instalar app" o "Agregar a pantalla de inicio"

### iOS (Safari)
1. Abre la app en Safari
2. Toca el botón de compartir → "Agregar a pantalla de inicio"

### Escritorio (Chrome / Edge)
1. Haz clic en el ícono de instalación en la barra de direcciones
2. Confirma la instalación

---

## 👥 Roles de usuario

| Rol | Permisos |
|---|---|
| `user` | Reservar turnos, ver cola |
| `admin` | Todo lo anterior + iniciar/finalizar/cancelar turnos, dashboard, panel admin |

---

## 🤝 Contribuciones

Este es un proyecto personal. Si encuentras un bug o tienes una sugerencia, abre un [issue](https://github.com/bnino/barberapp/issues).

---

## 📄 Licencia

MIT © [Brayan Niño](https://github.com/bnino)

---

<div align="center">
  <p>Desarrollado con ❤️ por <a href="https://github.com/bnino">Brayan Niño</a></p>
  <p>
    <a href="https://barberialafama.web.app">🌐 Ver demo</a>
  </p>
</div>
