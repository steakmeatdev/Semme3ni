import React, { Component } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useParams, useNavigate, Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";

function RoomWrapper(props) {
  const params = useParams();
  const navigate = useNavigate();

  return <RoomJoin {...props} params={params} navigate={navigate} />;
}

class RoomJoin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      roomCode: "",
      error: "",
    };

    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.roomButtonPressed = this.roomButtonPressed.bind(this);
  }

  handleTextFieldChange(e) {
    this.setState({ roomCode: e.target.value });
  }

  roomButtonPressed() {
    console.log("Room code:", this.state.roomCode);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: this.state.roomCode,
      }),
    };
    fetch("/api/join", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Room joined") {
          this.props.navigate(`/room/${this.state.roomCode}`);
        } else {
          this.setState({
            error: data["Bad request"] || "Room not found.",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({ error: "An error occurred. Please try again." });
      });
  }

  render() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            Join a Room
          </Typography>
        </Grid>

        <Grid item xs={12} align="center">
          <TextField
            error={this.state.error !== ""}
            label="Code"
            placeholder="Enter a Room Code"
            value={this.state.roomCode}
            helperText={this.state.error}
            variant="outlined"
            onChange={this.handleTextFieldChange}
          />
        </Grid>

        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="primary"
            onClick={this.roomButtonPressed}
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
}

export default RoomWrapper;
