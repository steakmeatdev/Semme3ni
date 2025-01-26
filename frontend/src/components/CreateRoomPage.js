import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormHelperText,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  Collapse,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const CreateRoomPage = ({
  update_ = false,
  votesToSkip_ = 2,
  guestCanPause_ = true,
  roomCode_ = null,
  updateCallback = () => {},
}) => {
  const [guestCanPause, setGuestCanPause] = useState(guestCanPause_);
  const [votesToSkip, setVotesToSkip] = useState(votesToSkip_);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleVotesChange = (e) => {
    setVotesToSkip(Number(e.target.value));
  };

  const handleGuestCanPauseChange = (e) => {
    setGuestCanPause(e.target.value === "true");
  };

  // Handle Create room Button pressed
  const handleRoomButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
      }),
    };

    fetch("/api/create", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.code) {
          navigate(`/room/${data.code}`);
        } else {
          console.error("Error: No room code returned");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // Handle update room Button pressed
  const handleUpdateRoomButtonPressed = () => {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
        code: roomCode_,
      }),
    };
    // Updating the Room instance in the database
    fetch("/api/update", requestOptions).then((response) => {
      if (response.ok) {
        setSuccessMessage("Room updated successfully!");
      } else {
        setErrorMessage("Error updating room");
      }
      updateCallback();
    });
  };

  // Create page Buttons
  const RenderCreateButtons = () => {
    return (
      <Grid spacing={1}>
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={handleRoomButtonPressed}
          >
            Create A Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" component={Link} to="/">
            Back to Room page
          </Button>
        </Grid>
      </Grid>
    );
  };

  // Update page Buttons
  const RenderUpdateButtons = () => {
    return (
      <Grid spacing={1}>
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={handleUpdateRoomButtonPressed}
          >
            Update A Room
          </Button>
        </Grid>
      </Grid>
    );
  };

  const title = update_ ? "Update Room" : "Create a Room";
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          <Collapse in={!!errorMessage || !!successMessage}>
            {successMessage ? (
              <Alert
                severity="success"
                onClose={() => {
                  setSuccessMessage("");
                }}
              >
                {successMessage}
                {}
              </Alert>
            ) : (
              <Alert
                severity="error"
                onClose={() => {
                  setErrorMessage("");
                }}
              >
                {errorMessage}
                {}
              </Alert>
            )}
          </Collapse>
        </Typography>
      </Grid>

      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText>
            <div align="center">Guest Control of Playback State</div>
          </FormHelperText>
          <RadioGroup
            row
            defaultValue={guestCanPause.toString()}
            onChange={handleGuestCanPauseChange}
          >
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="false"
              control={<Radio color="secondary" />}
              label="No Control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <TextField
            required
            type="number"
            onChange={handleVotesChange}
            defaultValue={votesToSkip}
            inputProps={{
              min: 1,
              style: { textAlign: "center" },
            }}
          />
          <FormHelperText>
            <div align="center">Votes Required To Skip Song</div>
          </FormHelperText>
        </FormControl>
      </Grid>
      {update_ ? RenderUpdateButtons() : RenderCreateButtons()}
    </Grid>
  );
};

export default CreateRoomPage;
