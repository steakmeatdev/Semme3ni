import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Button, Typography } from "@mui/material";
import CreateRoomPage from "./CreateRoomPage";

function Room({ clearRoomCode }) {
  // Getting the props and useNavigate
  const { roomCode } = useParams();
  const navigate = useNavigate();

  // State variables
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isHost, setIsHost] = useState(false);

  // Updating showSettings state
  const updateShowSettings = (value) => {
    setShowSettings(value);
  };

  // getting the Room details using provided code in the URL
  const getRoomDetails = () => {
    fetch(`/api/get?code=${roomCode}`)
      .then((response) => {
        if (!response.ok) {
          clearRoomCode();
          navigate("/");
          throw new Error("Invalid code");
        }
        return response.json();
      })
      .then((data) => {
        setVotesToSkip(data.votes_to_skip);
        setGuestCanPause(data.guest_can_pause);
        setIsHost(data.is_host);
      })
      .catch((error) => console.error("Error fetching room details:", error));
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

  // Rendering Settings button:
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

  // Rendering Settings page
  const renderSettings = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage
            update_={true}
            votesToSkip_={votesToSkip}
            guestCanPause_={guestCanPause}
            roomCode_={roomCode}
            updateCallback={() => {}}
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
  }
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Code: {roomCode}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Votes: {votesToSkip}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Guest Can Pause: {guestCanPause.toString()}
        </Typography>
      </Grid>
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

export default Room;
