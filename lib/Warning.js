'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Warning = void 0;
class Warning {
  constructor(message) {
    // can change this to be node-specific
    console.warn(message);
  }
}
exports.Warning = Warning;
