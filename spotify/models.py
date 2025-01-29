from django.db import models


class SpotifyToken(models.Model):
    user = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    refresh_token = models.CharField(max_length=250, null=True, blank=True)
    access_token = models.CharField(max_length=250)
    expires_in = models.DateTimeField()
    token_type = models.CharField(max_length=100)
