//declare object to be consumed by fiberwalker
let componentObj = {};

//set up listener for messages coming from client side
window.addEventListener(
  "message",
  function (event) {
    //conditional check to see if componentObj has been received from client side FetchTreeHook
    if (event.data.type && event.data.type === "componentObj") {
      console.log("componentObj received in injectScript", event.data);
      componentObj = event.data.payload;
      //window.postMessage({ type: "componentObj", payload: componentObj });
    }
  },
  false
);

//is this necessary?
// function parseEssentialDetails() {
//   let main = {};

//   main.performance = JSON.parse(JSON.stringify(window.performance)) || null;

//   return main;
// }

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
      let requests = [];
      let str = "";
      if (componentStore[name]) {
        //iterate through every entry and check request type
        const dataRequest = Object.values(componentStore[name]);
        //console.log("dataRequest", dataRequest);
        dataRequest.forEach((el) => {
          if (dataReqArr.includes(el.reqType)) {
            requests.push(`${el.reqType}`);
          }
        });

        while (requests.length) {
          let temp = requests.splice(0, 1);
          let number = requests.reduce((acc, cur) => {
            if (cur == temp) acc += 1;
            return acc;
          }, 1);
          requests = requests.filter((el) => el != temp);
          str += !str.length
            ? `${number} ${temp} request${number > 1 ? "s" : ""}`
            : `, ${number} ${temp} request${number > 1 ? "s" : ""}`;
        }
      }
      currentNode.label = str;
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

console.log('devtools', devTools);

devTools.onCommitFiberRoot = (function (original) {
  return function (...args) {
    __ReactFiberDOM = args[1];
    orgChart = fiberwalker(__ReactFiberDOM.current, componentObj);
    console.log('componentObj', componentObj);
    window.postMessage({
      type: "orgChart",
      payload: orgChart,
    });
    return original(...args);
  };
})(devTools.onCommitFiberRoot);
