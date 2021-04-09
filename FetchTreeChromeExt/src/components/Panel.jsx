import React, { useState } from "react";


const Panel = () => {
  const [display, setDisplay] = useState("visualization");
  const toggle = (e) => {
    e.target.value === "visualization"
      ? setDisplay("visualization")
      : setDisplay("componentStore");
  };
  return (
    <div>
      <div className="panelNav">
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
      </div>
      {/* <div id="visualization-box">
        {display === "visualization" ? (
          <div>Visualization</div>
        ) : (
            <div>Component store</div>
          )}
      </div> */}
    </div >
  );
};

export default Panel;
