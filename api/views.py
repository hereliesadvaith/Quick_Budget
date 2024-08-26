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
            'body': {'body': ''},
            'description': 'Creates new expense with data sent in post request'
        },
    ]
    return Response(routes)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def expense(request):
    """
    To return the expenses.
    """
    if request.method == 'GET':
        expenses = Expense.objects.order_by('date', 'created').reverse()[:10]
        serializer = ExpenseSerializer(expenses, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        data = request.data
        Expense.objects.create(
            expense=data['expense'],
            price=data['price'],
            date=data['date'],
            category=data['category']
        )
        expenses = Expense.objects.order_by('date', 'created').reverse()[:10]
        serializer = ExpenseSerializer(expenses, many=True)
        return Response(serializer.data)
    elif request.method == 'PUT':
        expenses = Expense.objects.order_by('date', 'created').reverse()[:10]
        serializer = ExpenseSerializer(expenses, many=True)
        return Response(serializer.data)
    elif request.method == 'DELETE':
        expense = Expense.objects.get(id=request.data.get('id'))
        expense.delete()
        expenses = Expense.objects.order_by('date', 'created').reverse()[:10]
        serializer = ExpenseSerializer(expenses, many=True)
        return Response(serializer.data)
