/**
 * event emitter
 */
const Emitter = require("events");
const uploadProgressEmitter = new Emitter();

module.exports = {
  uploadProgressEmitter
};
