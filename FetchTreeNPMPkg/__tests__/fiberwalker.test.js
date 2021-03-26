const fiberwalker = require("../fiberwalker.js");
const fiberTree = require("../testData/fiberwalkerMockData.js");

describe('fiberwalker', () => {
  const componentStore = {
    "NavBar": {
      "line: 27, column: 2":{"reqType":"fetch","parentName":null},
      "line: 52, column: 2":{"reqType":"axios","parentName":"Profile"},
    },
    "Body": {
      "line: 27, column: 2":{"reqType":"fetch","parentName":"null"},
      "line: 52, column: 2":{"reqType":"axios","parentName":"testVarExp"},
    },
    "Footer": {
      "line: 27, column: 2":{"reqType":"fetch","parentName":"testFuncExp"},
    }
  };

  it('Arguments passed in should be an object', () => {
    // const result = fiberwalker(fiberTree, []);
    expect(fiberwalker([], [])).toBeNull();
  })

  it('Should return an object', () => {
    const result = fiberwalker(fiberTree, componentStore);
    expect(typeof result).toBe('object');
  })
});
