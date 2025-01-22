from django.shortcuts import render
from rest_framework import generics, status
from .models import Room
from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse


# Set up a generic view with generics.ListAPIView to display all the Room objects
class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

class GetRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = "code"

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            room = Room.objects.filter(code = code)
            if len(room) > 0:
                data = RoomSerializer(room[0]).data
                data["is_host"] = self.request.session.session_key == room[0].host
                # Returning the room instance
                return Response(data, status=status.HTTP_200_OK)
            return Response({"Room Not Found":"Invalid Room Code"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"Bad request":"Code parameter not found"}, status=status.HTTP_400_BAD_REQUEST)
    
# Creating a new room using the guest_can_pause and votes_to_skip, the other attributes are generated automatically 

class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request):
        # Check active session
        print(self.request.session.session_key)
        if not self.request.session.session_key:
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.validated_data.get("guest_can_pause")
            votes_to_skip = serializer.validated_data.get("votes_to_skip")
            host = self.request.session.session_key

            # Checking if the room already exists
            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                room = queryset[0] 
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=["guest_can_pause", "votes_to_skip"])
                self.request.session["room_code"] = room.code
            else:
                room = Room(host=host, guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip)
                room.save()
                self.request.session["room_code"] = room.code
            print(RoomSerializer(room).data)
            return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

# Joining by basically just adding the room code to the session data

class JoinRoom(APIView):
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        # Directly get "code" from the request data
        code = request.data.get("code")
        if code is not None:
            room_result = Room.objects.filter(code=code)
            if len(room_result) > 0:
                room = room_result[0]
                self.request.session["room_code"] = code
                return Response({"message": "Room joined"}, status=status.HTTP_200_OK)
            return Response({"Bad request": "Invalid Room Code"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"Bad request": "Post data missing"}, status=status.HTTP_400_BAD_REQUEST)


# Checking if user is in a room and if so returning the room code

class UserInRoom(APIView):
    def get(self, request, format=None):
        data = {
            "code": self.request.session.get("room_code")
        }
        # Since I used a normal dictionnary, I will just use the JsonResponse
        return JsonResponse(data, status=status.HTTP_200_OK)
    



# Endpoint for leaving a Room by simply removing the room code from session object or the whole room if the user is host (checking host)

class LeaveRoom(APIView):
    def post(self, request, format=None):
        if 'room_code' in self.request.session:
            self.request.session.pop('room_code')
            # If user is a host, then the room gets deleted from the database
            host_id = self.request.session.session_key
            room_results = Room.objects.filter(host=host_id)
            if len(room_results) > 0:
                room = room_results[0]
                room.delete()

        return Response({'Message': 'Success'}, status=status.HTTP_200_OK)



class UpdateRoom(APIView):

    serializer_class = UpdateRoomSerializer

    
    def patch(self, request, format=None):

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            code = serializer.validated_data.get("code")
            queryset = Room.objects.filter(code = code)
            if queryset.exists():
                room_result = queryset[0]
                if room_result.host != self.request.session.session_key:
                    return Response("Message: You are not the host of this room", status = status.HTTP_403_FORBIDDEN)
                else:
                    room_result.guest_can_pause = serializer.validated_data.get("guest_can_pause")
                    room_result.votes_to_skip = serializer.validated_data.get("votes_to_skip")
                    room_result.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                    return Response(RoomSerializer(room_result).data, status=status.HTTP_200_OK)
            else:
                return Response("Message: Room not found", status = status.HTTP_404_NOT_FOUND)
        else :
            return Response("message: invalid request data", status=status.HTTP_400_BAD_REQUEST)