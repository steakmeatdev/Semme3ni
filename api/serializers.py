from rest_framework import serializers
from .models import Room

# Room model serializer
class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ("id", "code", "host", "guest_can_pause", "votes_to_skip", "created_at")

# Necessary for POST request validation
class CreateRoomSerializer(serializers.ModelSerializer):
     class Meta:
        model = Room
        fields = ("guest_can_pause", "votes_to_skip")

class UpdateRoomSerializer(serializers.ModelSerializer):
    
    # removing UniqueValidator for code
    code = serializers.CharField(validators=[])
    
    class Meta:
        model = Room
        fields = ("guest_can_pause","votes_to_skip", "code")
