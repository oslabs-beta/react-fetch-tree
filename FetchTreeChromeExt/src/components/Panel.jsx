import React, { useState } from "react";
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import Viz from './treeViz';
import ComponentStorePanel from './ComponentStorePanel';

const Panel = () => {
  const [displayStore, setDisplayStore] = useState(false);
  const [componentArr, setComponentArr] = useState([['App', {}]]);

  //orgChart logic needs to be implemented here 

  const port = chrome.runtime.connect({ name: "Panel" });

  // establishes a connection between devtools and background page
  port.postMessage({
    name: "connect",
    tabId: chrome.devtools.inspectedWindow.tabId,
  });

  // Listens for posts sent in specific ports and redraws tree
  port.onMessage.addListener((message) => {
    if (message.name === 'componentObj') {
      console.log("componentObj in panel", message);
      setComponentArr(Object.entries(message.payload));
    }
    if (message.name === 'orgChart') {
      console.log("orgChart in panel", message);
      // setOrgChart(message.payload);
    }
  });

  const toggle = (e) => {
    e.target.value === 'component store' ? setDisplayStore(true) : setDisplayStore(false);
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
            value="tree"
            onClick={toggle}
            defaultChecked
          />
          <label htmlFor="b2">View Tree</label>
        </div>
      </div>
      <div id="visualization-box">
        {displayStore === false ? (
          <ParentSize>{({ width, height }) => <Viz width={width} height={height * 0.9} />}</ParentSize>
        ) : (
            <ComponentStorePanel componentArr={componentArr} />
          )}
      </div>
    </div >
  );
};

export default Panel;
