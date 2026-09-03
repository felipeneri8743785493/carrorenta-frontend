# AGENTS.md — CarroRenta Frontend

## Rol

Eres el agente principal encargado de desarrollar el frontend de CarroRenta.

Debes trabajar de forma incremental, profesional y segura, utilizando el backend existente de CarroRenta como fuente de verdad para autenticación, vehículos, usuarios y reservaciones.

Cuando el usuario escriba:

continuar

debes:

1. Inspeccionar el estado actual del proyecto.
2. Revisar los archivos existentes.
3. Determinar cuál es el siguiente paso lógico de la fase actual.
4. Implementar ese paso.
5. Ejecutar lint y build cuando corresponda.
6. Corregir errores provocados por tus propios cambios.
7. Informar claramente qué se modificó y cuál es el siguiente paso.

No debes pedir al usuario que copie código manualmente cuando puedas crear o modificar los archivos directamente.

---

# Stack

Utilizar prioritariamente:

- React
- Vite
- JavaScript
- ESLint
- CSS moderno
- Fetch API para consumir el backend

No añadir librerías externas innecesariamente.

Antes de instalar una dependencia nueva, comprobar si realmente es necesaria.

---

# Backend existente

El frontend consumirá una API REST de CarroRenta ya desarrollada.

El backend maneja:

- usuarios;
- autenticación;
- JWT;
- roles CUSTOMER y ADMIN;
- vehículos;
- reservaciones;
- disponibilidad;
- cálculo de precios;
- cancelación de reservaciones;
- administración;
- paginación;
- filtros.

Nunca duplicar en frontend reglas de negocio que pertenecen al backend.

El backend es la fuente de verdad para:

- disponibilidad;
- precios;
- total de una reservación;
- permisos;
- roles;
- estados;
- autenticación.

---

# URL de API

La URL del backend debe configurarse mediante variable de entorno.

Usar:

VITE_API_URL

Crear `.env.example` con un ejemplo como:

VITE_API_URL=http://localhost:3000

Nunca guardar información sensible en variables `VITE_*`.

No guardar JWT secrets ni contraseñas en frontend.

---

# Arquitectura objetivo

Mantener una estructura organizada similar a:

src/
  api/
  components/
  context/
  hooks/
  layouts/
  pages/
  routes/
  services/
  styles/
  utils/
  App.jsx
  main.jsx

No crear carpetas vacías innecesariamente. Crear cada carpeta conforme sea necesaria.

---

# Fases de desarrollo

Seguir este orden salvo que exista una razón técnica clara para modificarlo.

## Fase 1 — Base del proyecto

- limpiar contenido de ejemplo de Vite;
- revisar ESLint;
- crear estructura inicial;
- configurar estilos globales;
- configurar variable VITE_API_URL;
- crear cliente base para API;
- comprobar lint y build.

## Fase 2 — Layout y navegación

Crear:

- Navbar;
- Footer;
- layout principal;
- navegación responsive;
- estructura visual general.

Rutas iniciales:

- /
- /vehiculos
- /vehiculos/:id
- /login
- /registro

Agregar rutas administrativas más adelante.

## Fase 3 — Catálogo público

Consumir:

GET /api/vehicles

Implementar:

- listado de vehículos;
- paginación;
- filtros disponibles;
- estados de carga;
- estado sin resultados;
- manejo de errores;
- tarjetas reutilizables.

No mostrar vehículos INACTIVE.

## Fase 4 — Detalle de vehículo

Consumir el endpoint de detalle público.

Mostrar:

- marca;
- modelo;
- año;
- categoría;
- transmisión;
- asientos;
- precio por día;
- descripción;
- imagen;
- estado.

Preparar interfaz de disponibilidad y reservación.

## Fase 5 — Autenticación

Implementar:

- registro;
- login;
- logout;
- sesión del usuario;
- consulta de /api/auth/me;
- rutas protegidas.

El JWT debe enviarse usando:

Authorization: Bearer TOKEN

No almacenar contraseñas.

Evitar exponer tokens en logs.

Usar una estrategia razonable para mantener la sesión.

## Fase 6 — Reservaciones

Implementar flujo:

1. usuario elige vehículo;
2. selecciona fechas;
3. frontend envía fechas al backend;
4. backend valida disponibilidad;
5. backend calcula precio;
6. frontend muestra resultado;
7. backend crea reservación.

Nunca calcular ni confiar en el precio total únicamente en frontend.

Crear:

- formulario de reservación;
- confirmación;
- listado de reservaciones del usuario;
- cancelación controlada.

## Fase 7 — Área del cliente

Crear panel del usuario con:

- información básica;
- reservaciones;
- estados;
- cancelación cuando corresponda;
- cierre de sesión.

## Fase 8 — Panel administrativo

Solo para ADMIN.

Implementar progresivamente:

- listado de vehículos;
- detalle administrativo;
- creación de vehículos;
- edición;
- desactivación lógica;
- listado de reservaciones;
- administración de reservaciones;
- listado de usuarios;
- funciones administrativas disponibles en la API.

Nunca confiar únicamente en ocultar botones.

El backend siempre debe seguir validando permisos.

## Fase 9 — UX, responsive y accesibilidad

Revisar:

- móvil;
- tablet;
- escritorio;
- navegación por teclado;
- labels;
- focus visible;
- contraste;
- mensajes de error;
- estados de carga;
- botones deshabilitados;
- formularios.

Evitar diseños que funcionen únicamente en escritorio.

## Fase 10 — Cierre Frontend v1

Realizar:

- auditoría de rutas;
- auditoría de componentes;
- limpieza de código;
- eliminación de imports y CSS no utilizados;
- revisión de errores;
- ESLint;
- build de producción;
- README;
- `.env.example`;
- comprobación de integración con backend.

---

# Diseño

CarroRenta debe tener apariencia profesional y moderna.

Priorizar:

- interfaz limpia;
- buena jerarquía visual;
- tarjetas claras;
- navegación sencilla;
- diseño responsive;
- formularios fáciles de utilizar;
- estados visuales consistentes.

No sobrecargar la interfaz.

Mantener componentes reutilizables.

---

# Componentes

Evitar componentes gigantes.

Extraer componentes cuando exista reutilización o una responsabilidad clara.

Ejemplos:

- Navbar
- Footer
- VehicleCard
- VehicleList
- Pagination
- Loading
- ErrorMessage
- EmptyState
- ProtectedRoute
- AdminRoute
- ReservationCard
- FormField

No crear abstracciones prematuramente.

---

# API

Centralizar llamadas HTTP.

Evitar llamadas fetch dispersas por toda la aplicación.

Manejar consistentemente:

- 200
- 201
- 400
- 401
- 403
- 404
- 409
- 413
- 429
- 500

Cuando la API incluya X-Request-Id, conservarlo o mostrarlo de manera útil para diagnóstico cuando corresponda.

No mostrar stack traces internos al usuario.

---

# Seguridad

Nunca:

- incluir JWT_SECRET;
- guardar contraseñas;
- poner secretos en VITE_*;
- confiar en permisos del frontend;
- insertar HTML externo sin sanitización;
- registrar tokens en consola;
- deshabilitar controles de seguridad del backend.

El frontend es una capa de experiencia de usuario, no la autoridad de seguridad.

---

# Código

Mantener:

- nombres claros;
- funciones pequeñas;
- componentes comprensibles;
- imports ordenados;
- consistencia de estilo;
- manejo explícito de errores.

Evitar:

- código muerto;
- comentarios innecesarios;
- duplicación;
- valores mágicos repetidos;
- dependencias innecesarias.

---

# Validación después de cambios

Ejecutar cuando corresponda:

npm run lint
npm run build

Si alguno falla:

1. investigar el problema;
2. corregirlo;
3. repetir la validación;
4. no declarar terminado el incremento mientras existan errores provocados por el cambio.

---

# Git

Antes de operaciones Git revisar:

git status

No:

- ejecutar git push automáticamente;
- modificar remotos;
- reescribir historial;
- borrar ramas;
- hacer operaciones destructivas.

No realizar commits salvo que el usuario lo solicite.

---

# Forma de trabajo

Cuando el usuario escriba:

continuar

no responder únicamente con recomendaciones.

Debes trabajar directamente sobre el proyecto si tienes permisos para hacerlo.

Al terminar cada incremento informa:

- qué implementaste;
- archivos principales modificados;
- validaciones ejecutadas;
- errores encontrados y corregidos;
- resultado de lint;
- resultado de build;
- siguiente paso recomendado.

Prioridad:

1. funcionamiento;
2. seguridad;
3. integración correcta con backend;
4. mantenibilidad;
5. accesibilidad;
6. responsive;
7. diseño;
8. optimización.