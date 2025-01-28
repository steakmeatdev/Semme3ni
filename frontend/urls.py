from django.urls import path
from .views import index

# Use it for spotify api
app_name = "frontend"

urlpatterns = [
    path("", index, name="home"),
    path("join", index),
    path("create", index),
    path("room/<str:roomCode>/<str:authenticateduser>", index),
    path("<path:path>", index),  # Catch-all for any other routes
]
