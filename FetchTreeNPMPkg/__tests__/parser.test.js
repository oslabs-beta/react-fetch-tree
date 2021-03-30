const path = require("path");
const { node } = require("webpack");
const testPath = path.join(__dirname, "../testData/index.js");
const {
  dependenciesGraph,
  componentGraph,
  getDependencies,
  nodeExistence,
} = require("../parser.js");
const {
  queue,
  invocationStore,
  nodeStore,
  componentStore,
} = require("../testData/mockDataParser.js");

// const cache = {
//   [`${testPath}/react-fetch-tree/FetchTreeNPMPkg/testData/index.js')}`]: 0,
//   [`${testPath}/react-fetch-tree/FetchTreeNPMPkg/testData/App.jsx`]: 1,
//   [`${testPath}/react-fetch-tree/FetchTreeNPMPkg/testData/Nav.jsx`]: 2,
//   [`${testPath}/react-fetch-tree/FetchTreeNPMPkg/testData/Body.jsx`]: 3,
//   [`${testPath}/react-fetch-tree/FetchTreeNPMPkg/testData/Footer.jsx`]: 4,
//   [`${testPath}/react-fetch-tree/FetchTreeNPMPkg/testData/mockDataReq.js`]: 5,
// };

describe("dependenciesGraph", () => {
  const result = dependenciesGraph(testPath);

  it("Output should return an object", () => {
    expect(typeof result).toBe("object");
  });

  it('Output should return "Entry file must be .js or .jsx"', () => {
    expect(
      dependenciesGraph(path.join(__dirname, "../testData/style.css"))
    ).toEqual("Entry file must be .js or .jsx");
  });
});

describe("getDependencies", () => {
  const result = getDependencies(testPath);

  it("Output should return an object", () => {
    expect(typeof result).toBe("object");
  });

  it("Output should have properties id, filename, & dependencies", () => {
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("filename");
    expect(result).toHaveProperty("dependencies");
  });

  // it("argument should be a string with a valid path", () => {
  //   expect(
  //     typeof `${testPath}/react-fetch-tree/FetchTreeNPMPkg/testData/Nav.jsx`
  //   ).toBe("string");
  // });
});

describe("componentGraph", () => {
  const result = componentGraph(invocationStore, nodeStore, componentStore);
  it("Output should return an object", () => {
    expect(typeof result).toBe("object");
  });
});

// describe("nodeExistence", () => {
//   nodeExistence("position", "axios", "App", "/");
//   it("Should have variable nodePos and it should be a string", () => {
//     expect(typeof nodePos).toBe("string");
//   });
// });
