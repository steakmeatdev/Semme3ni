import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Button, Typography } from "@mui/material";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

function Room({ clearRoomCode }) {
  const navigate = useNavigate();

  // Extracting roomCode from URL
  const { roomCode } = useParams();
  const { authenticateduser } = useParams();

  //useEffect(() => {
  // This is equivalent to componentDidMount
  //const interval = setInterval(getCurrentSong, 1000);

  // This is equivalent to componentWillUnmount
  //return () => clearInterval(interval);
  // }, []);

  // State variables
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(
    stringToBoolean(authenticateduser)
  );
  const [isHost, setIsHost] = useState(false);
  const [accesstoken, setAccesstoken] = useState("");
  const [song, setSong] = useState("");

  // ------------------------------ FUNCTIONS -------------------------
  //////////////////////////////////////////////////////////////////////
  function stringToBoolean(str) {
    return str === "1";
  }
  //const getCurrentSong = async () => {
  //  const response = await fetch("/spotify///current-song");

  //  if (!response.ok) {
  //return {};
  //  } else {
  //    const data = await response.json();
  // }
  // setSong(data);
  //};

  // getting the Room details using provided code in the URL
  const getRoomDetails = async () => {
    let response;
    try {
      response = await fetch(
        `/api/get?code=${roomCode}&?isauth=${authenticateduser}`
      );
    } catch (error) {
      console.error("Error fetching room details:", error);
      clearRoomCode();
      navigate("/");
      return;
    }
    if (!response.ok) {
      clearRoomCode();
      navigate("/");
    }

    try {
      const data = await response.json();
      setVotesToSkip(data.votes_to_skip);
      setGuestCanPause(data.guest_can_pause);
      setIsHost(data.is_host);
      if (data.is_host && !spotifyAuthenticated) {
        console.log("executing authenticateSpotify");
        authenticateSpotify();
      } else {
        try {
          const info_response = await fetch("/spotify/tokenInfo");
          try {
            const userTokens = await info_response.json();
            setAccesstoken(userTokens.access_token);
          } catch (error) {
            console.log("Error converting token info to JSON (1)");
          }
        } catch (error) {
          console.log(
            "Error getting token info after verifying authentication"
          );
        }
      }
    } catch (error) {
      console.error("Error converting response data to JSON format", error);
    }
  };

  // Verify if user is authenticated with spotify
  const authenticateSpotify = async () => {
    // function verifyAuth = async () => {
    //   try {
    //     const response = await fetch("/spotify/isauthenticated");
    //     try {
    //       const data = await response.json();}
    //     } catch(error){console.log("")}

    try {
      const response = await fetch("/spotify/isauthenticated");
      try {
        const data = await response.json();
        if (data.status) {
          try {
            setSpotifyAuthenticated(true);
            const info_response = await fetch("/spotify/tokenInfo");
            try {
              const userTokens = await info_response.json();
              setAccesstoken(userTokens.access_token);
            } catch (error) {
              console.log("Error converting token info to JSON (1)");
            }
          } catch (error) {
            console.log(
              "Error getting token info after isauthenticated has succeeded"
            );
          }
        } else {
          try {
            const authResponse = await fetch("/spotify/get-auth-url");
            try {
              const authData = await authResponse.json();
              window.location.replace(authData.url);
              setSpotifyAuthenticated(true);
              try {
                const info_response = await fetch("/spotify/tokenInfo");
                try {
                  const userTokens = await info_response.json();
                  setAccesstoken(userTokens.access_token);
                } catch (error) {
                  console.log("Error converting token info to JSON (2)");
                }
              } catch (error) {
                console.log(
                  "Error getting token info after get-auth-url has succeeded"
                );
              }
            } catch (error) {
              console.log(
                "Error converting get-auth-url response data to JSON format"
              );
            }
          } catch (error) {
            console.log("Error fetching get-auth-url");
          }
        }
      } catch (error) {
        console.log(
          "Error converting isauthenticated response data to JSON format"
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

  //////////////////////////////////////////////////////////////////////
  useEffect(() => {
    getRoomDetails();
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

        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Host: {isHost.toString()}
          </Typography>
          <Typography variant="h6" component="h6">
            Authenticated: {spotifyAuthenticated.toString()}
          </Typography>
          <Typography variant="h6" component="h6">
            AccessToken: {accesstoken}
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
