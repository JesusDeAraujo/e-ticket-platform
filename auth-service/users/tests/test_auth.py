import pytest
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
class TestAuthEndpoints:
    
    def test_register_user_successful(self, client):
        """Prueba que el endpoint de registro funciona a través de la API"""
        url = reverse('auth_register')
        data = {
            "email": "nuevo@test.com",
            "password": "password123",
            "first_name": "Jesus",
            "last_name": "De Araujo"
        }
        response = client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert User.objects.filter(email="nuevo@test.com").exists()

    def test_login_successful(self, client):
        """Prueba que el login devuelve tokens válidos"""
        email = "login@test.com"
        password = "secret_password"
        User.objects.create_user(email=email, password=password)
        
        url = reverse('token_obtain_pair') 
        data = {"email": email, "password": password}
        response = client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data