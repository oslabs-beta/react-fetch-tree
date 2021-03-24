console.log("<----- Extension script started running ----->");

const connections = {};

chrome.runtime.onConnect.addListener((port) => {
  // assign the listener function to a variable so we can remove it later
  const devToolsListener = (message, sender, sendResponse) => {

    // creates a new key/value pair of current window & devtools tab when a new devtools tab is opened
    if (message.name === 'connect' && message.tabId) {
      connections[message.tabId] = port;
      return;
    }
    // may not be necessary, this is an attempt to keep the port alive
    return true;
  };

  if (port.name === 'React Fetch Tree') port.onMessage.addListener(devToolsListener);
  console.log("connections in background.js", connections);
});


chrome.runtime.onMessage.addListener(function (req, sender) {
  if (sender.tab) {
    let tabId = sender.tab.id;
    if (tabId in connections) {
      connections[tabId].postMessage(req);
    } else console.log('WARNING:: Tab not found in connection list');
  } else console.log('WARNING:: sender.tab not defined');
  // see this for why https://github.com/mozilla/webextension-polyfill/issues/130#issue-333539552
  return Promise.resolve('Dummy response to keep the console quiet');
});

// window.perfWatch = {};

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   window.perfWatch[sender.tab.id] = message.essential || null;
//   console.log("in listener");
// });

// window.addEventListener("DOMContentLoaded", () => {
//   let bg = chrome.extension.getBackgroundPage();

//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     let currentTabId = tabs[0].id;
//     let currentPerf = bg.perfWatch[currentTabId];

//     // safety check: when page is still loading
//     if (!currentPerf) {
//       return;
//     }
//   });
// });
