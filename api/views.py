from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Expense
from .serializers import ExpenseSerializer


@api_view(['GET'])
def get_routes(request):
    """
    To return all the endpoints available.
    """
    routes = [
        {
            'endpoint': '/expense/',
            'method': 'GET',
            'body': None,
            'description': 'Returns an array of expenses'
        },
        {
            'endpoint': '/expense/create/',
            'method': 'POST',
            'body': {'body': ""},
            'description': 'Creates new expense with data sent in post request'
        },
    ]
    return Response(routes)

@api_view(['GET'])
def get_expenses(request):
    """
    To return the expenses.
    """
    expenses = Expense.objects.all()
    serializer = ExpenseSerializer(expenses, many=True)
    return Response(serializer.data)
