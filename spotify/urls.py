from django.urls import path
from .views import *


urlpatterns = [
    path("get-auth-url", AuthURL.as_view()),
    path("tokenInfo", GetUserTokens.as_view()),
    path("redirect", spotify_callback, name=""),
    path("isauthenticated", IsAuthenticated.as_view()),
    path("current-song", CurrentSong.as_view()),
    path("displayTokens", SpotifyTokensView.as_view()),
    path("pause", PauseSong.as_view()),
    path("play", PlaySong.as_view()),
    path("skip", SkipSong.as_view()),
]

print("URLs configuration loaded")
