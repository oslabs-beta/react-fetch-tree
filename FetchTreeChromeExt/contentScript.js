console.log("<----- Content script started running ----->");

function injectScript(file_path, tag) {
  const node = document.getElementsByTagName(tag)[0];
  const script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", file_path);
  node.appendChild(script);
}

injectScript(chrome.runtime.getURL("injectScript.js"), "body");

window.addEventListener(
  "message",
  function (event) {
    // only accept messages from the current tab
    if (event.source != window) return;

    if (
      event.data.type &&
      event.data.type == "FROM_PAGE" &&
      typeof chrome.app.isInstalled !== "undefined"
    ) {
      chrome.runtime.sendMessage({ essential: event.data.essential });
    }
  },
  false
);
