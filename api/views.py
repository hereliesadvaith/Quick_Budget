from django.shortcuts import render
from django.http import JsonResponse


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
    return JsonResponse(routes, safe=False)
