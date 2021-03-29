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
  const dependencies = [];
  let parentName = null;
  let reqName = null;
  class DataRequestNode {
    constructor(dataRequestType, position, parentName, fileName) {
      this.dataRequestType = dataRequestType;
      this.position = position || null;
      this.parentName = parentName || "Anonymous";
      this.fileName = fileName || null;
    }
  }

  const content = fs.readFileSync(filename, "utf8");
  const raw_ast = babelParser.parse(content, {
    sourceType: "module",
    plugins: ["jsx"],
  });

  //Helper function to check node existence
  const nodeExistence = (nodePosition, reqName, parentName, exists = false) => {
    if (parentName === null) parentName = "Anonymous";
      if (nodeStore[`line: ${nodePosition["line"]}, column: ${nodePosition["column"]}`]) {
        exists = true;
      }
        
    if (!exists) {
      nodeFileName = filename;
      nodeFileName = nodeFileName.split("/");
      nodeFileName = nodeFileName[nodeFileName.length - 1].split(".")[0];

      nodeStore[
        `line: ${nodePosition["line"]}, column: ${nodePosition["column"]}`
      ] = {
        reqType: reqName,
        parentName,
        fileName: nodeFileName,
      };
    }
    return;
  };

  //Node types and conditionals
  const IdentifierPath = {
    CallExpression: ({ node }) => {
      reqName = node.callee.name;
      if (node.callee.name) {
        nodeExistence(node.loc.start, reqName, parentName);
      }
      if (invocationStore[parentName]) {
        invocationStore[parentName].push(reqName);
      }
    },
    MemberExpression: ({ node }) => {
      reqName = node.object.name;
      if (
        reqName === "axios" ||
        reqName === "http" ||
        reqName === "https" ||
        reqName === "qwest" ||
        reqName === "superagent"
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
      if (reqName === "XMLHttpRequest") {
        nodeExistence(node.loc.start, reqName, parentName);
      }
    },
    ReturnStatement: ({ node }) => {
      if (node.argument) {
        if (
          node.argument.type === "JSXElement" ||
          (node.argument.type === "JSXFragment" &&
            parentName &&
            !componentStore.hasOwnProperty(parentName))
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
      if (node.source.value.indexOf("./") !== -1) {
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
  };
};

// Helper function to complete componentStore
const componentGraph = (invocationStore, nodeStore, componentStore) => {
  for (let node in nodeStore) {
    let { parentName, reqType, fileName } = nodeStore[node];
    if (
      reqType === "fetch" || 
      reqType === "axios" ||
      reqType === "http" ||
      reqType === "https" ||
      reqType === "qwest" ||
      reqType === "superagent" ||
      reqType === "ajax" ||
      reqType === "XMLHttpRequest"
    ) {
      if (componentStore[parentName]) {
        componentStore[parentName][node] = { reqType, parentName };
      }
      if (componentStore[fileName]) {
        componentStore[fileName][node] = { reqType, parentName: fileName };
      }
      for (let component in invocationStore) {
        invocationStore[component].forEach((dataReq) => {
          if (
            componentStore[component] &&
            invocationStore[component].includes(parentName)
          ) {
            componentStore[component][node] = { reqType, parentName };
          }
        });
      }
    }
  }
  console.log("componentStore", componentStore);
  return componentStore;
};

const dependenciesGraph = (entryFile) => {
  const extension = entryFile.match(/\.[0-9a-z]+$/i)[0];
  if (extension !== ".js" || extension !== ".jsx") return "Entry file must be .js or .jsx";
  const entry = getDependencies(entryFile);
  const queue = [entry];

  for (const asset of queue) {
    const dirname = path.dirname(asset.filename);

    asset.dependencies.forEach((relativePath) => {
      //If there is no file extension, add it
      let absolutePath = path.resolve(dirname, relativePath);
      // console.log(absolutePath)
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
    });
  }
  return componentGraph(invocationStore, nodeStore, componentStore);
};

//Please enter the path for entry file as the argument in dependenciesGraph
const resultObj = JSON.stringify(
  dependenciesGraph(path.join(__dirname, "../_testData/index.js"))
);

// const componentObj = `const componentObj = ${resultObj}
// module.exports = componentObj;`;

// fs.writeFileSync(
//   path.join(__dirname, "./componentStore.js"),
//   componentObj,
//   (err) => {
//     if (err) throw err;
//     console.log("The file has been saved");
//   }
// );

module.exports = { dependenciesGraph, componentGraph, getDependencies };
