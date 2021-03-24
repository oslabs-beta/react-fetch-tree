console.log("<----- Injected script started running ----->");

function parseEssentialDetails() {
  let main = {};

  main.performance = JSON.parse(JSON.stringify(window.performance)) || null;

  return main;
}

//FIBERWALKER NEEDS COMPONENT STORE 
const fiberwalker = (
  node,
  componentStore,
  treedata = { name: "App", children: [] }
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
  console.log("component store", componentStore);
  if (node.child.sibling) {
    node = node.child.sibling;
    let name;
    if (typeof node.elementType == "string") {
      name = node.elementType;
    } else if (node.elementType.name) {
      name = node.elementType.name;
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

    if (node.sibling !== null) {
      node = node.sibling;
      let name;
      if (typeof node.elementType == "string") {
        name = node.elementType;
      } else if (node.elementType.name) {
        name = node.elementType.name;
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
      if (node.child != null) {
        fiberwalker(
          node,
          componentStore,
          treedata.children[treedata.children.length - 1]
        );
      }
    }

    if (node.child != null) {
      fiberwalker(
        node,
        componentStore,
        treedata.children[treedata.children.length - 1]
      );
    }
  }

  if (node.child) {
    node = node.child;
    let name;
    if (typeof node.elementType == "string") {
      name = node.elementType;
    } else if (node.elementType.name) {
      name = node.elementType.name;
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
    //iterate through every entry and check request type
    treedata.children.push(currentNode);
    if (node.child != null) {
      fiberwalker(
        node,
        componentStore,
        treedata.children[treedata.children.length - 1]
      );
    }
  }
  return treedata;
};

let __ReactFiberDOM;
const devTools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
let orgChart;
// let componentObj = {'App' : 'Hello', }
const componentObj = { "ProfileTimeline": {}, "ClassTest": {}, "TestComponent": { "line: 27, column: 2": { "reqType": "fetch", "parentName": null }, "line: 28, column: 2": { "reqType": "axios", "parentName": null }, "line: 2, column: 0": { "reqType": "fetch", "parentName": null }, "line: 26, column: 8": { "reqType": "fetch", "parentName": null }, "line: 37, column: 9": { "reqType": "fetch", "parentName": null } }, "CreateClassTest": {} }

// const orgChartCreator = () => {
devTools.onCommitFiberRoot = (function (original) {
  return function (...args) {
    __ReactFiberDOM = args[1];
    console.log("dom: ", __ReactFiberDOM.current);
    // console.log("inside onCommit", componentObj);
    //this was here previously
    // orgChart["renderTree"] = fiberwalker(
    //   __ReactFiberDOM.current,
    //   //pass in empty object instead of componentObj
    //   componentObj;
    // );
    orgChart = fiberwalker(
      __ReactFiberDOM.current,
      //pass in empty object instead of componentObj
      componentObj
    );
    console.log("orgChart: ", orgChart);

    return original(...args);
  };
})(devTools.onCommitFiberRoot);
// };

setInterval(() => {
  let essential = parseEssentialDetails();
  window.postMessage({ type: "FROM_PAGE", essential });
}, 500);
