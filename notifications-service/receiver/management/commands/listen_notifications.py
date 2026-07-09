import json
import redis
import bleach
from django.core.management.base import BaseCommand
from django.conf import settings

class Command(BaseCommand):
    help = 'Levanta el listener de Redis Pub/Sub para escuchar eventos de reservaciones con protección Anti-XSS'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Conectando a Redis...'))
        
        r = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, decode_responses=True)
        pubsub = r.pubsub()
        
        channel_name = 'order_created'
        pubsub.subscribe(channel_name)
        
        self.stdout.write(self.style.SUCCESS(f'Microservicio de Notificaciones escuchando el canal "{channel_name}"...'))

        try:
            for message in pubsub.listen():
                if message['type'] == 'message':
                    payload = message['data']
                    self.stdout.write(self.style.WARNING(f'Mensaje recibido: {payload}'))
                    self.process_notification(payload)
                    
        except KeyboardInterrupt:
            self.stdout.write(self.style.ERROR('\nListener detenido manualmente.\n'))

    def process_notification(self, raw_data):
        try:
            data = json.loads(raw_data) if isinstance(raw_data, str) else raw_data
            
            user_id = data.get('userId')
            event_id = data.get('eventId')
            quantity = data.get('quantity')

            if user_id is None or event_id is None or quantity is None:
                self.stdout.write(self.style.WARNING('Datos de orden incompletos. Se ignora la notificación.'))
                return

            user_id_clean = bleach.clean(str(user_id), tags=[], attributes={}, strip=True)
            event_id_clean = bleach.clean(str(event_id), tags=[], attributes={}, strip=True)
            
            quantity_clean = int(quantity)

            self.stdout.write(self.style.SUCCESS(
                f'[NOTIFICACIÓN ENVIADA] Al usuario {user_id_clean}: '
                f'Su orden para el evento {event_id_clean} por {quantity_clean} tickets ha sido confirmada con éxito.'
            ))

        except json.JSONDecodeError:
            self.stdout.write(self.style.ERROR('Error al decodificar el JSON recibido.'))
        except ValueError:
            self.stdout.write(self.style.ERROR('Error de tipo: "quantity" no es un número válido.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error inesperado procesando notificación: {str(e)}'))