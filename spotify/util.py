from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from django.utils.timezone import now
from .credentials import CLIENT_ID, CLIENT_SECRET
from requests import post, put, get, patch


# Gettin the user tokens using session_key
def get_user_tokens(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)

    if user_tokens.exists():
        return user_tokens[0]
    else:
        None


# Creating a user token (using his session_key) or updating his already exisiting one with new data
def update_or_create_user_tokens(
    session_id, access_token, token_type, expires_in, refresh_token
):

    expires_in = now() + timedelta(seconds=expires_in)
    tokens = get_user_tokens(session_id)
    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type

        tokens.save(
            update_fields=["access_token", "refresh_token", "expires_in", "token_type"]
        )
    else:
        tokens = SpotifyToken(
            user=session_id,
            access_token=access_token,
            refresh_token=refresh_token,
            token_type=token_type,
            expires_in=expires_in,
        )
        tokens.save()


# Handling numerous refreshes
def is_spotify_authenticated(session_id):
    tokens = get_user_tokens(session_id)
    if tokens:
        exipry = tokens.expires_in
        if exipry <= timezone.now():
            return refresh_spotify_token(session_id)
        else:
            return True
    return False


def refresh_spotify_token(session_id):
    refresh_token = get_user_tokens(session_id).refresh_token

    # Make the POST request
    response = post(
        "https://accounts.spotify.com/api/token",
        data={
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
        },
    )

    if response.status_code == 200:

        response_data = response.json()

        access_token = response_data.get("access_token")
        token_type = response_data.get("token_type")
        expires_in = response_data.get("expires_in")
        refresh_token = response_data.get("refresh_token")

        if refresh_token == None:
            return False
        else:
            update_or_create_user_tokens(
                session_id, access_token, token_type, expires_in, refresh_token
            )
            return True
    else:
        print(f"Failed to refresh token. Status code: {response.status_code}")
        return False


BASE_URL = "https://api.spotify.com/v1/me/"


def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False):
    tokens = get_user_tokens(session_id)

    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + tokens.access_token,
    }

    if post_:
        post(BASE_URL + endpoint, headers=headers)
    if put_:
        put(BASE_URL + endpoint, headers=headers)

    response = get(BASE_URL + endpoint, {}, headers=headers)

    try:
        return response.json()
    except:
        return {"Error": "Issue with request"}


def play_song(session_id):
    return execute_spotify_api_request(session_id, "player/play", put_=True)


def pause_song(session_id):
    return execute_spotify_api_request(session_id, "player/pause", put_=True)


def skip_song(session_id):
    return execute_spotify_api_request(session_id, "player/next", post_=True)
