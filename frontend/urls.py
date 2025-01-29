from django.urls import path
from .views import index

# Use it for spotify api
app_name = "frontend"

urlpatterns = [
    path("", index, name="home"),
    path("join", index),
    path("create", index),
    path("room/<str:roomCode>", index),
    path("musicPlayer/<str:song>", index, name="music page"),
    path("<path:path>", index),  # Catch-all for any other routes
]
