import React from "react";
import ReactDOM from "react-dom";
import Viz from "./treeViz.js";
//import componentStore from "@reactfetchtree/rft/componentStore";

//let that = componentStore;
function ProfileTimeline() {
  return (
    <div>
      <p style={{ color: "white" }}>This element </p>
      <Viz />
    </div>
  );
}

ReactDOM.render(<ProfileTimeline />, document.getElementById("app"));
