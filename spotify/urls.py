from django.urls import path
from .views import AuthURL, is_spotify_authenticated, spotify_callback


urlpatterns = [
    path("get-auth-url", AuthURL.as_view()),
    path("redirect", spotify_callback, name=""),
    path("is-authenticated", is_spotify_authenticated),
]
