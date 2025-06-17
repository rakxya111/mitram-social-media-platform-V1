from django.db import models
from django.conf import settings

# Create your models here.

# class Post(models.Model):
#     creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')
#     caption = models.TextField(blank=True, null=True)
#     tags = models.CharField(max_length=255, blank=True, null=True)
#     image = models.ImageField(upload_to='post_images/')
#     imageId = models.CharField(max_length=255)
#     location = models.CharField(max_length=255, blank=True, null=True)

#     likes = models.ManyToManyField(settings.AUTH_USER_MODEL, through='Like', related_name='liked_posts', blank=True)
#     save = models.ManyToManyField(settings.AUTH_USER_MODEL, through='Save', related_name='saved_posts', blank=True)

#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.creator.username}'s post"


# class Save(models.Model):
#     user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
#     post = models.ForeignKey(Post, on_delete=models.CASCADE)
#     saved_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         unique_together = ('user', 'post') #To prevent duplicate saves
    
#     def __str__(self):
#         return f"{self.user.username} saved {self.post.id}"
    
# class Like(models.Model):
#     user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
#     post = models.ForeignKey('Post', on_delete=models.CASCADE)
#     liked_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         unique_together = ('user', 'post')  # ensures one like per post per user

#     def __str__(self):
#         return f"{self.user.username} liked {self.post.id}"

