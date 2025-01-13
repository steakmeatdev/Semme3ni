from django.shortcuts import render
from rest_framework import generics
from .models import Room
from .serializers import RoomSerializer


# set up a generic view with generics.ListAPIView to return all the rooms as JSON
class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
