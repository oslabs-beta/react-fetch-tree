const path = require("path");
const { node } = require("webpack");
const testPath = path.join(__dirname, "../testData/index.js");
const {
  dependenciesGraph,
  componentGraph,
  getDependencies,
} = require("../parser.js");
const {
  invocationStore,
  nodeStore,
  componentStore,
} = require("../testData/mockDataParser.js");

describe("dependenciesGraph", () => {
  const result = dependenciesGraph(testPath);

  it("Output should return an error if empty string", () => {
    expect(() => {dependenciesGraph('')}).toThrow(TypeError);
  });

  it("Output should return an object", () => {
    expect(typeof result).toBe("object");
  });

  it('Output should return an error if file extension is not .jsx or .jsx', () => {
    expect(() => {dependenciesGraph(__dirname, "../testData/style.css")}).toThrow();
  });
});

describe("getDependencies", () => {
  const result = getDependencies(testPath);

  it("Output should return an object", () => {
    expect(typeof result).toBe("object");
  });

  it("Output should return an object with properties", () => {
    expect(Object.keys(result).length).not.toEqual(0);
  });

  it("Output should return an error if empty string", () => {
    expect(() => {getDependencies('')}).toThrow();
  });
});

describe("componentGraph", () => {
  const result = componentGraph(invocationStore, nodeStore, componentStore);
  it("Output should return an object", () => {
    expect(typeof result).toBe("object");
  });

  it("Output should return an empty object when empty objects are passed in", () => {
    expect(() => (componentGraph({}, {}, {})).toEqual({}));
  });

  it("Output should return an error when any argument passed in is not an object", () => {
    expect(() => (componentGraph(123, {}, {})).toThrow(TypeError));
    expect(() => (componentGraph({}, [], {})).toThrow(TypeError));
    expect(() => (componentGraph([], 'abc', {})).toThrow(TypeError));
    expect(() => (componentGraph([], {}, null)).toThrow(TypeError));
  });

});