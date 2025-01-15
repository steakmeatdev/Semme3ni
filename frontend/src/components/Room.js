import React, { Component } from "react";
import { useParams } from "react-router-dom";

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
            <div>
                <h3>Room Code: {this.roomCode}</h3>
                <p>Votes: {this.state.votesToSkip}</p>
                <p>Guest can pause: {this.state.guestCanPause.toString()}</p>
                <p>Host: {this.state.isHost.toString()}</p>
            </div>
        );
    }
}

export default RoomWrapper;
