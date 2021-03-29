const { dependenciesGraph } = require("../parser.js");
const path = require("path");

describe("parser", () => {
  const result = dependenciesGraph(path.join(__dirname, "../_testData/index.js"))
  
  it("Should return a JSON string", () => {
    expect(typeof result).toBe('string');
  })

  it("Should return Entry file must be .js or .jsx", () => {
    expect(dependenciesGraph(path.join(__dirname, "../_testData/style.css"))).toEqual("Entry file must be .js or .jsx")
  })

})