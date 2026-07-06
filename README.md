# Banking System

Aplicación bancaria full-stack compuesta por un backend en Spring Boot y un frontend en Next.js, con PostgreSQL como base de datos y soporte para ejecutarse con Docker Compose.

## Características principales

- Gestión de clientes
- Gestión de cuentas bancarias
- Procesamiento de transacciones (depósitos, retiros y transferencias)
- Estados de cuenta activos/inactivos
- Soft delete para cuentas y otros registros
- Interfaz moderna en Next.js con Tailwind CSS
- Pruebas unitarias en el backend con JUnit y Mockito

## Estructura del proyecto

```text
.
├── banking-system/      # Backend Spring Boot
├── frontend/            # Frontend Next.js
├── docker-compose.yml   # Orquestación Docker
├── DOCKER.md            # Guía rápida de Docker
└── README.md            # Este archivo
```

## Tecnologías utilizadas

### Backend
- Java 17
- Spring Boot 3.5.15
- Spring Web
- Spring Data JPA
- PostgreSQL
- Maven
- JUnit 5 + Mockito

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- SWR
- Axios
- React Hook Form + Zod

## Requisitos previos

Para ejecutar el proyecto localmente necesitas:

- Docker Desktop (recomendado para la ejecución completa)
- Java 17 (si deseas ejecutar el backend sin Docker)
- Node.js 22 (si deseas ejecutar el frontend sin Docker)
- Maven

## Ejecución con Docker

La forma más sencilla de levantar todo el proyecto es con Docker Compose:

```bash
docker compose up --build
```

### URLs disponibles

- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- Base de datos PostgreSQL: localhost:5432

### Comandos útiles

```bash
docker compose build
docker compose up
docker compose down
docker compose logs
docker compose down -v
```

## Ejecución sin Docker

### Backend

```bash
cd banking-system
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Variables de entorno

El backend usa un archivo de ejemplo en [banking-system/.env](banking-system/.env), y el frontend usa [frontend/.env.local](frontend/.env.local).

## Pruebas

El backend incluye pruebas unitarias para servicios y controladores.

Para ejecutarlas:

```bash
cd banking-system
mvn test
```

## Notas importantes

- El proyecto mantiene la arquitectura existente sin modificar la lógica de negocio.
- La configuración Docker está preparada para levantar backend, frontend y base de datos automáticamente.
- En el flujo actual, las cuentas inactivas no pueden utilizarse para transacciones, y las cuentas eliminadas con soft delete no se muestran en la interfaz operativa.

## Licencia

Este proyecto se proporciona como ejemplo de desarrollo full-stack con arquitectura limpia y despliegue con contenedores.
