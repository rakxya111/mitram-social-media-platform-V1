from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView
from . import views

urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_user, name='logout'),

    # Auth & Token
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # User data
    path('user/', views.get_current_user, name='get_current_user'),  # ✅ Kept
    path('users/<int:id>/', views.get_user_by_id, name='get_user_by_id'),
    path('users/update/<int:pk>/', views.update_user_profile, name='update_profile'),
    path('users/list/', views.list_users, name='list_users'),
    # path('profile/', views.get_user_profile, name='profile'),
]
