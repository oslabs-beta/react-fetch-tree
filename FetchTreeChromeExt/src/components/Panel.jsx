import React, { useState } from "react";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import Viz from "./treeViz";
import ComponentStorePanel from "./ComponentStorePanel";

const Panel = () => {
  const [displayStore, setDisplayStore] = useState(true);
  const [componentArr, setComponentArr] = useState([["App", {}]]);

  window.addEventListener("message", (event) => {
    console.log("message received in panel");
    if (event.data) {
      if (event.data.type === "componentObj") {
        console.log(event.data.payload);
        setComponentArr(Object.entries(event.data.payload));
      }
    }
  });

  const toggle = (e) => {
    e.target.value === "component store"
      ? setDisplayStore(true)
      : setDisplayStore(false);
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
            defaultChecked
          />
          <label htmlFor="b1">View Component Store</label>
          <input
            type="radio"
            name="choices"
            id="b2"
            value="tree"
            onClick={toggle}
          />
          <label htmlFor="b2">View Tree</label>
        </div>
      </div>
      <div id="visualization-box">
        {displayStore === false ? (
          <ParentSize>
            {({ width, height }) => (
              <Viz width={width} height={height * 0.96} />
            )}
          </ParentSize>
        ) : (
          <ComponentStorePanel componentArr={componentArr} />
        )}
      </div>
    </div>
  );
};

export default Panel;
