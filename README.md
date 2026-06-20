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