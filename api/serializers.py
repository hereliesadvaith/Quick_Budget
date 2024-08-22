from rest_framework.serializers import ModelSerializer
from .models import Expense


class ExpenseSerializer(ModelSerializer):
    """
    To serialize the expense model
    """
    class Meta:
        model = Expense
        fields = '__all__'
    
    def to_representation(self, instance):
        expenses = super().to_representation(instance)
        if 'category' in expenses:
            expenses['category'] = expenses['category'].capitalize()
        return expenses
