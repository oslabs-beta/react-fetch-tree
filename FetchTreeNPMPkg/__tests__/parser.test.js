const { dependenciesGraph } = require('../parser.js');
const path = require("path");


describe('parser', () => {
  const result = dependenciesGraph(path.join(__dirname, "../testData/index.js"))

  it('Should return an object', () => {
    expect(typeof result).toBe('object');
  })
})