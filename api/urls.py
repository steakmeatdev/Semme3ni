from django.urls import path
from .views import RoomView, CreateRoomView, GetRoom
urlpatterns = [
    path("home", RoomView.as_view()),
    path("create", CreateRoomView.as_view()),
    path("get", GetRoom.as_view()),
    path("join", GetRoom.as_view())
]