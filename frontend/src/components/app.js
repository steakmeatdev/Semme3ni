import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import HomePage from "./homePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default class App extends Component {
  render() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/join" element={<RoomJoinPage />} />
          <Route path="/create" element={<CreateRoomPage />} />
        </Routes>
      </Router>
    );
  }
}
const appDiv = document.getElementById("app");
const root = createRoot(appDiv); 
root.render(<App message="Hello, this is a prop!" />); 
