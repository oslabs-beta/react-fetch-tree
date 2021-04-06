import React, { useState } from "react";


const NavBar = (props) => {
  const [display, setDisplay] = useState("visualization");
  const toggle = (e) => {
    e.target.value === "visualization"
      ? setDisplay("visualization")
      : setDisplay("componentStore");
  };
  return (
    <div className="nav">
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
