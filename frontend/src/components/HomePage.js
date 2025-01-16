import React, { Component } from "react";
import { Grid, Button, ButtonGroup, Typography } from "@mui/material";
import { Link } from "react-router-dom";


import { createRoot } from "react-dom/client";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    renderHomePage() {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Typography variant="h3" compact="h3">
                        House Party
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        <Button color="primary" to="/join" component={Link}>
                            Join a Room
                        </Button>
                        <Button color="secondary" to="/create" component={Link}>
                            Create a Room
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        );
    }

    render() {
      return (
        <Router>
          <Routes>
            <Route path="" element={this.renderHomePage()} />
            <Route path="/join" element={<RoomJoinPage />} />
            <Route path="/create" element={<CreateRoomPage />} />
            <Route path="/room/:roomCode" element={<Room />} />
          </Routes>
        </Router>
      );
    }
}
