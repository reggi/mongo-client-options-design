'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.CoerceLib = void 0;

/**
 * This is an abstract class that guarantees that additions made
 * to a Coerce lib, should be the same in the other. It can also be used
 * to house methods that both classes can use like incorrectType and validateKeys
 */

class CoerceLib {
  incorrectType(key, value, type) {
    this.warn(
      `"${key}" with the value of \`${JSON.stringify(value)}\` is not of correct type "${type}"`
    );
  }

  invalidOption(key, value, type) {
    this.warn(`"${key}" with the type of "${type}" is not a valid option`);
  }

  validateKeys(key, value, type, keys) {
    Object.keys(value).forEach(k => {
      if (!keys.includes(k)) {
        this.warn(
          `"${key} within the object type "${type}" has an unrecognized property \`${JSON.stringify(
            k
          )}\``
        );
      }
    });
  }
}
exports.CoerceLib = CoerceLib;
