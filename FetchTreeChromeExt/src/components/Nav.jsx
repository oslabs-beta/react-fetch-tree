import React, { useState } from "react";
import logo from "../assets/Logo.jpg";
const NavBar = () => {
  const [display, setDisplay] = useState("visualization");
  const toggle = (e) => {
    e.target.value === "visualization"
      ? setDisplay("visualization")
      : setDisplay("componentStore");
  };
  return (
    <div className="nav">
      <div className="logo-box">
        <h2>React Fetch Tree</h2>
        <img src={logo} alt="logo for react fetch tree" />
      </div>
      <div className="allOptions">
        <input
          type="radio"
          name="choices"
          id="b1"
          value="component store"
          onClick={toggle}
        />
        <label htmlFor="b1">View Component Store</label>
        <input
          type="radio"
          name="choices"
          id="b2"
          value="visualization"
          onClick={toggle}
        />
        <label htmlFor="b2">View Visualization</label>
      </div>
      <div className="visualization-box">
        {display === "visualization" ? (
          <div>Visualization</div>
        ) : (
          <div>Component store</div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
