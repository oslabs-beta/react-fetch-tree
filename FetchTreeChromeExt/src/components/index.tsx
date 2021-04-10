import React from "react";
import { render } from "react-dom";
import "./sandbox-styles.css";
import Panel from "./Panel";
import TestHook from "./testHook";

render(
  <div>
    <Panel />
    <TestHook />
  </div>,
  document.getElementById("app")
);
