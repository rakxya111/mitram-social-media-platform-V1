from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Post, Save, Like
from accounts.serializers import UserSerializer

User = get_user_model()

class PostSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()
    saves_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'caption', 'tags', 'image', 'imageId', 'location', 'creator', 'created_at', 'likes_count', 'saves_count', 'is_liked', 'is_saved']
        read_only_fields = ['creator', 'created_at', 'imageId']

    def get_likes_count(self, obj):
        return obj.like_set.count()
    
    def get_saves_count(self, obj):
        return obj.save_set.count()
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Like.objects.filter(user=request.user, post=obj).exists()
        return False
    
    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Save.objects.filter(user=request.user, post=obj).exists()
        return False

class PostCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['caption', 'tags', 'image', 'location']
        extra_kwargs = {
            'caption': {'required': False, 'allow_blank': True},
            'tags': {'required': False, 'allow_blank': True},
            'location': {'required': False, 'allow_blank': True},
            'image': {'required': False, 'allow_null': True},
        }

    def validate_caption(self, value):
        if value and len(value.strip()) > 2200:
            raise serializers.ValidationError("Caption cannot exceed 2200 characters.")
        return value

    def update(self, instance, validated_data):
        # If image is not in request data, keep old image
        if 'image' not in validated_data:
            validated_data['image'] = instance.image
        return super().update(instance, validated_data)

class SavedPostSerializers(serializers.ModelSerializer):
    post = PostSerializer(read_only=True)

    class Meta:
        model = Save
        fields = ['id', 'post', 'saved_at']

class LikedPostSerializers(serializers.ModelSerializer):
    post = PostSerializer(read_only=True)

    class Meta:
        model = Save
        fields = ['id', 'post']