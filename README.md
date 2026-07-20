### Instrucciones de ejecución del archivo Flujo-compra-boletos.json:
1. Abre **Insomnia**.
2. Importa el archivo ubicado en `/docs/FlujoCompleto.CompraDeBoletos/flujo-compra-boletos.json`.
3. **Configura el Environment (Entorno) en Insomnia** (YA DEBERIAN ESTAR CONFIGURADAS)
   * **Desarrollo Local:** Cambia `base_url` a `http://localhost:3000`.
   * **Producción** ingresa a la URL pública del proyecto
4. Ejecuta las peticiones en el orden vertical establecido.
   * **1. GET - Buscar Eventos Disponibles (PUBLICO):** Verifica la disponibilidad inicial.
   * **2. POST - Autenticación:** Genera el JWT de acceso.
   * **3. POST - Crear Eventos:** Inserta datos en MongoDB.
   * **4. POST - Reservar entrada:** Ejecuta el bloqueo pesimista en PostgreSQL y comunica mediante Redis.
   * **5. GET - Validación / Verificación:** Confirma el estado final de la reserva.

## Cobertura General de Pruebas

| Microservicio | Framework / Herramienta | Cobertura | Estado | Reporte |
| :--- | :--- | :---: | :---: | :---: |
| **`api-gateway`** | NestJS + Jest | `85.29%` | 🟢 | [`/coverage`](./api-gateway/coverage) |
| **`auth-service`** | Django + Pytest | `81%` | 🟢 | [`/htmlcov`](./auth-service/htmlcov) |
| **`events-service`** | NestJS + Jest | `94.33` | 🟢 | [`/coverage`](./events-service/coverage) |
| **`notifications-service`** | Django + Pytest | `95%` | 🟢 | [`/htmlcov`](./notifications-service/htmlcov) |
| **`reservations-service`** | NestJS + Jest | `95.45%` | 🟢 | [`/coverage`](./reservations-service/coverage) |

## Instrucciones de Ejecución de Pruebas

Para verificar las pruebas de cada servicio de manera independiente:
### Servicios Django (`auth-service`, `notifications-service`)

cd <nombre-del-servicio>
pytest --cov=. --cov-report=html

### Servicios NestJS (`api-gateway`, `events-service`, `reservations-service`)

cd <nombre-del-servicio>
npm run test:cov

