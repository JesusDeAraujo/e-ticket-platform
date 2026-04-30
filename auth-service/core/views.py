from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import HttpResponse

@api_view(['GET'])
def hello_world(request):
    return HttpResponse("<h1>Hello world!</h1>")

