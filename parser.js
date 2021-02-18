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
  //Stores the name/value of all ImportDeclaration nodes
  const dependencies = [];
  //Function name placeholder
  let funcName = null;
  //Data node class template
  class DataRequestNode {
    constructor(dataRequestType, position, parentFunctionName) {
      this.dataRequestType = dataRequestType
      this.position =  position || null
      this.parentFunctionName = parentFunctionName || 'Anonymous'
    }
  }
  //Read file content
  const content = fs.readFileSync(filename, "utf8");
  //Parse file to convert it into an AST
  const raw_ast = babelParser.parse(content, {
    sourceType: "module",
    plugins: ["jsx"],
  });

  //Helper function to check node existence
  const nodeExistence = (nodePosition, reqName, parentName, exists = false) => {
    dataRequests.forEach(existingDataRequest => {
      if (existingDataRequest.position === nodePosition) {
        exists = true;
      }
    })
    if (!exists) {
      const dataRequest = new DataRequestNode(reqName, nodePosition, parentName);
      dataRequests.push(dataRequest);
    }
    return;
  }

  //Node types and conditionals
  const IdentifierPath = {
    CallExpression: ({node}) => {
      let reqName = node.callee.name
      if (node.callee.name === 'fetch') {
        nodeExistence(node.loc.start, reqName, funcName)
      };
    },
    MemberExpression: ({ node }) => {
      let reqName = node.object.name;
      if (node.object.name === 'axios') {
        nodeExistence(node.loc.start, reqName)
      };
      if (node.property.name === 'ajax') {
        reqName = node.property.name;
        nodeExistence(node.loc.start, reqName)
      };
      if (node.object.name === 'http') {
        nodeExistence(node.loc.start, reqName)
      };
      if (node.object.name === 'https') {
        nodeExistence(node.loc.start, reqName)
      };
      if (node.object.name === 'qwest') {
        nodeExistence(node.loc.start, reqName)
      };
      if (node.object.name === 'superagent') {
        nodeExistence(node.loc.start, reqName)
      };
    },
    NewExpression: ({ node }) => {
      let reqName = node.callee.name
      if (node.callee.name === 'XMLHttpRequest') {
        nodeExistence(node.loc.start, reqName)
      };
    },
  }

  //Traverse AST using babeltraverse to identify imported nodes
  traverse(raw_ast, {
    ImportDeclaration: ({ node }) => {
      if (node.source.value.indexOf('./') !== -1) dependencies.push(node.source.value);
    },
    Function(path) {
      if(path.node.id) {
        // console.log(path.node.id);
        funcName = path.node.id.name;
        // console.log(funcName)
      }
      path.traverse(IdentifierPath);
      funcName = null;
    },
    VariableDeclarator(path) {
      // console.log(path.parent.declarations[0].id.name)
      path.traverse(IdentifierPath);
    },
    ExpressionStatement(path) {
      path.traverse(IdentifierPath);
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
  console.log(queue[1].dataRequests)
  // console.log(queue[2].dataRequests)
  return queue;
}


console.log(dependenciesGraph('./src/index.js'));
console.log(cache);
