# CarroRenta Frontend

Aplicación web para consultar vehículos, validar disponibilidad, crear reservaciones y administrar la operación de CarroRenta. Está construida con React y Vite y consume el backend mediante una API REST.

## Funcionalidades

- Catálogo público con filtros, paginación y estado sincronizado con la URL.
- Detalle, galería y disponibilidad de vehículos, con imágenes locales de demostración como respaldo.
- Registro, inicio de sesión y recuperación de sesión con JWT.
- Creación, consulta y cancelación de reservaciones.
- Perfil del cliente y cambio de contraseña.
- Panel para usuarios `ADMIN` con estadísticas y administración de vehículos, reservaciones y usuarios.
- Navegación responsive, estados de carga y error, y controles básicos de accesibilidad.

El backend es la fuente de verdad para disponibilidad, precios, estados, roles y permisos. El frontend no calcula el total definitivo de una reservación.

## Requisitos

- Node.js `^20.19.0` o `>=22.12.0`, requerido por Vite 8.
- Una instancia del backend de CarroRenta en ejecución.

## Configuración

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Crea un archivo `.env` a partir de `.env.example` y configura la URL del backend:

   ```env
   VITE_API_URL=http://localhost:3000
   ```

Las variables `VITE_*` quedan expuestas al navegador. No guardes contraseñas, secretos JWT ni otras credenciales en ellas.

`VITE_API_URL` se incorpora durante el build y admite:

- una URL absoluta HTTP(S), por ejemplo `https://api.carrorenta.com`;
- una ruta del mismo origen que comience con `/`, por ejemplo `/backend`;
- un valor vacío para llamar a la API desde el mismo origen.

No se admiten credenciales incrustadas, query strings, fragmentos, URLs relativas sin `/` inicial ni protocolos diferentes de HTTP(S). Si modificas esta variable en producción, genera nuevamente el build. Cuando frontend y API usan orígenes distintos, el backend debe permitir mediante CORS el origen exacto del frontend. Un sitio servido por HTTPS también debe consumir la API mediante HTTPS para evitar contenido mixto bloqueado por el navegador.

## Scripts

```bash
npm run dev      # inicia el servidor de desarrollo
npm run lint     # ejecuta ESLint
npm run build    # genera la compilación de producción en dist/
npm run preview  # sirve localmente la compilación
```

## Rutas principales

| Ruta | Acceso | Descripción |
| --- | --- | --- |
| `/` | Público | Página de inicio |
| `/vehiculos` | Público | Catálogo de vehículos |
| `/vehiculos/:id` | Público | Detalle y disponibilidad |
| `/login` | Público | Inicio de sesión |
| `/registro` | Público | Creación de cuenta |
| `/cuenta` | Autenticado | Perfil y reservaciones del cliente |
| `/reservaciones/:id` | Autenticado | Detalle de una reservación del cliente |
| `/admin` | `ADMIN` | Resumen administrativo |
| `/admin/vehiculos` | `ADMIN` | Gestión de vehículos |
| `/admin/vehiculos/nuevo` | `ADMIN` | Creación de vehículos |
| `/admin/vehiculos/:id` | `ADMIN` | Edición y desactivación de un vehículo |
| `/admin/reservaciones` | `ADMIN` | Gestión de reservaciones |
| `/admin/reservaciones/:id` | `ADMIN` | Detalle y cambio de estado de una reservación |
| `/admin/usuarios` | `ADMIN` | Gestión de usuarios |
| `/admin/usuarios/:id` | `ADMIN` | Detalle y administración del rol de un usuario |

Las rutas protegidas mejoran la experiencia de navegación, pero la autorización efectiva siempre corresponde al backend.

El catálogo admite los parámetros opcionales `category`, `transmission`, `startDate`, `endDate` y `page`. Los valores se normalizan al abrir la URL y las fechas se envían juntas al backend únicamente cuando forman un rango válido.

## Estructura

```text
src/
  api/          Cliente HTTP centralizado
  components/   Componentes reutilizables
  context/      Estado global de autenticación
  hooks/        Estado y carga de datos
  layouts/      Estructura general de páginas
  pages/        Vistas asociadas a rutas
  routes/       Enrutamiento de la aplicación
  services/     Operaciones de la API por dominio
  utils/        Funciones auxiliares
```

## Integración con la API

Las solicitudes se centralizan en `src/api/client.js`. Cuando existe una sesión, los servicios envían el token mediante `Authorization: Bearer TOKEN`. Los errores de la API conservan el estado HTTP y el encabezado `X-Request-Id` cuando está disponible, sin mostrar detalles internos ni registrar tokens.

Antes de probar el flujo completo, confirma que la URL configurada exponga los endpoints `/api/auth`, `/api/vehicles`, `/api/reservations` y `/api/admin` utilizados por la aplicación.

### Imágenes de vehículos

Las imágenes incluidas en `src/assets/vehicles` son recursos temporales de demostración y no representan necesariamente la marca o modelo mostrado. Una imagen enviada por el backend siempre tiene prioridad. Si no existe o falla al cargar, la interfaz selecciona de forma determinista una imagen local, la identifica como demostrativa y conserva una proporción visual consistente.

## Despliegue

Genera los archivos estáticos con:

```bash
npm run build
```

Publica el contenido de `dist/`. CarroRenta usa navegación SPA mediante History API, por lo que el servidor debe devolver `index.html` para rutas de frontend que no correspondan a un archivo real. Sin este fallback, recargar una ruta como `/vehiculos/12` o `/admin` producirá un 404 del servidor.

Configuración equivalente para Nginx:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

Si la API se publica bajo el mismo dominio, configura su ruta —por ejemplo `/api`— antes del fallback de la SPA y envíala al backend mediante el proxy del servidor. No redirijas solicitudes de API a `index.html`.

Antes de publicar una versión ejecuta:

```bash
npm run lint
npm run build
```
