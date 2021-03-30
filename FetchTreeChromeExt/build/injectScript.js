/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*************************!*\
  !*** ./injectScript.js ***!
  \*************************/
console.log("<----- Injected script started running ----->"); //declare object to be consumed by fiberwalker

var componentObj; //send message to client side notifying that inject script has been initialized

window.postMessage({
  type: "message",
  payload: "InjectScriptInitialized"
}, "*"); //set up listener for messages coming from client side

window.addEventListener("message", function (event) {
  console.log("event received in injectScript", event.data); // only accept messages from the current tab

  if (event.source != window) return; //receiving essential info from page

  if (event.data.type && event.data.type == "FROM_PAGE" && typeof chrome.app.isInstalled !== "undefined") {
    chrome.runtime.sendMessage({
      essential: event.data.essential
    });
  } //conditional check to see if componentObj has been received from client side FetchTreeHook


  if (event.data.type && event.data.type === "componentObj") {
    console.log("componentObj received in injectScript", event.data);
    componentObj = event.data.payload;
  }
}, false); //is this necessary?

function parseEssentialDetails() {
  var main = {};
  main.performance = JSON.parse(JSON.stringify(window.performance)) || null;
  return main;
} //fiberwalker function


var fiberwalker = function fiberwalker(node, componentStore) {
  var treedata = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    name: "Fiber Root",
    children: []
  };
  var dataReqArr = ["fetch", "axios", "http", "https", "qwest", "superagent", "XMLHttpRequest"];

  function Node(name) {
    this.name = name;
    this.children = [];
  }

  if (!node) return;

  while (node) {
    var name = void 0;

    if (typeof node.elementType == "string") {
      name = node.elementType;
    } else if (node.elementType.name) {
      name = node.elementType.name;
    } else {
      name = "anon.";
    }

    var currentNode = {
      name: name,
      children: []
    };

    if (componentStore !== undefined) {
      if (componentStore[name]) {
        //iterate through every entry and check request type
        var dataRequest = componentStore[name];

        for (var key in dataRequest) {
          if (dataReqArr.includes(dataRequest[key].reqType)) {
            currentNode.attributes = {
              containsFetch: "".concat(dataRequest[key].reqType)
            };
          }
        }
      }
    }

    treedata.children.push(currentNode);

    if (node.child) {
      fiberwalker(node.child, componentStore, treedata.children[treedata.children.length - 1]);
    }

    node = node.sibling;
  }

  return treedata;
}; //declaring variables needed for onCommitFiberRoot function


var __ReactFiberDOM;

var devTools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
var orgChart = {
  name: "Component",
  children: ["div"]
};

devTools.onCommitFiberRoot = function (original) {
  return function () {
    __ReactFiberDOM = arguments.length <= 1 ? undefined : arguments[1]; //console.log("dom: ", __ReactFiberDOM.current);
    //console.log("componentObj in onCommitFiberRoot", componentObj);
    //orgChart = fiberwalker(__ReactFiberDOM.current, componentObj);

    console.log("orgChart: ", orgChart);
    window.postMessage({
      type: "orgChart",
      payload: orgChart
    });
    return original.apply(void 0, arguments);
  };
}(devTools.onCommitFiberRoot); //is this necessary?


setInterval(function () {
  var essential = parseEssentialDetails();
  window.postMessage({
    type: "FROM_PAGE",
    essential: essential
  });
}, 10000000);
/******/ })()
;
//# sourceMappingURL=injectScript.js.map