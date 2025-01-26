import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Button, Typography } from "@mui/material";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

function Room({ clearRoomCode }) {
  // Getting the props and useNavigate
  const { roomCode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // This is equivalent to componentDidMount
    const interval = setInterval(getCurrentSong, 1000);

    // This is equivalent to componentWillUnmount
    return () => clearInterval(interval);
  }, []);

  // State variables
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [song, setSong] = useState("");

  // Updating showSettings state
  const updateShowSettings = (value) => {
    setShowSettings(value);
  };

  // ------------------------------ FUNCTIONS -------------------------
  //////////////////////////////////////////////////////////////////////

  const getCurrentSong = async () => {
    const response = await fetch("/spotify/current-song");

    if (!response.ok) {
      return {};
    } else {
      const data = await response.json();
    }
    setSong(data);
  };

  // getting the Room details using provided code in the URL
  const getRoomDetails = async () => {
    try {
      const response = await fetch(`/api/get?code=${roomCode}`);

      // console.log("Content-Type:", response.headers.get("content-type"));

      if (!response.ok) {
        clearRoomCode();
        navigate("/");
        throw new Error("Invalid code");
      }

      const data = await response.json();

      // Update states
      setVotesToSkip(data.votes_to_skip);
      setGuestCanPause(data.guest_can_pause);
      setIsHost(data.is_host);

      // If the user is the host, authenticate with Spotify
      if (data.is_host) {
        authenticateSpotify(); // Ensure this function is defined and works properly
      }
    } catch (error) {
      console.error("Error fetching room details:", error);
    }
  };

  // Verify if user is authenticated
  const authenticateSpotify = async () => {
    try {
      const response = await fetch("/spotify/isauthenticated");

      console.log("Content-Type:", response.headers.get("content-type"));

      const data = await response.json();

      console.log(data);

      setSpotifyAuthenticated(data.status);

      if (!data.status) {
        const authResponse = await fetch("/spotify/get-auth-url");
        const authData = await authResponse.json();

        window.location.replace(authData.url);
      }
    } catch (error) {
      console.error("Error during Spotify authentication:", error);
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

  // Runing getRoomDetails as side-code since it deals with the server
  useEffect(() => {
    getRoomDetails();
  }, []);

  //////////////////////////////////////////////////////////////////////

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

  // Renderning current Room page
  if (showSettings) {
    return renderSettings();
  } else {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            Code: {roomCode}
          </Typography>
        </Grid>
        <MusicPlayer {...song} />
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Host: {isHost.toString()}
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
