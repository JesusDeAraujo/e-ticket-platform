from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import HttpResponse
from drf_spectacular.utils import extend_schema

#Vista creada para verificar el funcionamiento. Oculta del swagger
@extend_schema(exclude=True)
@api_view(['GET'])
def hello_world(request):
    return HttpResponse("<h1>Hello world!</h1>")

# Vista creada para verificar el funcionamiento del middleware
def test_error(request):
    resultado = 1 / 0 
    return HttpResponse("No se verá")