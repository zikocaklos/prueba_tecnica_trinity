-- Script para crear la base de datos banking_db en PostgreSQL
-- Ejecutar este script si no usas Docker

-- Crear la base de datos
CREATE DATABASE banking_db
    WITH 
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TEMPLATE = template0;

-- Conectar a la base de datos
\c banking_db;

-- Nota: Las tablas serán creadas automáticamente por Hibernate
-- Este script solo crea la base de datos

-- Verificar que la base de datos fue creada
SELECT datname FROM pg_database WHERE datname = 'banking_db';
