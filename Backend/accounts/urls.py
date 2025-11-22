from django.urls import path
from .views import register, login, update_address, update_profile, get_user

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('update-address/', update_address, name='update_address'),
    path('update-profile/', update_profile, name='update_profile'),
    path('user/<str:user_id>/', get_user, name='get_user'),
]
