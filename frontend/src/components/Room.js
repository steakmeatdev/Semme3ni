import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Button, Typography } from "@mui/material";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

function Room({ clearRoomCode }) {
  const navigate = useNavigate();

  // Extracting roomCode from URL
  const { roomCode } = useParams();

  const getCurrentSong = async () => {
    try {
      const response = await fetch("/spotify/current-song");
      if (!response.ok) {
        throw new Error("Couldn't fetch data");
      }
      try {
        const jsonData = await response.json();
        // setting song state varibale to pass as a prop to the MusicPlaer component
        setSong(jsonData);
      } catch (error) {
        console.log("error converting music data to json");
      }
    } catch (error) {
      console.error("Fetch error:", error.message);
    }
  };

  // State variables
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [accesstoken, setAccesstoken] = useState("");
  const [song, setSong] = useState({});

  // getting the Room details using provided code in the URL
  const getRoomDetails = async () => {
    let response;
    try {
      response = await fetch(`/api/get?code=${roomCode}`);
      if (!response.ok) {
        clearRoomCode();
        navigate("/");
      } else {
        try {
          const data = await response.json();
          setVotesToSkip(data.votes_to_skip);
          setGuestCanPause(data.guest_can_pause);
          setIsHost(data.is_host);
          if (data.is_host) {
            console.log("Verifying authentication");
            authenticateSpotify();
          }
        } catch (error) {
          console.log(
            "Error converting /get?code=${roomCode} response data to JSON format ",
            error.message
          );
        }
      }
    } catch (error) {
      console.error("Error fetching /get?code=${roomCode} :", error.message);
    }
  };

  // Verify authentication:
  // If host is not authenticated, authenticate
  // If user got an expired token, it refreshes
  // If everything is alright, set the spotifyAuthenticated state variable to true

  const authenticateSpotify = async () => {
    try {
      const response = await fetch("/spotify/isauthenticated");
      try {
        const data = await response.json();
        if (data.status) {
          setSpotifyAuthenticated(true);
        } else {
          try {
            const authResponse = await fetch("/spotify/get-auth-url");
            try {
              const authData = await authResponse.json();
              try {
                window.location.replace(authData.url);
              } catch (error) {
                console.log(
                  "Couldn't open window for user to authenticate",
                  error.message
                );
              }
              setSpotifyAuthenticated(true);
            } catch (error) {
              console.log(
                "Error converting /get-auth-url response data to JSON format",
                error.message
              );
            }
          } catch (error) {
            console.log("Error fetching /get-auth-url", error.message);
          }
        }
      } catch (error) {
        console.log(
          "Error converting /isauthenticated response data to JSON format",
          error.message
        );
      }
    } catch (error) {
      console.error("Error fetching isauthenticated");
    }
  };

  // Button function to leave the room and redirecting to home page
  const leaveButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };

    fetch("/api/leave", requestOptions)
      .then((response) => {
        if (response.ok) {
          clearRoomCode();
          navigate("/");
        } else {
          console.error("Failed to leave the room.");
        }
      })
      .catch((error) => console.error("Error leaving room:", error));
  };

  // Calling getRoomDetails()
  useEffect(() => {
    getRoomDetails();
  }, []);

  // Calling getCurrentSong() each 1000 ms (= to 1 second)
  useEffect(() => {
    const interval = setInterval(getCurrentSong, 1000);

    return () => clearInterval(interval);
  }, []);

  // Updating showSettings state
  const updateShowSettings = (value) => {
    setShowSettings(value);
  };

  // Function to render Settings button (modifies state of settings)
  const renderSettingsButton = () => {
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => updateShowSettings(true)}
        >
          Settings
        </Button>
      </Grid>
    );
  };

  // Function to Render Settings page
  const renderSettings = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage
            update_={true}
            votesToSkip_={votesToSkip}
            guestCanPause_={guestCanPause}
            roomCode_={roomCode}
            updateCallback={() => {
              getRoomDetails();
            }}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => updateShowSettings(false)}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  };

  // Function to render MusicPlayer page
  const renderMusicPlayer = () => {
    return (
      <Grid>
        <Grid item xs={12} align="center">
          <MusicPlayer song_={song} />
        </Grid>
      </Grid>
    );
  };

  if (showSettings) {
    return renderSettings();
  } else {
    return (
      <Grid container spacing={1}>
        {renderMusicPlayer()}
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            Code: {roomCode}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Host: {isHost.toString()}
          </Typography>
          <Typography variant="h6" component="h6">
            Authenticated: {spotifyAuthenticated.toString()}
          </Typography>
          <Typography variant="h6" component="h6">
            Song: {song.title}
          </Typography>
        </Grid>
        {isHost ? renderSettingsButton() : null}
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={leaveButtonPressed}
          >
            Leave Room
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default Room;
