import React, { Component } from "react";
import { createRoot } from "react-dom/client";

import HomePage from "./homePage";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        
    }
  }

  render() {
    return <HomePage/>;
  }
}

const appDiv = document.getElementById("app");
const root = createRoot(appDiv); 
root.render(<App message="Hello, this is a prop!" />); 
