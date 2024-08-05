from django.db import models


class Expense(models.Model):
    """
    Model for expense table
    """
    expense = models.CharField(max_length=20)
    price = models.FloatField()
    date = models.DateField()
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """
        String Representation
        """
        return f"{self.expense}: {self.price}"
