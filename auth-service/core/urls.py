"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from .views import hello_world
from .views import test_error
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)
from users.views import RegisterView, UserView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from drf_spectacular.utils import extend_schema, extend_schema_view

DecoratedTokenObtainPairView = extend_schema_view(
    post=extend_schema(
        summary="Iniciar sesión",
        description="Autentica las credenciales del usuario y retorna los tokens JWT.",
        tags=["Autenticación"],
    )
)(TokenObtainPairView)

DecoratedTokenRefreshView = extend_schema_view(
    post=extend_schema(
        summary="Refrescar Token JWT",
        description="Recibe un refresh token válido y genera un nuevo access token.",
        tags=["Autenticación"],
    )
)(TokenRefreshView)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('hello/', hello_world),
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterView.as_view(), name='auth_register'),
    path('api/me/', UserView.as_view(), name='user_me'),
    path('api/test-error/', test_error),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui')
]
