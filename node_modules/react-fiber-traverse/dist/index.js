"use strict";

if (process.env.NODE_ENV === "production") {
  module.exports = require("./react-fiber-traverse.cjs.production.js");
} else {
  module.exports = require("./react-fiber-traverse.cjs.development.js");
}
