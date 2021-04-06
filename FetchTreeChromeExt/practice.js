const dataReqArr = [
  "fetch",
  "axios",
  "http",
  "https",
  "qwest",
  "superagent",
  "XMLHttpRequest",
];

const findRequest = (componentStore, name) => {
  let requests = [];
  let str = "";
  if (componentStore[name]) {
    //iterate through every entry and check request type
    const dataRequest = Object.values(componentStore[name]);
    //console.log("dataRequest", dataRequest);
    dataRequest.forEach((el) => {
      if (dataReqArr.includes(el.reqType)) {
        requests.push(`${el.reqType}`);
      }
    });

    while (requests.length) {
      let temp = requests.splice(0, 1);
      let number = requests.reduce((acc, cur) => {
        if (cur == temp) acc += 1;
        return acc;
      }, 1);
      requests = requests.filter((el) => el != temp);
      str += !str.length
        ? `${number} ${temp} request${number > 1 ? "s" : ""}`
        : `, ${number} ${temp} request${number > 1 ? "s" : ""}`;
    }
  }
  return str;
};

const componentStore = {
  App: {},
  Body: {
    "line: 1, column: 26": { reqType: "fetch", parentName: "testVarExp" },
  },
  Footer: {
    "line: 11, column: 2": { reqType: "fetch", parentName: "Footer" },
    "line: 21, column: 9": { reqType: "fetch", parentName: "testArrowExp" },
    "line: 212, column: 9": { reqType: "axios", parentName: "testArrowExp" },
    "line: 22, column: 9": { reqType: "axios", parentName: "testArrowExp" },
    "line: 211, column: 9": {
      reqType: "superagent",
      parentName: "testArrowExp",
    },
  },
};
console.log(findRequest(componentStore, "Footer"));
