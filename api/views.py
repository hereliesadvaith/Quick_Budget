from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from importlib import import_module
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


@api_view(['GET'])
def get_routes(request):
    """
    To return all the endpoints available.
    """
    routes = []
    return Response(routes)

@api_view(['POST'])
def signup(request):
    """
    To create user.
    """
    data = request.data
    user = User.objects.create_user(
        data.get('username'),
        data.get('username'),
        data.get('password')
    )
    user.first_name = data.get('fname')
    user.last_name = data.get('lname')
    user.save()
    return Response()

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def orm(request):
    """
    REST API CRUD Methods
    """
    user = request.user
    match request.method:
        case 'GET':
            data = request.GET
            content_type = ContentType.objects.get(model=data.get('model'))
            model_class = content_type.model_class()
            serializer_class = getattr(
                import_module('api.serializers'),
                data.get('model').capitalize() + 'Serializer'
            )
            records = model_class.objects.filter(user=user).order_by(
                'date', 'created').reverse()[:10]
            serializer = serializer_class(records, many=True)
            return Response(serializer.data)
    