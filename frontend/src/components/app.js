import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import HomePage from "./homePage";
import Room from "./Room"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default class App extends Component {

    constructor(props){
        super(props);
    }


  render() {
    return (
      <Router>
        <Routes>
          <Route path="" element={<HomePage />} />
          <Route path="/join" element={<RoomJoinPage />} />
          <Route path="/create" element={<CreateRoomPage />} />
          <Route path="/room/:roomCode" element={<Room />} />
        </Routes>
      </Router>
    );
  }
}
const appDiv = document.getElementById("app");
const root = createRoot(appDiv); 
root.render(<App message="Prop" />); 
