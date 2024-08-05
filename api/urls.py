from django.urls import path
from . import views


urlpatterns = [
    path('', views.get_routes, name='routes'),
    path('expense/', views.get_expenses, name='expenses')
]
