import time
import json
import redis
from django.core.management.base import BaseCommand
from django.conf import settings

class Command(BaseCommand):
    help = 'Levanta el listener de Redis Pub/Sub para escuchar eventos de reservaciones'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Conectando a Redis...'))
        
        r = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, decode_responses=True)
        pubsub = r.pubsub()
        
        channel_name = 'order_created',
        pubsub.subscribe(channel_name)
        
        self.stdout.write(self.style.SUCCESS(f'Microservicio de Notificaciones escuchando el canal "{channel_name}"...'))

        try:
            for message in pubsub.listen():
                if message['type'] == 'message':
                    payload = message['data']
                    self.stdout.write(self.style.WARNING(f'Mensaje recibido: {payload}'))
                    
                    try:
                        data = json.loads(payload)
                        user_id = data.get('userId')
                        event_id = data.get('eventId')
                        quantity = data.get('quantity')
                        
                        self.stdout.write(self.style.SUCCESS(
                            f'[NOTIFICACIÓN ENVIADA] Al usuario {user_id}: '
                            f'Su orden para el evento {event_id} por {quantity} tickets ha sido confirmada con éxito.'
                        ))
                    except json.JSONDecodeError:
                        self.stdout.write(self.style.ERROR('Error al decodificar el JSON recibido.'))
                        
        except KeyboardInterrupt:
            self.stdout.write(self.style.ERROR('\nListener detenido manualmente.\n'))