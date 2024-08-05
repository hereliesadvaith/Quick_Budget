from rest_framework.serializers import ModelSerializer
from .models import Expense


class ExpenseSerializer(ModelSerializer):
    """
    To serialize the expense model
    """
    class Meta:
        model = Expense
        fields = '__all__'
