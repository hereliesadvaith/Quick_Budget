from .models import Expense
from .serializers import ExpenseSerializer
from django.contrib.auth.models import User
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
def expense(request):
    """
    To create, read, update and delete expenses.
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
