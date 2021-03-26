console.log("<----- Content script started running ----->");

//declare function used to injectScript to dom 
function injectScript(file_path, tag) {
  const node = document.getElementsByTagName(tag)[0];
  const script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", file_path);
  node.appendChild(script);
}

//call function with injectScript.js as argument
injectScript(chrome.runtime.getURL("injectScript.js"), "body");

//send message to client side notifying that content script has been initialized
window.postMessage({ type: 'message', payload: "ContentScriptInitialized" }, '*');

//set up listener for messages coming from client side
window.addEventListener(
  "message",
  function (event) {
    console.log('event received in contentScript', event.data);
    // only accept messages from the current tab
    if (event.source != window) return;

    //receiving essential info from page
    if (
      event.data.type &&
      event.data.type == "FROM_PAGE" &&
      typeof chrome.app.isInstalled !== "undefined"
    ) {
      chrome.runtime.sendMessage({ essential: event.data.essential });
    }
  },
  //check to see why this is set to false
  false
);
