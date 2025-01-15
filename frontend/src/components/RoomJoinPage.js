import React, { useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Link } from "react-router-dom"; // Added import"react-router-dom"; // useNavigate hook for navigation

export default function RoomJoinPage() {
  const [roomCode, setRoomCode] = useState(""); // State for room code
  const [error, setError] = useState(""); // State for error messages
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Handle changes to the text field
  const handleTextFieldChange = (e) => {
    setRoomCode(e.target.value);
  };

  // Handle button click to join the room
  const roomButtonPressed = () => {
    console.log("Room code:", roomCode);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: roomCode,
      }),
    };

    fetch("/api/join", requestOptions)
      .then((response) => response.json()) // Ensure the response is parsed as JSON
      .then((data) => {
        if (data.message === "Room joined") {
          // Navigate to the room page with the provided room code
          navigate(`/room/${roomCode}`);
        } else {
          setError(data["Bad request"] || "Room not found.");
        }
      })
      .catch((error) => {
        console.log(error);
        setError("An error occurred. Please try again.");
      });
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Join a Room
        </Typography>
      </Grid>

      <Grid item xs={12} align="center">
        <TextField
          error={error !== ""}
          label="Code"
          placeholder="Enter a Room Code"
          value={roomCode}
          helperText={error}
          variant="outlined"
          onChange={handleTextFieldChange}
        />
      </Grid>
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={roomButtonPressed}
        >
          Enter Room
        </Button>
      </Grid>
      <Grid item xs={12} align="center">
        <Button variant="contained" color="secondary" to="/" component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  );
}
