from django.shortcuts import render, redirect
from rest_framework import generics, status
from .credentials import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET

from rest_framework.views import APIView
from requests import Request, post, get
from rest_framework.response import Response

from api.models import Room
from .util import *
from .serializers import SpotifyTokenSerializer
from django.forms import model_to_dict


class SpotifyTokensView(generics.ListAPIView):
    queryset = SpotifyToken.objects.all()
    serializer_class = SpotifyTokenSerializer


class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(self.request.session.session_key)
        return Response({"status": is_authenticated}, status=status.HTTP_200_OK)


# first Step of OAuth: URL of user
class AuthURL(APIView):

    def get(self, request, format=None):

        scopes = "user-read-playback-state user-modify-playback-state user-read-currently-playing"

        # Creating authoraziation URL for user
        url = (
            Request(
                "GET",
                "https://accounts.spotify.com/authorize",
                params={
                    "scope": scopes,
                    "response_type": "code",
                    "redirect_uri": REDIRECT_URI,
                    "client_id": CLIENT_ID,
                },
            )
            .prepare()
            .url
        )
        return Response({"url": url}, status=status.HTTP_200_OK)


# Second step of OAuth: Exchanging the authorization code for an access token and refresh token.
def spotify_callback(request, format=None):
    code = request.GET.get("code")
    error = request.GET.get("error")

    # Requesting Token
    response = post(
        "https://accounts.spotify.com/api/token",
        data={
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": REDIRECT_URI,
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
        },
    ).json()

    access_token = response.get("access_token")
    token_type = response.get("token_type")
    refresh_token = response.get("refresh_token")
    expires_in = response.get("expires_in")
    error = response.get("error")

    # As always, if user doesn't have a session, they should create one

    if not request.session.session_key:
        request.session.create()

    # Using user session key to and token data create user token and save it

    update_or_create_user_tokens(
        request.session.session_key,
        access_token,
        token_type,
        expires_in,
        refresh_token,
    )
    room_code = request.session.get("room_code")
    return redirect(f"/room/{room_code}")


class CurrentSong(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get("room_code")
        room = Room.objects.filter(code=room_code)

        if room.exists():
            room = room[0]
        else:
            return Response({}, status=status.HTTP_404_NOT_FOUND)

        host = room.host

        # Specifying required data
        endpoint = "player/currently-playing"

        response = execute_spotify_api_request(host, endpoint)

        if "error" in response or "item" not in response:
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        # getting data about the song
        item = response.get("item")
        duration = item.get("duration_ms")
        progress = response.get("progress_ms")
        album_cover = item.get("album").get("images")[0].get("url")
        is_playing = response.get("is_playing")
        song_id = item.get("id")

        artist_string = ""

        # Custom function to return Artist name
        for i, artist in enumerate(item.get("artists")):
            if i > 0:
                artist_string += ", "
            name = artist.get("name")
            artist_string += name

        song = {
            "title": item.get("name"),
            "artist": artist_string,
            "duration": duration,
            "time": progress,
            "image_url": album_cover,
            "is_playing": is_playing,
            "votes": 0,
            "id": song_id,
        }
        print(song)

        return Response(song, status=status.HTTP_200_OK)


class GetUserTokens(APIView):
    serializer_class = SpotifyTokenSerializer

    def get(self, request, format=None):
        tmp = get_user_tokens(request.session.session_key)
        token = model_to_dict(tmp)
        if token:
            serializer = self.serializer_class(data=token)
            if serializer.is_valid():
                print("this is current user token" + str(serializer.data))
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:

                return Response(
                    {"error": "Invalid token data", "details": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {"error": "Token not found", "message": "No tokens for this user"},
                status=status.HTTP_404_NOT_FOUND,  # 404 is more appropriate for "not found"
            )
