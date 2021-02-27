const babelParser = require("@babel/parser");
const fs = require("fs");
const traverse = require("@babel/traverse").default;
const path = require("path");

let ID = 0;
const cache = {};
const invocationStore = {};
const nodeStore = {};
const componentStore = {};

//Obtain  target file's dependencies
const getDependencies = (filename) => {
  //Declare dataRequestObject
  const dataRequests = [];
  //Stores the name/value of all ImportDeclaration nodes
  const dependencies = [];
  //Function/DataRequest name placeholder
  let parentName = null;
  let reqName = null;
  //Data node class template
  class DataRequestNode {
    constructor(dataRequestType, position, parentName) {
      this.dataRequestType = dataRequestType;
      this.position = position || null;
      this.parentName = parentName || "Anonymous";
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
    dataRequests.forEach((existingDataRequest) => {
      if (existingDataRequest.position === nodePosition) {
        exists = true;
      }
    });
    if (!exists) {
      const dataRequest = new DataRequestNode(
        reqName,
        nodePosition,
        parentName
      );
      dataRequests.push(dataRequest);
      nodeStore[`line: ${nodePosition['line']}, column: ${nodePosition['column']}`] = {
        reqType: reqName,
        parentName,
      };
    }
    return;
  };

  //Node types and conditionals
  const IdentifierPath = {
    CallExpression: ({ node }) => {
      reqName = node.callee.name;
      if (node.callee.name === "fetch") {
        nodeExistence(node.loc.start, reqName, parentName);
      }
      if (invocationStore[parentName]) {
        invocationStore[parentName].push(reqName);
      }
    },
    MemberExpression: ({ node }) => {
      reqName = node.object.name;
      if (
        node.object.name === "axios" ||
        node.object.name === "http" ||
        node.object.name === "https" ||
        node.object.name === "qwest" ||
        node.object.name === "superagent"
      ) {
        nodeExistence(node.loc.start, reqName, parentName);
      }
      if (node.property.name === "ajax") {
        reqName = node.property.name;
        nodeExistence(node.loc.start, reqName, parentName);
      }
    },
    NewExpression: ({ node }) => {
      reqName = node.callee.name;
      if (node.callee.name === "XMLHttpRequest") {
        nodeExistence(node.loc.start, reqName, parentName);
      }
    },
    ReturnStatement: ({ node }) => {
      if (node.argument) {
        if (
          node.argument.type === "JSXElement" || node.argument.type === "JSXFragment" &&
          parentName &&
          !componentStore.hasOwnProperty(parentName)
        ) {
          componentStore[parentName] = {};
        }
      }
    },
    JSXExpressionContainer: ({ node }) => {
      reqName = node.expression.name;
      if (node.expression.name) {
        if (invocationStore[parentName]) {
          invocationStore[parentName].push(reqName);
        }
      }
    },
  };

  //Traverse AST using babeltraverse to identify imported nodes
  traverse(raw_ast, {
    ImportDeclaration: ({ node }) => {
      if (node.source.value.indexOf('./') !== -1) {
        if (node.specifiers.length !== 0) {
          dependencies.push(node.source.value);
        }
      }
    },
    Function(path) {
      if (path.node.id) {
        parentName = path.node.id.name;
        if (!invocationStore[parentName]) {
          invocationStore[parentName] = [];
        }
      }
      path.traverse(IdentifierPath);
      parentName = null;
    },
    VariableDeclarator(path) {
      if (path.parent.declarations[0].id.name) {
        parentName = path.parent.declarations[0].id.name;
        if (!invocationStore[parentName]) {
          invocationStore[parentName] = [];
        }
      }
      path.traverse(IdentifierPath);
      parentName = null;
    },
    ExpressionStatement(path) {
      path.traverse(IdentifierPath);
    },
    ClassDeclaration(path) {
      if (path.node.id) {
        parentName = path.node.id.name;
        if (!invocationStore[parentName]) {
          invocationStore[parentName] = [];
        }
      }
      path.traverse(IdentifierPath);
      parentName = null;
    },
  });

  const id = ID++;
  cache[filename] = id;

  return {
    id,
    filename,
    dependencies,
    dataRequests,
  };
};

// Helper function to complete componentStore
const componentGraph = (invocationStore, nodeStore, componentStore) => {
  const filterStore = {};
  // Filter out for components only in invocationStore
  for (let invocation in invocationStore) {
    if (componentStore[invocation]) {
      filterStore[invocation] = invocationStore[invocation];
    }
  }
  // console.log('FILTERED STORE => ',filterStore);
  for (let node in nodeStore) {
    let { parentName, reqType } = nodeStore[node];
    //Store raw data requests within component
    if (componentStore[parentName]) {
      componentStore[parentName][node] = { reqType, parentName };
    }
    //Check whether node gets invoked in component
    for (let component in filterStore) {
      filterStore[component].forEach((dataReq) => {
        if (dataReq === parentName) {
          componentStore[component][node] = { reqType, parentName };
        }
      });
    }
  }
  return componentStore;
};

const dependenciesGraph = (entryFile) => {
  const entry = getDependencies(entryFile);
  const queue = [entry];

  for (const asset of queue) {
    asset.mapping = {};
    const dirname = path.dirname(asset.filename);

    asset.dependencies.forEach((relativePath) => {
      //If there is no file extension, add it
      let absolutePath = path.resolve(dirname, relativePath);
      let fileCheck = fs.existsSync(absolutePath);
      let child;

      if (!fileCheck) {
        absolutePath = path.resolve(dirname, relativePath + ".js"); //Test for .js
        fileCheck = fs.existsSync(absolutePath);
        if (!fileCheck) absolutePath = absolutePath + "x"; //Test for .jsx
      }

      //Check for duplicate file paths
      if (!cache[absolutePath]) {
        child = getDependencies(absolutePath);
        queue.push(child);
      }
      asset.mapping[relativePath] = cache[absolutePath];
    });
  }
  return componentGraph(invocationStore, nodeStore, componentStore);
};

//TELL THE USER TO INPUT THEIR SOURCE FILE IN THE LINE BELOW
const resultObj = JSON.stringify(
  dependenciesGraph(path.join(__dirname, "../../../INSERT SOURCE FILE HERE"))
);
// console.log(typeof resultObj);
const componentObj = `const componentObj = ${resultObj}
module.exports = componentObj;`;

fs.writeFileSync(
  path.join(__dirname, "./componentStore.js"),
  componentObj,
  (err) => {
    if (err) throw err;
    console.log("The file has been saved");
  }
);

