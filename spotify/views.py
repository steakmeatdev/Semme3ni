from django.shortcuts import render, redirect
from rest_framework import generics, status
from .credentials import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET

from rest_framework.views import APIView
from requests import Request, post
from rest_framework.response import Response
from util import update_or_create_user_tokens, is_spotify_authenticated

# OAuth:

# Generates a Spotify authentication URL that the client can use to redirect users to Spotify for login and authorization


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

    # Handles the Spotify redirection after the user logs in and authorizes the app. It exchanges the authorization code for an access token and refresh token.


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

    # Token data
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

    return redirect("frontend:homePage")


class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(self.request.session.session_key)
        return Response({"status": is_authenticated}, status=status.HTTP_200_OK)
