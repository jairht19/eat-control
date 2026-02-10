# Blueprint – PWA Seguimiento Mensual de Comidas

## 1. Objetivo
Construir una **PWA instalable** (sin App Store) para el seguimiento mensual de comidas, sustituyendo el registro manual en papel por una captura digital simple, con exportación mensual a Excel.

Características clave:
- Registro tipo tabla (comidas vs días del mes)
- Multi-perfil (ej. Mamá, Tú, Hermano)
- Captura colaborativa (varios usuarios editan un perfil)
- Login con Google
- Base NoSQL en la nube
- Exportación mensual a Excel (con resumen y gráficas)
- Funciona en iOS, Android y desktop vía navegador

---

## 2. Stack tecnológico

### Frontend
- Vue 3
- Vite
- TypeScript
- PWA (vite-plugin-pwa)
- Tailwind CSS
- Headless UI (Vue)
- Pinia (state management)
- Vue Router

### Backend / Infraestructura
- Firebase Authentication (Google Sign-In)
- Cloud Firestore (NoSQL)
- Cloud Functions (Node.js)
- Cloud Storage (archivos Excel)
- Firebase Hosting (SPA / PWA)

---

## 3. Arquitectura general

```
[PWA Vue 3]
   |
   | Google Login
   v
[Firebase Auth]
   |
   v
[Cloud Firestore] <----> [Cloud Functions] ----> [Cloud Storage]
```

---

## 4. Estructura del proyecto (Vite)

```
src/
 ├─ app/
 │   ├─ router/
 │   │   └─ index.ts
 │   ├─ stores/
 │   │   ├─ auth.store.ts
 │   │   ├─ profile.store.ts
 │   │   ├─ month.store.ts
 │   │   └─ food.store.ts
 │   └─ firebase/
 │       ├─ client.ts
 │       └─ auth.ts
 │
 ├─ components/
 │   ├─ base/
 │   │   ├─ BaseButton.vue
 │   │   ├─ BaseDialog.vue
 │   │   ├─ BaseMenu.vue
 │   │   └─ BaseInput.vue
 │   ├─ table/
 │   │   ├─ MonthTable.vue
 │   │   ├─ TableCell.vue
 │   │   └─ StickyHeader.vue
 │   └─ profile/
 │       ├─ ProfileSwitcher.vue
 │       └─ MembersDialog.vue
 │
 ├─ views/
 │   ├─ LoginView.vue
 │   ├─ MonthView.vue
 │   ├─ DayView.vue
 │   ├─ FoodsView.vue
 │   ├─ ProfileView.vue
 │   └─ ExportView.vue
 │
 ├─ styles/
 │   └─ tailwind.css
 │
 ├─ App.vue
 └─ main.ts
```

---

## 5. Rutas (Vue Router)

| Ruta | Vista | Descripción |
|-----|------|-------------|
| `/login` | LoginView | Login con Google |
| `/` | MonthView | Tabla mensual |
| `/day/:date` | DayView | Captura por día |
| `/foods` | FoodsView | Catálogo de comidas |
| `/profile` | ProfileView | Perfil y miembros |
| `/export` | ExportView | Exportación a Excel |

---

## 6. Modelo de datos (Cloud Firestore)

### Profiles
```
profiles/{profileId}
{
  displayName: "Mamá",
  ownerUid: "uid_owner",
  createdAt,
  active: true
}
```

### Members (control de acceso por perfil)
```
profiles/{profileId}/members/{uid}
{
  role: "owner" | "editor" | "viewer",
  addedByUid,
  createdAt
}
```

### Foods (catálogo por perfil)
```
profiles/{profileId}/foods/{foodId}
{
  name: "Huevos",
  category: "Desayuno",
  active: true,
  createdAt
}
```

### Registro mensual
```
profiles/{profileId}/months/{YYYY-MM}
{
  year: 2026,
  month: 1,
  updatedAt
}
```

### Entradas del mes
```
profiles/{profileId}/months/{YYYY-MM}/entries/{entryId}
{
  date: "2026-01-15",
  foodId,
  count: 1,
  note: "",
  createdByUid,
  updatedByUid,
  updatedAt
}
```

---

## 7. Roles y permisos

- **Owner**
  - Gestiona miembros
  - Cambia roles
  - Exporta información
  - Elimina el perfil

- **Editor**
  - Captura y edita comidas
  - Exporta información

- **Viewer (futuro)**
  - Solo lectura

---

## 8. UX principal

### Tabla mensual
- Columna izquierda fija (comidas)
- Fila superior fija (días del mes)
- Interacción:
  - Click: `0 → 1 → 2 → 3 → 0`
  - Click prolongado: abrir modal (nota / ajuste manual)

### Vista diaria
- Lista simple por día
- Swipe para cambiar de día
- Optimizada para móvil

---

## 9. Uso de Headless UI

| Componente | Uso |
|-----------|----|
| Dialog | Editar celda, notas, compartir perfil |
| Listbox | Selector de perfil activo |
| Combobox | Buscar comida en catálogo |
| Menu | Acciones (exportar, ajustes) |
| Tabs | Mes / Día / Resumen |

---

## 10. Exportación a Excel (Cloud Function)

### Flujo
1. PWA llama `exportMonth(profileId, YYYY-MM)`
2. Cloud Function valida permisos (owner/editor)
3. Lee foods y entries del mes
4. Genera archivo `.xlsx`:
   - Hoja 1: Registro (tabla completa)
   - Hoja 2: Resumen (totales por comida, día y categoría)
   - Hoja 3: Gráficas (fase 2)
5. Guarda archivo en Cloud Storage
6. Devuelve URL firmada para descarga

---

## 11. Seguridad (conceptual)

- Usuario autenticado obligatorio
- Acceso solo si existe `members/{uid}`
- Escritura permitida solo a `owner` o `editor`
- Exportación restringida
- Ningún perfil accesible por ID público

---

## 12. Backlog MVP

### Semana 1
- Setup Vue + Vite + PWA + Tailwind
- Firebase Auth + Firestore
- Login y selector de perfil
- Vista mensual básica

### Semana 2
- CRUD de comidas
- Guardado de entradas
- Roles y miembros
- Vista diaria

### Semana 3
- Exportación Excel (registro + resumen)
- Cloud Function + Storage
- Descarga desde PWA

### Semana 4
- Pulido UX
- Soporte offline básico
- Deploy en Firebase Hosting

---

## 13. Decisiones cerradas
- PWA instalable (sin App Store)
- Vue 3 + Vite
- Tailwind + Headless UI
- Firebase como backend unificado
- Multi-perfil desde MVP

---

## 14. Extensiones futuras
- Gráficas avanzadas
- Macros / calorías
- Estadísticas semanales
- Notificaciones
- Roles de solo lectura

---

Fin del blueprint.
