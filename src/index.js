import React, { useState, useEffect } from "react";
import ReactDOM, { render } from "react-dom";
import { fetchUser, fetchPosts } from "./fakeApi";
import { ClassTest, CreateClassTest } from "./test";
import { findNodeByComponentName, Utils } from "react-fiber-traverse";
import Tree from "react-d3-tree";
import axios from "axios";

console.log("ran");
function Fetchtree() {
  return (
    // `<Tree />` will fill width/height of its container; in this case `#treeWrapper`.
    <div id="treeWrapper" style={{ width: "80vw", height: "80vh" }}>
      <Tree data={orgChart} orientation={"vertical"} />
    </div>
  );
}

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [character, setCharacter] = useState(1);

  useEffect(() => {
    fetchUser(character).then((u) => setUser(u));
  }, [character]);

  fetch("/");
  axios.get("/");

  if (user === null) {
    return <p>Loading profile...</p>;
  }
  return (
    <div>
      <div>
        < Friends />
        < Event />
        < Favorites />
      </div>
      <h1>{user}</h1>
      <ProfileTimeline user={user} character={character} />
      <button onClick={fetchUser}>Change Character</button>
    </div>
  );
}

function ProfileTimeline(props) {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetchPosts(props.character).then((p) => setPosts(p));
  }, [props.character]);

  if (posts === null) {
    return <h2>Loading posts...</h2>;
  }
  return (
    <div>
      {posts.length === 1 ? (
        <h5>
          {props.user} has been seen on {posts.length} starship
        </h5>
      ) : (
        <h5>
          {props.user} has been seen on {posts.length} starships
        </h5>
      )}
      <ul>
        {posts.map((post, idx) => (
          <li key={idx}>{post}</li>
        ))}
      </ul>
      <ClassTest />
      <CreateClassTest />
      <Fetchtree />
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<ProfilePage />, rootElement);

let orgChart;

let __ReactFiberDOM;
const devTools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
console.log("devtools", devTools);

devTools.onCommitFiberRoot = (function (original) {
  return function (...args) {
    __ReactFiberDOM = args[1];
    console.log("dom: ", __ReactFiberDOM.current);
    orgChart = fiberwalker(__ReactFiberDOM.current, componentStore);
    console.log("orgChart: ", orgChart);
    return original(...args);
  };
})(devTools.onCommitFiberRoot);

const componentStore = {
  FetchTree: {},
  ProfilePage: {
    '{"line":25,"column":8}': { reqType: "fetch", parentName: "fetchUser" },
  },
  ProfileTimeline: {
    '{"line":36,"column":9}': { reqType: "fetch", parentName: "fetchPosts" },
  },
};

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

let result = fiberwalker({
  child: {
    child: {
      child: {
        child: {
          child: {
            child: null,
            sibling: {
              child: { child: null, sibling: null, elementType: "div" },
              sibling: {
                child: {
                  child: {
                    child: { child: null, sibling: null, elementType: "ul" },
                    sibling: null,
                    elementType: "div",
                  },
                  sibling: null,
                  elementType: "div",
                },
                sibling: null,
                elementType: { name: "ShoppingContainer" },
              },
              elementType: { name: "TabsContainer" },
            },
            elementType: { name: "Header" },
          },
          sibling: null,
          elementType: "div",
        },
        sibling: null,
        elementType: { name: "App" },
      },
      sibling: null,
      elementType: { $$typeof: "Symbol(react.provider)" },
    },
    sibling: null,
    elementType: { name: "Provider" },
  },
  sibling: null,
});



// const componentStore = {
//   ProfilePage: {
//     children: {
//       div: {
//         children: {
//           Friends: {children: { User }, siblings: Events, Favorites},
//           Events: {children: { Places }, siblings: Friends, Favorites},
//           Favorites: {children: { User, Places }, siblings: Events, Friends},
//         },
//         siblings: {h1, ProfileTimeLine, ClassTest, CreateClassTest, button},
//       },
//      h1: {children: null, siblings: null},
//      ProfileTimeLine: {children: null, siblings: null},
//      ClassTest: {children: null, siblings: null},
//      CreateClassTest: {children: null, siblings: null},
//      button: {children: null, siblings: null},
//     },
//     siblings:
//   }
// }

// <button onClick={fetch("GET", "/") {return data}}> Click ME </button>

// <JSX Identifier>name: div</JSX>
// <JSX Identifier>name: h1</JSX>

//  const componentStore = {
//   ProfilePage: {
//     children: {
//       Friends: {children: { User }},
//       Events: {children: { Places }},
//       Favorites: {children: { User, Places }},
//       ProfileTimeLine: {children: null},
//       ClassTest: {children: null},
//       CreateClassTest: {children: null},
//     }
//   },

//   NavBar: {
//     children: {
//       Friends: {children: { User }},
//       Events: {children: { Places }},
//       Favorites: {children: { User, Places }},
//     }
//   }

// 4 lines of code

// ON
