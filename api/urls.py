from django.urls import path
from .views import RoomView, CreateRoomView, JoinRoom, GetRoom, UserInRoom, LeaveRoom, UpdateRoom
urlpatterns = [
    path("home", RoomView.as_view()),
    path("create", CreateRoomView.as_view()),
    path("get", GetRoom.as_view()),
    path("join", JoinRoom.as_view()),
    path("userinroom", UserInRoom.as_view()),
    path("leave", LeaveRoom.as_view()),
    path("update", UpdateRoom.as_view()),
]