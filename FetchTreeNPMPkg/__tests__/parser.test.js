const { dependenciesGraph } = require("../parser.js");
const path = require("path");

describe("parser", () => {
  const result = dependenciesGraph(path.join(__dirname, "../testData/index.js"))
  
  it("Should return a JSON string", () => {
    expect(typeof result).toBe('object');
  })

  it("Should return Entry file must be .js or .jsx", () => {
    expect(dependenciesGraph(path.join(__dirname, "../testData/style.css"))).toEqual("Entry file must be .js or .jsx")
  })

})