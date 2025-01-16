import React, { Component } from "react";
import { useParams } from "react-router-dom";
import { Grid, Button, ButtonGroup, Typography } from "@mui/material";

// Wrapper to send params into the class component
function RoomWrapper(props) {
    const params = useParams();
    return <Room {...props} params={params} />;
}

class Room extends Component {
    constructor(props) {
        super(props);

        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
        };

        this.roomCode = this.props.params.roomCode; // Access roomCode from params
        
        // Allowing "this"
        this.getRoomDetails = this.getRoomDetails.bind(this); 
    }

    componentDidMount() {
        this.getRoomDetails();          
    }

    // Getting room details from database
    getRoomDetails() {
        fetch("/api/get?code=" + this.roomCode)
            .then((response) => response.json())
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
            // <div>
            //     <h3>Room Code: {this.roomCode}</h3>
            //     <p>Votes: {this.state.votesToSkip}</p>
            //     <p>Guest can pause: {this.state.guestCanPause.toString()}</p>
            //     <p>Host: {this.state.isHost.toString()}</p>
            // </div>
        );
    }
}

export default RoomWrapper;
