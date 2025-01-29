from django.urls import re_path
from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    re_path("signup", views.signup),
    re_path("login", views.login),
    re_path("test_token", views.test_token),
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),
    path("spotify/", include("spotify.urls")),
    path("", include("frontend.urls")),
]
