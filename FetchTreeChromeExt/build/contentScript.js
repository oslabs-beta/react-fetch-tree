/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**************************!*\
  !*** ./contentScript.js ***!
  \**************************/
console.log("<----- Content script started running ----->"); //declare function used to injectScript to dom

function injectScript(file_path, tag) {
  var node = document.getElementsByTagName(tag)[0];
  var script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", file_path);
  node.appendChild(script);
} //call function with injectScript.js as argument


injectScript(chrome.runtime.getURL("injectScript.js"), "body"); //set up port for communication between background.js and contentscript

<<<<<<< HEAD
var port = chrome.runtime.connect("ohalcbgpbdnbaejhiaemlhdpjlidkjom", {
=======
var port = chrome.runtime.connect("clpdflcelpcimgnoilbniccopcnnheni", { //Update string for development mode
>>>>>>> b35a85831e74bac9fe872089897b38140bc54697
  name: "contentScript"
});
port.postMessage({
  name: "contentScript test",
  payload: "this is coming from contentScript"
}); //send message to client side notifying that content script has been initialized

window.postMessage({
  type: "message",
  payload: "ContentScriptInitialized"
}, "*"); //set up listener for messages coming from client side

window.addEventListener("message", function (event) {
  console.log("event received in contentScript", event.data); // only accept messages from the current tab

  if (event.source != window) return; //receiving essential info from page

  if (event.data.type && event.data.type == "FROM_PAGE" && typeof chrome.app.isInstalled !== "undefined") {
    chrome.runtime.sendMessage({
      essential: event.data.essential
    });
  }

  if (event.data.type && event.data.type === "orgChart") {
    port.postMessage({
      name: "orgChart",
      payload: event.data.payload
    });
  }
}, //check to see why this is set to false
false);
/******/ })()
;
//# sourceMappingURL=contentScript.js.map