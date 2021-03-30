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
};

module.exports = fiberTree;

// console.log(result.children[0].children[0].children[0].children[0])