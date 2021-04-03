import React, { useState } from "react";

const NavBar = () => {
  const [display, setDisplay] = useState(true);
  const toggle = () => {
    display ? setDisplay(false) : setDisplay(true);
  };
  return (
    <div className="nav">
      <div className="allOptions">
      <button id="b1" onClick={toggle}>This button</button>
      <button id="b2" onClick={toggle}>That button</button>
      </div>
      {display ? <div>Visualization</div> : <div>Component store</div>}
    </div>
  );
};

export default NavBar;
