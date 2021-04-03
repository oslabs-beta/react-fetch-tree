const {
  fiberwalker,
  fiberTree,
  componentStore,
} = require("../testData/mockDataFiberWalker.js");

describe("fiberwalker", () => {

  it("Output hould return an object", () => {
    const result = fiberwalker(fiberTree, componentStore);
    expect(typeof result).toBe("object");
  });

  it("Output should return an empty object when empty objects are passed in", () => {
    expect(() => (fiberwalker({}, {}, {})).toEqual({}));
  });

  it("Output should return an error when any argument passed in is not an object", () => {
    expect(() => (fiberwalker(123, {}, {})).toThrow(TypeError));
    expect(() => (fiberwalker({}, [], {})).toThrow(TypeError));
    expect(() => (fiberwalker([], 'abc', {})).toThrow(TypeError));
    expect(() => (fiberwalker([], {}, null)).toThrow(TypeError));
  });
});
