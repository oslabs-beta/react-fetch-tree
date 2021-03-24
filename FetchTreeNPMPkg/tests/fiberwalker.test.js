const fiberwalker = require("../fiberwalker.js");

describe('fiberwalker', () => {
  const componentStore = {
    "NavBar": {
      "line: 27, column: 2":{"reqType":"fetch","parentName":null},
      "line: 52, column: 2":{"reqType":"axios","parentName":"About"},
    },
    "Body": {
      "line: 27, column: 2":{"reqType":"fetch","parentName":"Favorites"},
      "line: 52, column: 2":{"reqType":"axios","parentName":"Friends"},
    },
    "Footer": {
      "line: 27, column: 2":{"reqType":"fetch","parentName":null},
    }
  };

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
                  elementType: { name: "Recommendations" },
                },
                elementType: { name: "Favorites" },
              },
              sibling: {
                child: null,
                sibling: null,
                elementType: { name: "Footer" },
              },
              elementType: { name: "Body" },
            },
            elementType: { name: "NavBar" },
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
  }

  it('componentStore should be an object', () => {
    // const result = fiberwalker(fiberTree, []);
    expect(fiberwalker([], [])).toBeNull();
  })

  it('Should return an object', () => {
    const result = fiberwalker(fiberTree, componentStore);
    expect(typeof result).toBe('object');
  })



  // it('Should return a "containsFetch" key in Favorites with the value of "fetch"', () => {
  //   // const result = fiberwalker(fiberTree)
  //   expect(treedata.children[1].children[0].toHaveProperty('containsFetch', 'fetch'))
  // })
});

// name: App,
// children: [
//   {
//     name: NavBar,
//     children: [],
//   },
//   {
//     name: Body,
//     children: [
//       {
//         name: Favorites,
//         children: [],
//       },
//       {
//         name: Recommendations,
//         children: [],
//       },
//     ],
//   },
//   {
//     name: Footer,
//     children: [],
//   },
// ],

  // <App>
    //   <NavBar></NavBar>
    //   <Body>
    //     <Favorites></Favorites>
    //     <Recommendations></Recommendations>
    //   </Body>
    //   <Footer></Footer>
    // </App>
