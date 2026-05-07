import pytest
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
def test_create_user_with_email_successful():
    """Prueba que el usuario se crea correctamente con email"""
    email = "test@ejemplo.com"
    password = "password123"
    user = User.objects.create_user(email=email, password=password)
    
    assert user.email == email
    assert user.check_password(password) # Verifica el hash
    assert str(user) == email

@pytest.mark.django_db
def test_create_user_no_email_raises_error():
    """Prueba que el sistema falla si no hay email (Inyección de error)"""
    with pytest.raises(ValueError) as excinfo:
        User.objects.create_user(email=None, password="password123")
    assert "El emaiil debe ser proporcionado" in str(excinfo.value)