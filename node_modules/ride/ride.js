
/**
 * @module ride
 */

var decorators = { }
var call = Function.prototype.call
var owns = call.bind(Object.prototype.hasOwnProperty)

/**
 * Overrides a method named `methodName` on the `object` with the result from
 * calling the `callback` function with the original method.
 *
 * @alias module:ride
 * @param {object} object - The object with the method that you want to override.
 * @param {string} methodName - The name of the method to override.
 * @param {module:ride~callback} [callback] - The callback function.
 * @returns {undefined|Riders}
 *  <ul>
 *    <li>If the `callback` is specified, then returns `undefined`.
 *    <li>Otherwise, returns an object that can be used to override that method.
 *  </ul>
 */
function ride(object, methodName, callback) {
  if (callback) {
    object[methodName] = callback(object[methodName])
  } else {
    return riders(object, methodName)
  }
}

/**
 * @callback module:ride~callback
 * @param {function} originalFunction - The original function.
 * @returns {function} The function to replace the original function.
 */

/**
 * Registers a decorator function.
 */
ride.register = function(plugins) {
  for (var name in plugins) {
    if (owns(plugins, name)) {
      ride[name] = decorators[name] = plugins[name]
    }
  }
}

/**
 * @constructor
 */
function Riders() {
}

ride.register(
  {
    after:   after,
    before:  before,
    compose: compose,
    wrap:    wrap
  }
)


/**
 * Calls the `extraBehavior` after the `original` function has been called.
 * @memberof module:ride
 * @example
 * ride(test, 'saveResults', ride.after(savePlan))
 * @example
 * ride(test, 'saveResults').after(savePlan)
 */
function after(extraBehavior) {
  return function(original) {
    return function() {
      var returnValue = original.apply(this, arguments)
      extraBehavior.apply(this, arguments)
      return returnValue
    }
  }
}

/**
 * Calls the `extraBehavior` before the `original` function will be called.
 * @memberof module:ride
 * @example
 * ride(test, 'exit', ride.before(captureScreenshot))
 * @example
 * ride(test, 'exit').before(captureScreenshot)
 */
function before(extraBehavior) {
  return function(original) {
    return function() {
      extraBehavior.apply(this, arguments)
      return original.apply(this, arguments)
    }
  }
}

/**
 * Calls the `extraBehavior` with the result of calling the `original` function.
 * @memberof module:ride
 * @example
 * ride(test, 'getName', ride.compose(function(name) { return name.toUpperCase() }))
 * @example
 * ride(test, 'getName').compose(function(name) { return name.toUpperCase() })
 */
function compose(extraBehavior) {
  return function(original) {
    return function() {
      return extraBehavior.call(this, original.apply(this, arguments))
    }
  }
}

/**
 * Calls the `wrapper`, passing a function that calls the original function.
 * @memberof module:ride
 * @example
 * ride(test, 'deletePost').wrap(function(wrapped, postId) {
 *   if (this.user.owns(postId)) {
 *     wrapped()
 *   } else {
 *     throw new Error('No, you can\'t do that!')
 *   }
 * })
 */
function wrap(wrapper) {
  return function(original) {
    return function() {
      var context = this, args = Array.prototype.slice.call(arguments)
      var wrapped = function() { return original.apply(context, args) }
      return wrapper.apply(this, [wrapped].concat(args))
    }
  }
}


function riders(object, methodName) {
  var result = new Riders()
  for (var name in decorators) {
    if (owns(decorators, name)) {
      result[name] = rider(object, methodName, decorators[name])
    }
  }
  return result
}

function rider(object, methodName, decorator) {
  return function() {
    ride(object, methodName, decorator.apply(this, arguments))
    return this
  }
}

module.exports = ride

