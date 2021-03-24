const fiberwalker = require("../fiberwalker.js");


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

console.log(result.children[0].children[0].children[0].children[0])