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
    e.target.value === "Component Store"
      ? setDisplayStore(true)
      : setDisplayStore(false);
  };

  return (
    <div>
      <div className="panelNav">
        <div className="allOptions">
          <button
            name="choices"
            id="b1"
            value="Component Store"
            onClick={toggle}
            style={
              !displayStore
                ? { backgroundColor: "#fdfdfd", color: "#272b4d" }
                : {
                    backgroundColor: "#272b4d",
                    color: "#fdfdfd",
                    border: "1px solid #272b4d",
                  }
            }
          >
            Component Store
          </button>
          {/* <label htmlFor="b1">View Component Store</label> */}
          <button
            name="choices"
            id="b2"
            value="View Tree"
            onClick={toggle}
            style={
              !displayStore
                ? {
                    backgroundColor: "#272b4d",
                    color: "#fdfdfd",
                    border: "1px solid #272b4d",
                  }
                : { backgroundColor: "#fdfdfd", color: "#272b4d" }
            }
          >
            View Tree
          </button>
          {/* <label htmlFor="b2">View Tree</label> */}
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
