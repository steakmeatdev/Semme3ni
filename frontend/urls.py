from django.urls import path
from .views import index

# Use it for spotify api
app_name = "frontend"

urlpatterns = [
    path("", index, name=""),
    path("join", index, name="index"),
    path("create", index, name="index"),
    path("room/<str:roomCode>", index, name="index"),
    path("<path:path>", index),  # Catch-all for any other routes
]
