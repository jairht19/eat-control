# Eat Control

PWA para seguimiento diario y mensual de comidas, con multi-perfil, catálogos dinámicos y persistencia en Firebase.

## Stack

- Vue 3 + Vite + TypeScript
- Pinia + Vue Router
- Tailwind CSS + Headless UI
- Firebase Auth (Google)
- Cloud Firestore
- PWA (`vite-plugin-pwa`)

## Funcionalidades actuales

- Inicio con resumen de capturas de hoy y ayer.
- Captura diaria por fecha (bloquea días futuros).
- Catálogos por perfil:
  - Comidas
  - Categorías
  - Fases
- Importación de comidas por CSV (`name,category`) con:
  - resumen de resultados
  - detección de duplicados
  - exportación de errores
- Reporte mensual en tabla.

## Estructura de datos (Firestore)

Colecciones por perfil:

- `profiles/{profileId}/foods`
- `profiles/{profileId}/categories`
- `profiles/{profileId}/phases`
- `profiles/{profileId}/entries`

## Requisitos

- Node.js 20+
- Proyecto Firebase con Authentication + Firestore habilitados

## Variables de entorno

Crea `.env` tomando `.env.example` como base:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Desarrollo local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Reglas Firestore (dev)

Para desarrollo inicial, una opción temporal es:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /profiles/{profileId}/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Luego se recomienda endurecer reglas por roles (`owner/editor/viewer`).

## Importación CSV

Formato esperado:

```csv
name,category
Huevos,Lácteos
Arroz,Cereales
```

Desde `Comidas`:

1. Seleccionar archivo CSV.
2. Clic en `Procesar CSV`.
3. Revisar resumen y descargar errores si aplica.

## Deploy a GitHub Pages

El proyecto incluye workflow en `.github/workflows/deploy.yml`.

### 1) Configurar GitHub Pages

- `Settings > Pages > Source`: `GitHub Actions`

### 2) Crear secrets del repositorio

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

### 3) Firebase Auth

Agregar dominio autorizado:

- `tuusuario.github.io`

Con cada push a `main` se ejecuta el despliegue.

## Scripts

- `npm run dev`: servidor local
- `npm run type-check`: validación de tipos
- `npm run build`: build de producción
- `npm run preview`: preview local del build
