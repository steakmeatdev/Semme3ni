from django.urls import path
from .views import index  # Assuming index is the view serving your React app

urlpatterns = [
    path("", index, name="index"),
    path("join", index, name="index"),
    path("create", index, name="index"),
    path("room/<str:roomCode>", index, name="index"),
    path("<path:path>", index),  # Catch-all for any other routes
]