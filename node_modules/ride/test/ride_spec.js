
/*global expect:true*/
var expect = require('chai').expect
var ride = require('../')

function TestClass() {
  this.sequence = []
}

TestClass.prototype.run = function(a) {
  this.sequence.push(['original', a])
  return 'original'
}

var object = null

beforeEach(function() {
  object = new TestClass()
})

describe('ride', function() {

  it('should override a method', function() {
    var originalTest = object.run
    ride(object, 'run', function(original) {
      return function(a) {
        expect(original).to.equal(originalTest)
        this.sequence.push(['overridden', a])
      }
    })
    object.run(42)
    expect(object.sequence).to.deep.equal([['overridden', 42]])
  })

})

describe('ride().after', function() {

  it('should run extra behavior after original', function() {
    ride(object, 'run').after(function(a) {
      this.sequence.push(['overridden', a])
      return 'overridden'
    })
    var returnValue = object.run(42)
    expect(object.sequence).to.deep.equal([
      ['original', 42], ['overridden', 42]
    ])
    expect(returnValue).to.equal('original')
  })
  
})

describe('ride().before', function() {

  it('should run extra behavior before original', function() {
    ride(object, 'run').before(function(a) {
      this.sequence.push(['overridden', a])
      return 'overridden'
    })
    var returnValue = object.run(42)
    expect(object.sequence).to.deep.equal([
      ['overridden', 42], ['original', 42]
    ])
    expect(returnValue).to.equal('original')
  })
  
})

describe('ride().compose', function() {

  it('should compose the return value of the original function with given function', function() {
    ride(object, 'run').compose(function(x) {
      this.sequence.push(['overridden'])
      return x.toUpperCase()
    })
    var returnValue = object.run(42)
    expect(object.sequence).to.deep.equal([
      ['original', 42], ['overridden']
    ])
    expect(returnValue).to.equal('ORIGINAL')
  })
  
})

describe('ride().wrap', function() {

  it('should wrap the original function', function() {
    ride(object, 'run').wrap(function(wrapped, a) {
      this.sequence.push(['overridden', a])
      var r = wrapped()
      this.sequence.push(['overridden', a])
      return r.toUpperCase()
    })
    var returnValue = object.run(42)
    expect(object.sequence).to.deep.equal([
      ['overridden', 42], ['original', 42], ['overridden', 42]
    ])
    expect(returnValue).to.equal('ORIGINAL')
  })

})








