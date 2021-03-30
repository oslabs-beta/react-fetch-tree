const queue = [
  {
    id: 0,
    filename:
      "/Users/chrislung/CodesmithPTRI/react-fetch-tree/FetchTreeNPMPkg/testData/index.js",
    dependencies: ["./App"],
  },
  {
    id: 1,
    filename:
      "/Users/chrislung/CodesmithPTRI/react-fetch-tree/FetchTreeNPMPkg/testData/App.jsx",
    dependencies: ["./Nav", "./Body.jsx", "./Footer.jsx"],
  },
  {
    id: 2,
    filename:
      "/Users/chrislung/CodesmithPTRI/react-fetch-tree/FetchTreeNPMPkg/testData/Nav.jsx",
    dependencies: [],
  },
  {
    id: 3,
    filename:
      "/Users/chrislung/CodesmithPTRI/react-fetch-tree/FetchTreeNPMPkg/testData/Body.jsx",
    dependencies: ["./mockDataReq.js"],
  },
  {
    id: 4,
    filename:
      "/Users/chrislung/CodesmithPTRI/react-fetch-tree/FetchTreeNPMPkg/testData/Footer.jsx",
    dependencies: ["./mockDataReq.js"],
  },
  {
    id: 5,
    filename:
      "/Users/chrislung/CodesmithPTRI/react-fetch-tree/FetchTreeNPMPkg/testData/mockDataReq.js",
    dependencies: [],
  },
];

module.exports = { queue };
