const path = require("path");

const {
  dependenciesGraph,
  componentGraph,
  getDependencies,
  nodeExistence,
} = require("../parser.js");
const { queue } = require("./testQueue.js");

const cache = {
  "/Users/chrislung/CodesmithPTRI/react-fetch-tree/FetchTreeNPMPkg/testData/index.js": 0,
  "/Users/chrislung/CodesmithPTRI/react-fetch-tree/FetchTreeNPMPkg/testData/App.jsx": 1,
  "/Users/chrislung/CodesmithPTRI/react-fetch-tree/FetchTreeNPMPkg/testData/Nav.jsx": 2,
  "/Users/chrislung/CodesmithPTRI/react-fetch-tree/FetchTreeNPMPkg/testData/Body.jsx": 3,
  "/Users/chrislung/CodesmithPTRI/react-fetch-tree/FetchTreeNPMPkg/testData/Footer.jsx": 4,
  "/Users/chrislung/CodesmithPTRI/react-fetch-tree/FetchTreeNPMPkg/testData/mockDataReq.js": 5,
};

describe("dependenciesGraph", () => {
  const result = dependenciesGraph(
    path.join(__dirname, "../testData/index.js")
  );

  it("Should return a JSON string", () => {
    expect(typeof result).toBe("object");
  });

  it("Should return Entry file must be .js or .jsx", () => {
    expect(
      dependenciesGraph(path.join(__dirname, "../testData/style.css"))
    ).toEqual("Entry file must be .js or .jsx");
  });
});

describe("componentGraph", () => {});

describe("getDependencies", () => {});

describe("nodeExistence", () => {});
