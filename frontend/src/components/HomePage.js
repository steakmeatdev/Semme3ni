import React, { useState, useEffect } from "react";
import { Grid, Button, ButtonGroup, Typography } from "@mui/material";
import {
  Link,
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import MusicPlayer from "./MusicPlayer";

function App() {
  // Room code as a state variable
  const [roomCode, setRoomCode] = useState(null);

  // Checking if user already has Room code, Runing the code only once at the beginning
  useEffect(() => {
    fetch("/api/userinroom")
      .then((response) => response.json())
      .then((data) => {
        setRoomCode(data.code);
      });
  }, []);

  // Function to clear Room code if user wants to leave room from Room page
  const clearRoomCode = () => {
    setRoomCode(null);
  };

  // Home Page Rendering
  const renderHomePage = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} align="center">
          <Typography variant="h3" compact="h3">
            Semme3ni
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
  };

  // Setting the Routes
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            roomCode ? (
              <Navigate to={`/room/${roomCode}/0`} />
            ) : (
              renderHomePage()
            )
          }
        />
        <Route path="/join" element={<RoomJoinPage />} />
        <Route path="/create" element={<CreateRoomPage />} />
        <Route
          path="/room/:roomCode/:authenticateduser"
          element={<Room clearRoomCode={clearRoomCode} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
