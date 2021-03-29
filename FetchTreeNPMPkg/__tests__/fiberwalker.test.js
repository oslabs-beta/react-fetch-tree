const { fiberwalker, fiberTree } = require("../_testData/fiberwalkerMockData.js");

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

  it('Should return an object', () => {
    const result = fiberwalker(fiberTree, componentStore);
    expect(typeof result).toBe('object');
  })
});
