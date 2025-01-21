import React, { Component } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Button, Typography } from "@mui/material";

function RoomWrapper(props) {
  // extracting the room code from the URL
  const params = useParams();

  const navigate = useNavigate();

  return <Room {...props} params={params} navigate={navigate} />;
}

class Room extends Component {
  constructor(props) {
    super(props);

    this.roomCode = this.props.params.roomCode;

    this.state = {
      votesToSkip: 2,
      guestCanPause: false,
      isHost: false,
    };

    this.getRoomDetails = this.getRoomDetails.bind(this);
    this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
  }

  componentDidMount() {
    this.getRoomDetails();
  }

  // Function to leave the room
  leaveButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave", requestOptions)
      .then((response) => {
        if (response.ok) {
          this.props.clearRoomCodee();
          this.props.navigate("/");
        } else {
          console.error("Failed to leave the room.");
        }
      })
      .catch((error) => console.error("Error leaving room:", error));
  }

  // Function to fetch room details
  getRoomDetails() {
    fetch("/api/get?code=" + this.roomCode)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Invalid code");
        }
        return response.json();
      })
      .then((data) => {
        this.setState({
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
        });
      })
      .catch((error) => console.error("Error fetching room details:", error));
  }

  render() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            Code: {this.roomCode}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Votes: {this.state.votesToSkip}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Guest Can Pause: {this.state.guestCanPause.toString()}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Host: {this.state.isHost.toString()}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={this.leaveButtonPressed}
          >
            Leave Room
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default RoomWrapper;
