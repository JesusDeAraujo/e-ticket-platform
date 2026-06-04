const TOKEN = '' //Agregar token de acceso para test de concurrencia
const GATEWAY_URL = 'http://localhost:3000/reservations';
const EVENT_ID = 'concurrency-event-999';

async function enviarReserva(usuarioNombre) {
    try {
        const response = await fetch(GATEWAY_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${TOKEN}`
        },
        body: JSON.stringify({
            eventId: EVENT_ID,
            quantity: 1
        })
        });

    const data = await response.json();
    return {
        usuario: usuarioNombre,
        status: response.status,
        data: data
        };
    } catch (error) {
        return {
        usuario: usuarioNombre,
        status: 'ERROR_RED',
        error: error.message
        };
    }
}

async function ejecutarTest() {
    console.log('Iniciando test de concurrencia... Enviando peticiones simultáneas.');

    const promesas = [
        enviarReserva('Usuario A (Héctor)'),
        enviarReserva('Usuario B (Jesús)'),
        enviarReserva('Usuario C (Carlos)'),
    ];

    const resultados = await Promise.all(promesas);

    console.log('\n=== RESULTADOS DEL TEST DE CONCURRENCIA ===\n');

    let exitosas = 0;
    let rechazadas = 0;

    resultados.forEach(res => {
        if (res.status === 201) {
            exitosas++;
            console.log(`[${res.usuario}]: ¡COMPRA EXITOSA! ID Orden: ${res.data.id}`);
        } else if (res.status === 400 || res.status === 409) {
            rechazadas++;
            console.log(`[${res.usuario}]: RECHAZADO (400) - Motivo: ${res.data.message}`);
        } else {
            console.log(`[${res.usuario}]: Código inesperado (${res.status})`, res.data);
        }
    });

    console.log('\n--- ASERCIÓN DE SEGURIDAD ---');
    console.log(`Compras Exitosas: ${exitosas} (Esperado: 1)`);
    console.log(`Compras Rechazadas: ${rechazadas} (Esperado: 2)`);

    if (exitosas === 1) {
        console.log('\nTEST PASADO CON ÉXITO. El bloqueo pesimista impidió la sobreventa y el inventario negativo.');
    } else {
        console.log('\nTEST FALLIDO. Hubo sobreventa, revisa el bloqueo en la Base de Datos.');
    }
}

ejecutarTest();