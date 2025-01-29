from django.db import models
import string
import random

# Function to generate random codes for the rooms


def generate_unique_code():
    length = 6

    while True:
        # Generate a random code
        code = "".join(random.choices(string.ascii_uppercase, k=length))
        # Verify whether a room with the generated code exists
        if Room.objects.filter(code=code).count() == 0:
            break
    return code


# Room model
class Room(models.Model):

    code = models.CharField(max_length=50, unique=True, blank=True)

    host = models.CharField(max_length=50, unique=True)

    guest_can_pause = models.BooleanField(default=False)

    votes_to_skip = models.IntegerField(default=1)

    created_at = models.DateTimeField(auto_now_add=True)

    current_song = models.CharField(max_length=50, null=True)

    # Function to save room object in the database
    def save(self, *args, **kwargs):
        if not self.code:
            self.code = (
                generate_unique_code()
            )  # Generate the unique code if not provided
        super().save(*args, **kwargs)
