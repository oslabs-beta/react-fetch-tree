const babelParser = require("@babel/parser");
const fs = require("fs");
const traverse = require("@babel/traverse").default;
const path = require("path");
let ID = 0;
const cache = {};

//Obtain  target file's dependencies 
const getDependencies = (filename) => {
  //Declare dataRequestObject
  const dataRequests = [];

  class DataRequestObject {
    constructor(dataRequestType, position, variableName) {
      this.dataRequestType = dataRequestType
      this.position =  position || null
      this.variableName = variableName || 'Anonymous'
    }
  }
  //Read file content
  const content = fs.readFileSync(filename, "utf8");

  //Parse file to convert it into an AST
  const raw_ast = babelParser.parse(content, {
    sourceType: "module",
    plugins: ["jsx"],
  });

  //Stores the name/value of all ImportDeclaration nodes
  const dependencies = [];

  //Traverse AST using babeltraverse to identify imported nodes
  traverse(raw_ast, {
    ImportDeclaration: ({ node }) => {
      if (node.source.value.indexOf('./') !== -1) dependencies.push(node.source.value);
    },
    Function(path) {
      const IdentifierPath = {
        CallExpression: ({node}) => {
          if (node.callee.name === 'fetch') {
            const dataRequest = new DataRequestObject('fetch');
            dataRequests.push(dataRequest);
          };
        },
      MemberExpression: ({ node }) => {
        if (node.object.name === 'axios') {
          let exists = false;
          dataRequests.forEach(existingDataRequest => {
            if (existingDataRequest.position === node.loc.start) {
              exists = true;
            }
          })
          if (!exists) {
            const dataRequest = new DataRequestObject('axios', node.loc.start);
            dataRequests.push(dataRequest);
          }
        };
        if (node.property.name === 'ajax') {
          const dataRequest = new DataRequestObject('ajax');
          dataRequests.push(dataRequest);
        };
        if (node.object.name === 'http') {
          const dataRequest = new DataRequestObject('http');
          dataRequests.push(dataRequest);
        };
        if (node.object.name === 'https') {
          const dataRequest = new DataRequestObject('https');
          dataRequests.push(dataRequest);
        };
        if (node.object.name === 'qwest') {
          const dataRequest = new DataRequestObject('qwest');
          dataRequests.push(dataRequest);
        };
        if (node.object.name === 'superagent') {
          const dataRequest = new DataRequestObject('superagent');
          dataRequests.push(dataRequest);
        };
      },
      NewExpression: ({ node }) => {
        if (node.callee.name === 'XMLHttpRequest') {
          const dataRequest = new DataRequestObject('XMLHttpRequest');
          dataRequests.push(dataRequest);
        };
      },
    }
        path.traverse(IdentifierPath)
    },
  
    enter(path) {
      //Check data request type

      // if (path.isIdentifier({ name: "fetch" })) {
      //   const dataRequest = new DataRequestObject('fetch');
      //   dataRequests.push(dataRequest);
      // }

    }
  })

  const id = ID++;
  cache[filename] = id;

  return {
    id,
    filename,
    dependencies,
    dataRequests
  };
};

const dependenciesGraph = (entryFile) => {
  const entry = getDependencies(entryFile);
  const queue = [entry];

  for (const asset of queue) {
    asset.mapping = {};
    const dirname = path.dirname(asset.filename);

    asset.dependencies.forEach(relativePath => {
      //If there is no file extension, add it
      let absolutePath = path.resolve(dirname, relativePath);
      let fileCheck = fs.existsSync(absolutePath)
      let child;

      if (!fileCheck) {
        absolutePath = path.resolve(dirname, relativePath + '.js'); //Test for .js
        fileCheck = fs.existsSync(absolutePath);
        if (!fileCheck) absolutePath = absolutePath + 'x'; //Test for .jsx
      }

      //Check for duplicate file paths
      if (!cache[absolutePath]) {
        child = getDependencies(absolutePath);
        queue.push(child);
      }
      asset.mapping[relativePath] = cache[absolutePath];
    })
  }
  // console.log(queue[0].dataRequests)
  // console.log(queue[1].dataRequests)
  // console.log(queue[2].dataRequests)
  return queue;
}


console.log(dependenciesGraph('./src/index.js'));
console.log(cache);