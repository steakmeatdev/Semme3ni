import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import App from "./homePage";

export default class Apps extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="center">
        <App />
      </div>
    );
  }
}
const appDiv = document.getElementById("app");
const root = createRoot(appDiv);
root.render(<Apps message="Prop" />);
