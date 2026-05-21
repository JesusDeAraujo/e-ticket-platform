# Arquitectura del Sistema - E-Ticket Platform

## 1. Patrón API Gateway
Se ha implementado un **API Gateway** utilizando **NestJS** como único punto de entrada para los clientes.

### Funciones Aplicadas:
* **Reverse Proxy:** Redirige las peticiones hacia los microservicios internos (ej. `/auth` -> Django).
* **Seguridad:** Centralización de políticas de CORS, Helmet y Rate Limiting.
* **Abstracción:** El cliente desconoce la infraestructura interna y solo interactúa con el puerto 3000.

## 2. Microservicio de Autenticación (Auth-Service)
Desarrollado en **Django + DRF**, encargado de la gestión de usuarios y emisión de tokens JWT.

### Comunicación e Infraestructura:
* **Base de Datos:** PostgreSQL para persistencia de usuarios.
* **Capa de Caché (Redis):** Utilizado para mejorar la velocidad de respuesta y comunicación entre servicios.
* **Seguridad:** Implementación de Custom User Model (Email-based) y Hash de contraseñas PBKDF2.

## 3. Diagrama de Flujo
[Client] -> [API Gateway (NestJS)] -> [Auth Service (Django)] <-> [Redis/PostgreSQL]