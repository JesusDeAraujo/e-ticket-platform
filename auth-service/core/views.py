from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import HttpResponse

@api_view(['GET'])
def hello_world(request):
    return HttpResponse("<h1>Hello world!</h1>")

# Vista creada para verificar el funcionamiento del middleware
def test_error(request):
    resultado = 1 / 0 
    return HttpResponse("No se verá")