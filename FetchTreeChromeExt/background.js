const connections = {};

//Handle port logic for connections between contentScript and devtools panel 
chrome.runtime.onConnect.addListener((port) => {
  //Assign the listener function to a variable so we can remove it later
  const devToolsListener = (message, sender, sendResponse) => {
    //Create a new key/value pair of current window & devtools tab when a new devtools tab is opened
    if (message.name === 'connect' && message.tabId) {
      if (!connections[message.tabId]) {
        connections[message.tabId] = port;
      }
      return;
    }
    if (message.name === 'orgChart') {
      const portID = sender.sender.tab.id;
      //Check to see if port is part of current connections object, if yes pass message through port
      if (connections[portID]) {
        connections[portID].postMessage({
          name: message.name,
          payload: message.payload,
        });
      }
    }

    if (message.name === 'componentObj') {
      const portID = sender.sender.tab.id;
      //Check to see if port is part of current connections object, if yes pass message through port
      if (connections[portID]) {
        connections[portID].postMessage({
          name: message.name,
          payload: message.payload,
        });
      }
    }
    return true;
  };

  //Establish port with content script 
  if (port.name === 'contentScript') port.onMessage.addListener(devToolsListener);

  //Establish port with devtools panel
  if (port.name === 'Panel') port.onMessage.addListener(devToolsListener);

  port.onDisconnect.addListener((portObj) => {
    //Remove listener
    portObj.onMessage.removeListener(devToolsListener);

    //Remove this connection instance from list of connections
    const tabIds = Object.keys(connections);
    tabIds.forEach((id) => {
      if (connections[id] === portObj) delete connections[id];
    });
  });
});

