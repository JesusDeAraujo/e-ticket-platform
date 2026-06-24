import logging
from django.http import JsonResponse
from django.utils import timezone

logger = logging.getLogger('django')

class GlobalExceptionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_exception(self, request, exception):
        status_code = 500
        message = str(exception)

        exception_name = exception.__class__.__name__
        
        if exception_name in ['ObjectDoesNotExist', 'DoesNotExist']:
            status_code = 404
        elif exception_name in ['ValidationError', 'BadRequest']:
            status_code = 400
        elif exception_name in ['PermissionDenied']:
            status_code = 403

        error_response = {
            "statusCode": status_code,
            "timestamp": timezone.now().isoformat(),
            "path": request.path,
            "method": request.method,
            "message": [message]
        }

        logger.error(
            f"[{request.method}] {request.path} - Status: {status_code} - Error: {message}"
        )

        return JsonResponse(error_response, status=status_code)