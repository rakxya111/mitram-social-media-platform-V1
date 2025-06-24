from django.urls import path
from . import views

urlpatterns = [
    # Post CRUD
    path('posts/', views.PostListCreateView.as_view(), name='post-list-create'),
    path('posts/<int:pk>/', views.PostDetailView.as_view(), name='post-detail'),
    path('posts/<int:pk>/update/', views.PostUpdateView.as_view(), name='post-update'),
    path('posts/<int:post_id>/update-func/', views.update_post, name='post-update-func'),
    path('posts/<int:post_id>/delete/', views.delete_post, name='delete-post'),

    # Explore and Search
    path('explore/', views.explore_posts, name='explore-posts'),

    # User specific posts
    path('my-posts/', views.my_posts, name='my-posts'),
    path('users/<int:user_id>/posts/', views.UserPostView.as_view(), name='user-posts'),
    
    # Saved posts
    path('saved/', views.SavedPostView.as_view(), name='saved-posts'),
    path('liked/', views.LikedPostView.as_view(), name='liked-posts'),

    # Like and save post functionality
    path('posts/<int:post_id>/like/', views.toggle_like, name='toggle-like'),
    path('posts/<int:post_id>/save/', views.toggle_save, name='toggle-save'),
]