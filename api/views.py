from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view


@api_view(['GET'])
def get_routes(request):
    routes = [
        {
            'Endpoint': '/expense/',
            'method': 'GET',
            'body': None,
            'description': 'Returns an array of expenses'
        },
        {
            'Endpoint': '/expense/create/',
            'method': 'POST',
            'body': {'body': ""},
            'description': 'Creates new expense with data sent in post request'
        },
    ]
    return Response(routes)
