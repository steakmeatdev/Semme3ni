import React, { Component } from "react";
import { createRoot } from "react-dom/client"; // Use createRoot from react-dom/client

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <h1>Testing</h1>;
  }
}

const appDiv = document.getElementById("app");
const root = createRoot(appDiv); // Create a root
root.render(<App />); // Render the App component
