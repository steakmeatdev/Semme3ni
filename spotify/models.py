from django.db import models
from api.models import Room


class SpotifyToken(models.Model):
    user = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    refresh_token = models.CharField(max_length=250, null=True, blank=True)
    access_token = models.CharField(max_length=250)
    expires_in = models.DateTimeField()
    token_type = models.CharField(max_length=100)


# Vote: core model of the app, basically how to save a user's vote (we need a the room he's currently at, his session_key, the current song in the room, and room itself)
class Vote(models.Model):
    user = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    song_id = models.CharField(max_length=50)

    # Saving a room key (generated automatically)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
