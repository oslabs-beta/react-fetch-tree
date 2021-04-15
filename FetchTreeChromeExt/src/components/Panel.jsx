import React, { useState } from 'react';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import Viz from './treeViz';
import ComponentStorePanel from './ComponentStorePanel';

const Panel = () => {
  //Set default state for panel
  const [displayStore, setDisplayStore] = useState(true);
  const [componentArr, setComponentArr] = useState([['App', {}]]);
  const [orgChart, setOrgChart] = useState({ name: 'Fiber Root' });
  //Set flag for receiving componentObj from port
  let componentObjReceived = false;

  //Create a port and establish a connection between panel and background.js
  const port = chrome.runtime.connect({ name: 'Panel' });
  port.postMessage({
    name: 'connect',
    tabId: chrome.devtools.inspectedWindow.tabId,
  });

  //Listen for messages sent in the port and set state for components
  port.onMessage.addListener((message) => {
    if (message.name === 'componentObj') {
      if (!componentObjReceived) {
        setComponentArr(Object.entries(message.payload));
        componentObjReceived = true;
      }
    }
    if (message.name === 'orgChart') {
      setOrgChart(message.payload);
    }
  });

  //Toggle function to change views in panel
  const toggle = (e) => {
    e.target.value === 'Component Store'
      ? setDisplayStore(true)
      : setDisplayStore(false);
  };

  return (
    <div>
      <div className='panelNav'>
        <div className='allOptions'>
          <button
            name='choices'
            id='b1'
            value='Component Store'
            onClick={toggle}
            style={
              !displayStore
                ? { backgroundColor: '#fdfdfd', color: '#272b4d' }
                : {
                    backgroundColor: '#272b4d',
                    color: '#fdfdfd',
                    border: '1px solid #272b4d',
                  }
            }
          >
            Component Store
          </button>
          <button
            name='choices'
            id='b2'
            value='View Tree'
            onClick={toggle}
            style={
              !displayStore
                ? {
                    backgroundColor: '#272b4d',
                    color: '#fdfdfd',
                    border: '1px solid #272b4d',
                  }
                : { backgroundColor: '#fdfdfd', color: '#272b4d' }
            }
          >
            View Tree
          </button>
        </div>
      </div>
      <div id='visualization-box'>
        {displayStore === false ? (
          <ParentSize>
            {({ width, height }) => (
              <Viz width={width} height={height * 0.96} orgChart={orgChart} />
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
