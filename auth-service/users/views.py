from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema, OpenApiResponse
from .models import User
from .serializers import RegisterSerializer, UserSerializer


@extend_schema(
    summary="Registro de nuevo usuario",
    description="Crea una nueva cuenta de usuario en la plataforma.",
    tags=["Autenticación"],
    responses={
        201: OpenApiResponse(response=UserSerializer, description="Usuario creado exitosamente."),
        400: OpenApiResponse(description="Error de validación en los datos de registro."),
    },
)
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class UserView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="Obtener perfil del usuario autenticado",
        description="Retorna la información del usuario en sesión actual.",
        tags=["Autenticación"],
        responses={
            200: UserSerializer,
            401: OpenApiResponse(description="Token de autenticación inválido o ausente."),
        },
    )
    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)