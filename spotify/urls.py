from django.urls import path
from .views import AuthURL, IsAuthenticated, spotify_callback


urlpatterns = [
    path("get-auth-url", AuthURL.as_view()),
    path("redirect", spotify_callback, name=""),
    path("isauthenticated", IsAuthenticated.as_view()),
]

print("URLs configuration loaded")
