from rest_framework import generics, permissions, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth import get_user_model
from .models import Post, Like, Save
from .serializers import (
    PostSerializer, 
    PostCreateUpdateSerializer, 
    SavedPostSerializers,
    LikedPostSerializers
)
from accounts.serializers import UserSerializer

User = get_user_model()

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions are only allowed to the owner of the post.
        return obj.creator == request.user

class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['caption','tags','creator__username']
    ordering_fields = ['created_at', 'likes_count']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PostCreateUpdateSerializer
        return PostSerializer
    
    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return PostCreateUpdateSerializer
        return PostSerializer

class PostUpdateView(generics.UpdateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostCreateUpdateSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

class UserPostView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return Post.objects.filter(creator_id=user_id)

class SavedPostView(generics.ListAPIView):
    serializer_class = SavedPostSerializers
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Save.objects.filter(user=self.request.user).select_related('post')

class LikedPostView(generics.ListAPIView):
    serializer_class = LikedPostSerializers
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Like.objects.filter(user=self.request.user).select_related('post')

# Like and Save functionality
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_like(request, post_id):
    """
    Toggle like on a post.
    """
    try:
        post = get_object_or_404(Post, id=post_id)
        like, created = Like.objects.get_or_create(user=request.user, post=post)
        
        if not created:
            like.delete()
            return Response({
                'message': 'Post unliked successfully',
                'is_liked': False,
                'likes_count': post.like_set.count()
            }, status=status.HTTP_200_OK)
        
        return Response({
            'message': 'Post liked successfully',
            'is_liked': True,
            'likes_count': post.like_set.count()
        }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response({
            'error': 'An error occurred while processing your request'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_save(request, post_id):
    """
    Toggle save on a post.
    """
    try:
        post = get_object_or_404(Post, id=post_id)
        save, created = Save.objects.get_or_create(user=request.user, post=post)
        
        if not created:
            save.delete()
            return Response({
                'message': 'Post unsaved successfully',
                'is_saved': False,
                'saves_count': post.save_set.count()
            }, status=status.HTTP_200_OK)
        
        return Response({
            'message': 'Post saved successfully',
            'is_saved': True,
            'saves_count': post.save_set.count()
        }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response({
            'error': 'An error occurred while processing your request'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def explore_posts(request):
    """
    Get all posts for explore page with search functionality.
    """
    try:
        posts = Post.objects.annotate(likes_count=Count('like_set'))
        
        # Search functionality
        search_query = request.GET.get('search', '')
        if search_query:
            posts = posts.filter(
                Q(caption__icontains=search_query) |
                Q(tags__icontains=search_query) |
                Q(creator__username__icontains=search_query) |
                Q(location__icontains=search_query)
            )
        
        # Filter by tags
        tag_filter = request.GET.get('tag', '')
        if tag_filter:
            posts = posts.filter(tags__icontains=tag_filter)
        
        # Filter by location
        location_filter = request.GET.get('location', '')
        if location_filter:
            posts = posts.filter(location__icontains=location_filter)
        
        # Ordering
        ordering = request.GET.get('ordering', '-created_at')
        if ordering in ['created_at', '-created_at', 'likes_count', '-likes_count']:
            posts = posts.order_by(ordering)
        
        serializer = PostSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)
    
    except Exception as e:
        return Response({
            'error': 'An error occurred while fetching posts'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_posts(request):
    try:
        posts = Post.objects.filter(creator=request.user)
        serializer = PostSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)
    
    except Exception as e:
        return Response({
            'error': 'An error occurred while fetching your posts'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_post(request, post_id):
    try:
        post = get_object_or_404(Post, id=post_id)

        if post.creator != request.user:
            return Response({
                'error': 'You do not have permission to delete this post.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        post.delete()
        return Response({
            'message': 'Post deleted successfully.'
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'error': 'An error occurred while deleting the post'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Function-based update view alternative
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_post(request, post_id):
    """
    Update a specific post.
    """
    try:
        post = get_object_or_404(Post, id=post_id)
        
        # Check if user owns the post
        if post.creator != request.user:
            return Response({
                'error': 'You do not have permission to update this post.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Partial update for PATCH, full update for PUT
        partial = request.method == 'PATCH'
        serializer = PostCreateUpdateSerializer(post, data=request.data, partial=partial)
        
        if serializer.is_valid():
            serializer.save()
            # Return the updated post with full details
            updated_post_serializer = PostSerializer(post, context={'request': request})
            return Response({
                'message': 'Post updated successfully',
                'post': updated_post_serializer.data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        return Response({
            'error': 'An error occurred while updating the post'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
