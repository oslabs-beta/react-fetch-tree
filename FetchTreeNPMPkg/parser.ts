const babelParser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const fs = require("fs");
const path = require("path");

let ID: number = 0;

type CacheStore = { [key: string]: number } | {};
type InvocationStore = { [key: string]:  [] | string[] } | {};
type NodeStore = { [key: string]:  {reqType: string, parentName: string, filename: string } } | {};
type ComponentStore = { [key: string]:  {reqType: string, parentName: string } } | {};

const [cache, invocationStore, nodeStore, componentStore]: [CacheStore, InvocationStore, NodeStore, ComponentStore] = [{}, {}, {}, {}];

//Helper function to check node existence
const nodeExistence = (
  nodePosition: string,
  reqType: string,
  parentName: string,
  filename: string,
  exists: boolean = false
) => {
  let nodePos: string = `line: ${nodePosition["line"]}, column: ${nodePosition["column"]}`;
  if (parentName === null) parentName = "Anonymous";
  if (nodeStore[nodePos]) exists = true;
  if (!exists) {
    let nodeFileName: string[] | string = filename.split("/");
    nodeFileName = nodeFileName[nodeFileName.length - 1].split(".")[0];
    nodeStore[nodePos] = {
      reqType,
      parentName,
      fileName: nodeFileName,
    };
  }
  return;
};

//Obtain  target file's dependencies
const getDependencies = (filename: string) => {
  const dependencies: string[] = [];
  let [reqType, parentName]: [string | null, string | null] = [null, null];
  let parserConfig: {sourceType: string, plugins: string[]} = {
    sourceType: "module",
    plugins: ["jsx"],
  } 

  const content: string = fs.readFileSync(filename, "utf8");
  const raw_ast: {} = babelParser.parse(content, parserConfig);

  //Node types and conditionals
  const IdentifierPath = {
    CallExpression: ({ node }) => {
      reqType = node.callee.name;
      if (node.callee.name) {
        nodeExistence(node.loc.start, reqType, parentName, filename);
      }[]
      if (invocationStore[parentName]) {
        invocationStore[parentName].push(reqType);
      }
    },
    MemberExpression: ({ node }) => {
      reqType = node.object.name;
      if (
        reqType === "axios" ||
        reqType === "http" ||
        reqType === "https" ||
        reqType === "qwest" ||
        reqType === "superagent"
      ) {
        nodeExistence(node.loc.start, reqType, parentName, filename);
      }
      if (node.property.name === "ajax") {
        reqType = node.property.name;
        nodeExistence(node.loc.start, reqType, parentName, filename);
      }
    },
    NewExpression: ({ node }) => {
      reqType = node.callee.name;
      if (reqType === "XMLHttpRequest") {
        nodeExistence(node.loc.start, reqType, parentName, filename);
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
      reqType = node.expression.name;
      if (node.expression.name) {
        if (invocationStore[parentName]) {
          invocationStore[parentName].push(reqType);
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

  const id: number = ID++;
  cache[filename] = id;

  return {
    id,
    filename,
    dependencies,
  };
};

// Helper function to complete componentStore
const componentGraph = (invocationStore: {}, nodeStore: {}, componentStore: {}) => {
  const dataTypeCheck: {}[] = [invocationStore, nodeStore, componentStore];
  if (dataTypeCheck.some(arg => Array.isArray(arg) || !arg || typeof arg !== "object")) {
    throw new TypeError("Arguments passed in must be of an object data type");
  };
  
  for (let node in nodeStore) {
    let { parentName, reqType, fileName }: { parentName: string, reqType: string, fileName: string } = nodeStore[node];
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

const dependenciesGraph = (entryFile: string) => {
  const extension: string = entryFile.match(/\.[0-9a-z]+$/i)[0];

  if (extension === ".js" || extension === ".jsx") {
    const entry: { id: number; filename: any; dependencies: any[]; } = getDependencies(entryFile);
    const queue: {
      id: number;
      filename: any;
      dependencies: any[];
    }[] = [entry];

    for (const asset of queue) {
      const dirname = path.dirname(asset.filename);

      asset.dependencies.forEach((relativePath) => {
        let absolutePath = path.resolve(dirname, relativePath);
        let fileCheck = fs.existsSync(absolutePath);
        let child;

        if (!fileCheck) {
          absolutePath = path.resolve(dirname, relativePath + ".js");
          fileCheck = fs.existsSync(absolutePath);
          if (!fileCheck) absolutePath = absolutePath + "x";
        }

        if (!cache[absolutePath]) {
          child = getDependencies(absolutePath);
          queue.push(child);
        }
      });
    }
    return componentGraph(invocationStore, nodeStore, componentStore);
  } else {
    throw new Error("Entry file must be .js or .jsx")
  }
};

/*
Please enter the path for entry file as the argument in dependenciesGraph. 
Must be a .js/.jsx file or parser will not run.
*/
const resultObj: string = JSON.stringify(
  dependenciesGraph(path.join(__dirname, "./testData/index.js"))
);

// const componentObj: string = `const componentObj = ${resultObj}
// module.exports = componentObj;`;

// fs.writeFileSync(
//   path.join(__dirname, "./componentStore.js"),
//   componentObj,
//   (err) => {
//     if (err) throw err;
//     console.log("The file has been saved");
//   }
// );

module.exports = {
  dependenciesGraph,
  componentGraph,
  getDependencies,
  nodeExistence,
};
