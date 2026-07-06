# syntax=docker/dockerfile:1

# Etapa 1: construcción del proyecto con Maven y Java 21
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /workspace/app

# Copiar solo el pom para aprovechar la caché de dependencias de Maven
COPY pom.xml ./
RUN mvn -B -DskipTests dependency:go-offline

# Copiar el código fuente del backend
COPY src ./src

# Compilar y generar el JAR ejecutable
RUN mvn -B -DskipTests package

# Etapa 2: imagen final ligera para ejecutar la aplicación
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Crear un usuario no root para mayor seguridad
RUN groupadd --system spring && useradd --system --gid spring spring

# Copiar el JAR desde la etapa de construcción
COPY --from=build /workspace/app/target/*.jar app.jar

EXPOSE 8080
ENV JAVA_OPTS=""

USER spring:spring
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
