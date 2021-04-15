const queue = [
  {
    id: 0,
    filename:
      '/Users/chrislung/CodesmithPTRI/react-fetch-tree/FetchTreeNPMPkg/testData/index.js',
    dependencies: ['./App'],
  },
  {
    id: 1,
    filename:
      '/Users/chrislung/CodesmithPTRI/react-fetch-tree/FetchTreeNPMPkg/testData/App.jsx',
    dependencies: ['./Nav', './Body.jsx', './Footer.jsx'],
  },
  {
    id: 2,
    filename:
      '/Users/chrislung/CodesmithPTRI/react-fetch-tree/FetchTreeNPMPkg/testData/Nav.jsx',
    dependencies: [],
  },
  {
    id: 3,
    filename:
      '/Users/chrislung/CodesmithPTRI/react-fetch-tree/FetchTreeNPMPkg/testData/Body.jsx',
    dependencies: ['./mockDataReq.js'],
  },
  {
    id: 4,
    filename:
      '/Users/chrislung/CodesmithPTRI/react-fetch-tree/FetchTreeNPMPkg/testData/Footer.jsx',
    dependencies: ['./mockDataReq.js'],
  },
  {
    id: 5,
    filename:
      '/Users/chrislung/CodesmithPTRI/react-fetch-tree/FetchTreeNPMPkg/testData/mockDataReq.js',
    dependencies: [],
  },
];

const invocationStore = {
  App: [],
  Nav: ['useEffect', undefined, undefined, undefined],
  Body: ['useEffect', undefined, undefined, 'fetch', undefined, 'testVarExp'],
  secondResult: ['testVarExp'],
  Footer: ['useEffect', 'testArrowExp', 'fetch', 'fetchResult'],
  fetchResult: [],
  testVarExp: [undefined, undefined, 'fetch', undefined],
  testFuncExp: [undefined, undefined, 'fetch', undefined],
  testArrowExp: [undefined, undefined, 'fetch', undefined],
};

const nodeStore = {
  'line: 5, column: 0': {
    reqType: 'render',
    parentName: 'Anonymous',
    fileName: 'index',
  },
  'line: 5, column: 2': {
    reqType: 'useEffect',
    parentName: 'Nav',
    fileName: 'Nav',
  },
  'line: 6, column: 4': {
    reqType: 'axios',
    parentName: 'Nav',
    fileName: 'Nav',
  },
  'line: 6, column: 2': {
    reqType: 'useEffect',
    parentName: 'Body',
    fileName: 'Body',
  },
  'line: 7, column: 4': {
    reqType: 'fetch',
    parentName: 'Body',
    fileName: 'Body',
  },
  'line: 14, column: 25': {
    reqType: 'testVarExp',
    parentName: 'Body',
    fileName: 'Body',
  },
  'line: 7, column: 2': {
    reqType: 'useEffect',
    parentName: 'Footer',
    fileName: 'Footer',
  },
  'line: 8, column: 18': {
    reqType: 'testArrowExp',
    parentName: 'Footer',
    fileName: 'Footer',
  },
  'line: 11, column: 2': {
    reqType: 'fetch',
    parentName: 'Footer',
    fileName: 'Footer',
  },
  'line: 1, column: 26': {
    reqType: 'fetch',
    parentName: 'testVarExp',
    fileName: 'mockDataReq',
  },
  'line: 10, column: 8': {
    reqType: 'fetch',
    parentName: 'testFuncExp',
    fileName: 'mockDataReq',
  },
  'line: 21, column: 9': {
    reqType: 'fetch',
    parentName: 'testArrowExp',
    fileName: 'mockDataReq',
  },
};

const componentStore = { App: {}, null: {}, Nav: {}, Body: {}, Footer: {} };

module.exports = { queue, invocationStore, componentStore, nodeStore };
