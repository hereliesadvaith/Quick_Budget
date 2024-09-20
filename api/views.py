from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from importlib import import_module
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


@api_view(['GET'])
def get_routes(request):
    """
    To return all the endpoints available in the API.
    """
    routes = {
        "endpoints": [
            {
                'endpoint': '/api/token/',
                'method': 'POST',
                'description': 'Obtain a new token by providing username and password.'
            },
            {
                'endpoint': '/api/token/refresh/',
                'method': 'POST',
                'description': 'Refresh an existing token using a refresh token.'
            },
            {
                'endpoint': '/api/signup/',
                'method': 'POST',
                'description': 'Create a new user account.'
            },
            {
                'endpoint': '/api/orm/<str:model>/',
                'methods': [
                    {
                        'method': 'GET',
                        'description': 'Retrieve all instances of a specified  model.'
                    },
                    {'method': 'POST',
                     'description': 'Create a new instance of the specified model.'
                    }
                ]
            },
            {
                'endpoint': '/api/orm/<str:model>/<str:id>/',
                'methods': [
                    {
                        'method': 'GET',
                        'description': 'Retrieve a specific instance of a model by ID.'
                    },
                    {
                        'method': 'PUT',
                        'description': 'Update a specific instance of a model by ID.'
                    },
                    {
                        'method': 'DELETE',
                        'description': 'Delete a specific instance of a model by ID.'
                    }
                ]
            }
        ],
        "status": "operational"
    }
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

def get_classes(model):
    model_class =  ContentType.objects.get(model=model).model_class()
    serializer_class = getattr(
        import_module('api.serializers'),
        model.capitalize() + 'Serializer'
    )
    return model_class, serializer_class

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def orm_all(request, model):
    """
    REST API CRUD Methods
    """
    user = request.user
    match request.method:

        case 'GET':
            data = request.GET
            model_class, serializer_class = get_classes(model)
            records = model_class.objects.filter(user=user).order_by(
                'date', 'created'
            ).reverse()[:10]
            serializer = serializer_class(records, many=True)
            return Response(serializer.data)

        case 'POST':
            data = request.data
            model_class, serializer_class = get_classes(model)
            data.pop('id')
            fields = {
                key: value for key, value in data.items(
                ) if key in [
                    field.name for field in model_class._meta.fields
                ]
            }
            fields['user'] = user
            model_class.objects.create(**fields)
            return Response(status=status.HTTP_201_CREATED)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def orm_one(request, model, id):
    """
    REST API CRUD Methods
    """
    match request.method:

        case 'PUT':
            data = request.data
            model_class, serializer_class = get_classes(model)
            data.pop('id')
            data.pop('user')
            fields = {
                key: value for key, value in data.items(
                ) if key in [
                    field.name for field in model_class._meta.fields
                ]
            }
            record = model_class.objects.get(id=id)
            for attr, value in fields.items():
                setattr(record, attr, value)
            record.save()
            return Response(status=status.HTTP_200_OK)

        case 'DELETE':
            model_class, serializer_class = get_classes(model)
            record = model_class.objects.get(id=id)
            record.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
