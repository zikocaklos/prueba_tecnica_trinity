# NovaBank — Sistema Bancario

Aplicación bancaria full-stack con backoffice moderno para gestión de clientes, cuentas y transacciones. Backend en Spring Boot (arquitectura hexagonal), frontend en Angular 22 y base de datos PostgreSQL, todo orquestado con Docker Compose.

## Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                   Frontend Angular                   │
│                  http://localhost:4200                │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP REST /api/*
┌──────────────────────▼──────────────────────────────┐
│               Backend Spring Boot                    │
│              Arquitectura Hexagonal                  │
│              http://localhost:8080/api                │
└──────────────────────┬──────────────────────────────┘
                       │ JDBC
┌──────────────────────▼──────────────────────────────┐
│               PostgreSQL 16                          │
│               banking_db :5432                       │
└─────────────────────────────────────────────────────┘
```

## Módulos

| Módulo         | Tecnología                          | Puerto |
|----------------|-------------------------------------|--------|
| Frontend       | Angular 22 + Tailwind CSS + Signals | 4200   |
| Backend        | Spring Boot 3.5 + Java 17          | 8080   |
| Base de datos  | PostgreSQL 16 Alpine                | 5432   |

## Características

- **Clientes** — CRUD completo con soft delete, validación de formularios, búsqueda y filtros combinados (tipo documento, productos asociados).
- **Cuentas** — CRUD con generación automática de número de cuenta, toggle de estado activo/inactivo, filtros por tipo y estado.
- **Transacciones** — Creación de depósitos, retiros y transferencias con validación de fondos, filtros por tipo y búsqueda.
- **Dashboard** — Resumen de estadísticas: total clientes, cuentas activas/inactivas/canceladas, balance total, transacciones recientes.
- **Soft Delete** — Todas las entidades usan borrado lógico; las cuentas eliminadas retienen su número para evitar reuso.
- **Arquitectura Hexagonal** — Backend organizado en dominio, aplicación e infraestructura con puertos y adaptadores.

## Stack

### Backend
| Tecnología           | Versión           |
|----------------------|-------------------|
| Java                 | 17 (src), 21 (JRE Docker) |
| Spring Boot          | 3.5.15           |
| Spring Data JPA      | —                 |
| PostgreSQL           | 16 Alpine         |
| Hibernate            | via Spring Boot   |
| Lombok               | —                 |
| Maven                | 3.9.9             |
| JUnit 5 + Mockito    | —                 |

### Frontend
| Tecnología           | Versión            |
|----------------------|--------------------|
| Angular              | 22.0.0             |
| Angular CLI          | 22.0.1             |
| TypeScript           | 6.0.2              |
| RxJS                 | 7.8.0              |
| Tailwind CSS         | 3.4.19             |
| Signals              | nativos Angular    |
| Standalone Components| 100% del proyecto  |

### Infraestructura
| Tecnología           | Versión           |
|----------------------|-------------------|
| Docker               | Compose           |
| Node.js              | 22 Alpine (build) |
| Nginx                | Alpine (serve)    |
| Eclipse Temurin      | 21 JRE (Docker)   |

## Estructura del proyecto

```
.
├── banking-system/                 # Backend Spring Boot (hexagonal)
│   ├── deploy/Dockerfile
│   ├── pom.xml
│   ├── .env                        # Variables de entorno locales
│   ├── API_TESTING_EXAMPLES.md     # Guía de pruebas de API
│   └── src/main/java/com/banco/
│       ├── banking_system/         # Application entry point
│       ├── domain/                 # Modelos, enums, puertos
│       │   ├── model/              # Client, Account, Transaction
│       │   ├── enums/              # AccountStatus, AccountType, TransactionType
│       │   └── ports/              # Interfaces in/out
│       ├── application/            # Casos de uso (servicios)
│       └── infrastructure/         # Controladores REST, DTOs, JPA, adaptadores
│
├── banking-frontend-angular/       # Frontend Angular
│   ├── deploy/Dockerfile
│   ├── deploy/nginx.conf
│   ├── angular.json
│   └── src/app/
│       ├── core/                   # Modelos, servicios, interceptores
│       ├── features/               # Dashboard, Clientes, Cuentas, Transacciones
│       └── shared/                 # Componentes reutilizables, utilidades
│
├── docker-compose.yml              # Orquestación Docker
└── DOCKER.md                       # Guía rápida Docker
```

## Base de datos

Las tablas se crean automáticamente mediante `spring.jpa.hibernate.ddl-auto=update`.

### `clients`
| Columna               | Tipo         |
|-----------------------|--------------|
| id                    | BIGINT (PK)  |
| identification_type   | VARCHAR      |
| identification_number | VARCHAR      |
| first_name            | VARCHAR      |
| last_name             | VARCHAR      |
| email                 | VARCHAR      |
| birth_date            | DATE         |
| created_at            | TIMESTAMP    |
| updated_at            | TIMESTAMP    |
| deleted               | BOOLEAN      |

### `accounts`
| Columna       | Tipo                 |
|---------------|----------------------|
| id            | BIGINT (PK)          |
| account_number| VARCHAR (UNIQUE)     |
| account_type  | ENUM (SAVINGS/CHECKING) |
| status        | ENUM (ACTIVE/INACTIVE/CANCELLED) |
| balance       | DECIMAL              |
| exempt_gmf    | BOOLEAN              |
| client_id     | BIGINT (FK → clients)|
| created_at    | TIMESTAMP            |
| updated_at    | TIMESTAMP            |
| deleted       | BOOLEAN              |

### `transactions`
| Columna            | Tipo                 |
|--------------------|----------------------|
| id                 | BIGINT (PK)          |
| type               | ENUM (DEPOSIT/WITHDRAWAL/TRANSFER) |
| amount             | DECIMAL              |
| transaction_date   | TIMESTAMP            |
| source_account_id  | BIGINT (FK → accounts) |
| destination_account_id | BIGINT (FK → accounts) |
| deleted            | BOOLEAN              |

## API REST

### Clientes `/api/clients`
| Método   | Ruta              | Descripción                    |
|----------|-------------------|--------------------------------|
| `GET`    | `/api/clients`    | Listar todos los clientes      |
| `GET`    | `/api/clients/{id}` | Obtener cliente por ID        |
| `POST`   | `/api/clients`    | Crear cliente                  |
| `PUT`    | `/api/clients/{id}` | Actualizar cliente            |
| `DELETE` | `/api/clients/{id}` | Eliminar cliente (soft delete) |

### Cuentas `/api/accounts`
| Método   | Ruta               | Descripción                   |
|----------|--------------------|-------------------------------|
| `GET`    | `/api/accounts`    | Listar todas las cuentas      |
| `GET`    | `/api/accounts/{id}` | Obtener cuenta por ID       |
| `POST`   | `/api/accounts`   | Crear cuenta                  |
| `PUT`    | `/api/accounts/{id}` | Actualizar cuenta           |
| `DELETE` | `/api/accounts/{id}` | Eliminar cuenta (soft delete) |

### Transacciones `/api/transactions`
| Método   | Ruta                 | Descripción                       |
|----------|----------------------|-----------------------------------|
| `GET`    | `/api/transactions`  | Listar todas las transacciones    |
| `GET`    | `/api/transactions/{id}` | Obtener transacción por ID     |
| `POST`   | `/api/transactions`  | Crear transacción                  |

**Reglas de negocio:**
- **DEPOSIT** — Requiere cuenta destino activa. Incrementa el balance.
- **WITHDRAWAL** — Requiere cuenta origen activa y fondos suficientes. Decrementa el balance.
- **TRANSFER** — Requiere ambas cuentas activas y fondos suficientes en origen.

## Requisitos previos

- [Docker](https://docs.docker.com/get-docker/) + [Docker Compose](https://docs.docker.com/compose/install/)
- O alternativamente:
  - [Java 17+](https://adoptium.net/) + [Maven](https://maven.apache.org/)
  - [Node.js 22+](https://nodejs.org/) + [Angular CLI](https://angular.dev/cli)

## Ejecución con Docker

```bash
# Construir y levantar todos los servicios
docker compose up --build

# O en segundo plano
docker compose up --build -d
```

### URLs

| Servicio    | URL                             |
|-------------|---------------------------------|
| Frontend    | http://localhost:4200            |
| Backend API | http://localhost:8080/api        |
| PostgreSQL  | localhost:5433 (usar puerto 5433 por Docker) |

## Ejecución sin Docker

### Backend

```bash
cd banking-system
mvn spring-boot:run
```

Requiere PostgreSQL corriendo en `localhost:5432` con base de datos `banking_db`.

### Frontend

```bash
cd banking-frontend-angular
npm install
ng serve
```

## Comandos Docker útiles

```bash
docker compose build        # Construir imágenes
docker compose up -d        # Levantar en segundo plano
docker compose logs -f      # Ver logs en tiempo real
docker compose down         # Detener y eliminar contenedores
docker compose down -v      # Detener y eliminar volúmenes
docker compose ps           # Estado de servicios
```

## Pruebas

```bash
cd banking-system
mvn test
```

El backend incluye pruebas unitarias con JUnit 5 y Mockito para controladores REST.

## Variables de entorno

### Backend (`banking-system/.env`)
```
SPRING_PROFILES_ACTIVE=default
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/banking_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
```

### Frontend Angular
La URL de la API se configura en `src/environments/environment.ts` (desarrollo) o mediante el build arg `API_URL` en Docker.
