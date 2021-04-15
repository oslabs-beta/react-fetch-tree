//Declare function used to injectScript to dom
function injectScript(file_path, tag) {
  const node = document.getElementsByTagName(tag)[0];
  const script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", file_path);
  node.appendChild(script);
}

//Call function with injectScript.js as argument
injectScript(chrome.runtime.getURL("injectScript.js"), "body");

//HOW DO WE ENSURE THIS CODE IS CORRECT FOR RUNTIME.CONNECT
//Set up port for communication between background.js and contentScript
const port = chrome.runtime.connect("madfnlcllifacjhelbbhaaaachjpkpho", {
  name: "contentScript",
});
//Send test message
port.postMessage({
  name: "contentScript test",
  payload: "this is coming from contentScript",
});

let componentObj = {};

//Set up listener for messages coming from client side
window.addEventListener(
  "message",
  function (event) {
    // Only accept messages from the current tab
    if (event.source != window) return;

    // If componentObj is received through window from injectScript, pass to panel through port
    if (event.data.type === 'componentObj') {
      componentObj = event.data.payload;
      port.postMessage({ name: 'componentObj', payload: componentObj })
    }

    // If orgChart is received through window from injectScript, pass to panel through port
    if (event.data.type && event.data.type === "orgChart") {
      port.postMessage({
        name: "orgChart",
        payload: event.data.payload,
      });
    }
  },
  false
);

