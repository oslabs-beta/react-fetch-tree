const fiberTree = {
  child: {
    child: {
      child: {
        child: {
          child: null,
          sibling: {
            child: {
              child: null,
              sibling: {
                child: null,
                sibling: null,
                elementType: { name: 'Recommendations' },
              },
              elementType: { name: 'Favorites' },
            },
            sibling: {
              child: null,
              sibling: null,
              elementType: { name: 'Footer' },
            },
            elementType: { name: 'Body' },
          },
          elementType: { name: 'NavBar' },
        },
        sibling: null,
        elementType: { name: 'App' },
      },
    sibling: null,
    elementType: { $$typeof: 'Symbol(react.provider)' },
    },
    sibling: null,
    elementType: { name: 'Provider' },
  },
};

const componentStore = {
  NavBar: {
    'line: 27, column: 2': { reqType: 'fetch', parentName: null },
    'line: 52, column: 2': { reqType: 'axios', parentName: 'Profile' },
  },
  Body: {
    'line: 27, column: 2': { reqType: 'fetch', parentName: 'null' },
    'line: 52, column: 2': { reqType: 'axios', parentName: 'testVarExp' },
  },
  Footer: {
    'line: 27, column: 2': { reqType: 'fetch', parentName: 'testFuncExp' },
  },
};

const fiberwalker = (
  node,
  componentStore,
  treedata = { name: 'Fiber Root', children: [] }
) => {

  const dataTypeCheck = [node, componentStore, treedata];
  if (dataTypeCheck.some(arg => Array.isArray(arg) || !arg || typeof arg !== 'object')) {
    throw new TypeError('Arguments passed in must be of an object data type');
  };

  const dataReqArr = [
    'fetch',
    'axios',
    'http',
    'https',
    'qwest',
    'superagent',
    'XMLHttpRequest',
  ];

  function Node(name) {
    this.name = name;
    this.children = [];
  }

  if (!node) return;

  while (node) {
    let name;
    if (node.elementType) {
      if (typeof node.elementType == 'string') {
        name = node.elementType;
      } else if (node.elementType.name !== undefined) {
        name = node.elementType.name;
      } else {
        name = 'anon.';
      }
    } else {
      name = 'anon.';
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

module.exports = { fiberTree, fiberwalker, componentStore };