from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,  # ✅ Import this
)

urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('profile/', views.get_user_profile, name='profile'),
    path('users/<int:id>/', views.get_user_by_id, name='get_user_by_id'),
    path('profile/update/', views.update_user_profile, name='update_profile'),
    path('logout/',views.logout_user,name="logout"),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]
