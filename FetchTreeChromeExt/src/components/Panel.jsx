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
    e.target.value === 'Component Store' ? setDisplayStore(true) : setDisplayStore(false);
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
            style={!displayStore ? { backgroundColor: '#fdfdfd', color: '#272b4d' } : { backgroundColor: '#272b4d', color: '#fdfdfd', border: '1px solid #272b4d' }}
          >Component Store</button>
          {/* <label htmlFor="b1">View Component Store</label> */}
          <button
            name="choices"
            id="b2"
            value="View Tree"
            onClick={toggle}
            style={!displayStore ? { backgroundColor: '#272b4d', color: '#fdfdfd', border: '1px solid #272b4d' } : { backgroundColor: '#fdfdfd', color: '#272b4d' }}
          >View Tree</button>
          {/* <label htmlFor="b2">View Tree</label> */}
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
