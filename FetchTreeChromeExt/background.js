const connections = {};

chrome.runtime.onConnect.addListener((port) => {
  const devToolsListener = (message) => {
    console.log("messageObj", message);
    // creates a new key/value pair of current window & devtools tab when a new devtools tab is opened
    if (message.name === "connect" && message.tabId) {
      connections[message.tabId] = port;
      return;
    }
    // may not be necessary, this is an attempt to keep the port alive
    return true;
  };
  // Listens to messages sent from devtools
  port.onMessage.addListener(devToolsListener);
  port.onDisconnect.addListener(function (port) {
    port.onMessage.removeListener(devToolsListener);

    const tabIds = Object.keys(connections);
    tabIds.forEach((id) => {
      if (connections[id] === port) delete connections[id];
    });
  });
});

chrome.runtime.onMessage.addListener((message, sender) => {
  if (sender.tab) {
    let tabId = sender.tab.id;
    if (tabId in connections) {
      connections[tabId].postMessage(message);
    } else console.log("WARNING:: Tab not found in connection list");
  } else console.log("WARNING:: sender.tab not defined");
  // see this for why https://github.com/mozilla/webextension-polyfill/issues/130#issue-333539552
  return Promise.resolve("Dummy response to keep the console quiet");
});
