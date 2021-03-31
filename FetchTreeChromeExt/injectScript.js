console.log("<----- Injected script started running ----->");
//declare object to be consumed by fiberwalker
let componentObj = {};

//send message to client side notifying that inject script has been initialized
window.postMessage(
  { type: "message", payload: "InjectScriptInitialized" },
  "*"
);

//set up listener for messages coming from client side
window.addEventListener(
  "message",
  function (event) {
    console.log("event received in injectScript", event.data);
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

    //conditional check to see if componentObj has been received from client side FetchTreeHook
    if (event.data.type && event.data.type === "componentObj") {
      console.log("componentObj received in injectScript", event.data);
      componentObj = event.data.payload;
    }
  },
  false
);

//is this necessary?
function parseEssentialDetails() {
  let main = {};

  main.performance = JSON.parse(JSON.stringify(window.performance)) || null;

  return main;
}

//fiberwalker function
const fiberwalker = (
  node,
  componentStore,
  treedata = { name: "Fiber Root", children: [] }
) => {
  const dataReqArr = [
    "fetch",
    "axios",
    "http",
    "https",
    "qwest",
    "superagent",
    "XMLHttpRequest",
  ];

  function Node(name) {
    this.name = name;
    this.children = [];
  }

  if (!node) return;

  while (node) {
    let name;
    if (node.elementType) {
      if (typeof node.elementType == "string") {
        name = node.elementType;
      } else if (node.elementType.name !== undefined) {
        name = node.elementType.name;
      } else {
        name = "anon.";
      }
    } else {
      name = "anon.";
    }
    const currentNode = { name, children: [] };
    if (componentStore !== undefined) {
      if (componentStore[name]) {
        //iterate through every entry and check request type
        const dataRequest = componentStore[name];
        for (let key in dataRequest) {
          if (dataReqArr.includes(dataRequest[key].reqType)) {
            currentNode.attributes = {
              containsFetch: `${dataRequest[key].reqType}`,
            };
          }
        }
      }
    }
    treedata.children.push(currentNode);

    if (node.child) {
      fiberwalker(
        node.child,
        componentStore,
        treedata.children[treedata.children.length - 1]
      );
    }

    node = node.sibling;
  }
  return treedata;
};

//declaring variables needed for onCommitFiberRoot function
let __ReactFiberDOM;
const devTools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
let orgChart;
//= {
//   name: "Component",
//   children: [{ name: "div", children: null }],
// };

devTools.onCommitFiberRoot = (function (original) {
  return function (...args) {
    __ReactFiberDOM = args[1];
    console.log("dom: ", __ReactFiberDOM.current);
    //console.log("componentObj in onCommitFiberRoot", componentObj);
    orgChart = fiberwalker(__ReactFiberDOM.current, componentObj);
    console.log("orgChart in onCommit FiberRoot: ", orgChart);
    window.postMessage({
      type: "orgChart",
      payload: orgChart,
    });
    return original(...args);
  };
})(devTools.onCommitFiberRoot);

//is this necessary?
setInterval(() => {
  let essential = parseEssentialDetails();
  window.postMessage({ type: "FROM_PAGE", essential });
}, 10000000);

export default orgChart;
