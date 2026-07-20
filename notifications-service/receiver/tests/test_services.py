import json
import pytest
from unittest.mock import MagicMock, patch
from receiver.management.commands.listen_notifications import Command

class TestListenNotificationsCommand:

    @pytest.fixture
    def command(self):
        return Command()

    def test_process_notification_success(self, command):
        """Prueba que procesa correctamente una notificación válida con Anti-XSS"""
        raw_payload = json.dumps({
            "userId": "<script>alert('xss')</script>user123",
            "eventId": "event456",
            "quantity": 2
        })
        
        with patch.object(command.stdout, 'write') as mock_write:
            command.process_notification(raw_payload)
            
            mock_write.assert_called()
            output_args = mock_write.call_args[0][0]
            assert "user123" in output_args
            assert "<script>" not in output_args

    def test_process_notification_missing_fields(self, command):
        """Prueba qué pasa si faltan datos en la orden"""
        raw_payload = json.dumps({"userId": "user123"})  #Faltan eventId y quantity
        
        with patch.object(command.stdout, 'write') as mock_write:
            command.process_notification(raw_payload)
            mock_write.assert_called()

    def test_process_notification_invalid_json(self, command):
        """Prueba el manejo de un JSON corrupto"""
        raw_payload = "{json_invalido:"
        
        with patch.object(command.stdout, 'write') as mock_write:
            command.process_notification(raw_payload)
            mock_write.assert_called()

    def test_process_notification_invalid_quantity(self, command):
        """Prueba el manejo de error cuando quantity no es un número"""
        raw_payload = json.dumps({
            "userId": "user123",
            "eventId": "event456",
            "quantity": "no_es_numero"
        })
        
        with patch.object(command.stdout, 'write') as mock_write:
            command.process_notification(raw_payload)
            mock_write.assert_called()

    @patch('redis.Redis')
    def test_handle_pubsub_loop(self, mock_redis, command):
        """Prueba la ejecución de handle mockeando Redis PubSub"""
        mock_r = MagicMock()
        mock_pubsub = MagicMock()
        
        #Simulamos que el generador pubsub.listen() devuelve 1 mensaje válido y luego interrumpe
        mock_pubsub.listen.return_value = [
            {'type': 'message', 'data': json.dumps({"userId": "u1", "eventId": "e1", "quantity": 1})}
        ]
        mock_r.pubsub.return_value = mock_pubsub
        mock_redis.return_value = mock_r

        with patch.object(command, 'process_notification') as mock_process:
            command.handle()
            mock_process.assert_called_once()