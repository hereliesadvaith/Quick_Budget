from rest_framework.serializers import ModelSerializer
from .models import Expense
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


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



class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token
