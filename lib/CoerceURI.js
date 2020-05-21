'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.CoerceURI = void 0;
const CoerceLib_1 = require('./CoerceLib');
const Warning_1 = require('./Warning');
const types_1 = require('./types');

class CoerceURI extends CoerceLib_1.CoerceLib {
  warn(message) {
    return new Warning_1.Warning(`Client URI Warning: ${message}`);
  }

  boolean(value, key) {
    if (Array.isArray(value)) return this.boolean(value[value.length + 1], key);
    if (value === 'true') return true;
    if (value === 'false') return false;
    this.incorrectType(key, value, 'boolean');
    return undefined;
  }

  string(value, key) {
    if (Array.isArray(value)) return this.string(value[value.length + 1], key);
    return value;
  }

  number(value, key) {
    if (Array.isArray(value)) return this.number(value[value.length + 1], key);
    const numb = +value;
    if (!isNaN(numb)) return numb;
    this.incorrectType(key, value, 'number');
    return undefined;
  }

  enum(e, enumName) {
    const inner = (value, key) => {
      if (Array.isArray(value)) return inner(value, key);
      if (e[value]) return e[value];
      this.incorrectType(key, value, enumName);
      return undefined;
    };
    return inner;
  }

  arrayOfEnum(e, enumName) {
    const inner = (value, key) => {
      // because we're accepting comma separated values, we're only taking the last item in query
      if (Array.isArray(value)) return inner(value[value.length + 1], key);
      return value.split(',').reduce((acq, v) => {
        if (e[v]) {
          acq.push(e[v]);
        } else {
          this.incorrectType(key, value, enumName);
        }
        return acq;
      }, []);
    };
    return inner;
  }

  writeConcern(value, key) {
    if (Array.isArray(value)) return this.writeConcern(value, key);
    if (value === types_1.MAJORITY) return types_1.MAJORITY;
    const numb = +value;
    if (!isNaN(numb)) return numb;
    this.incorrectType(key, value, 'WriteConcern');
    return undefined;
  }

  readConcern(value, key) {
    // readConcern is not allowed in the URI
    this.invalidOption(key, value, 'readConcern');
    return {};
  }

  authMechanismProperties(value, key) {
    const v = Array.isArray(value) ? value.join(',') : value;
    const pairs = v.split(',');
    const keyValue = Object.assign(
      {},
      ...pairs.map(pair => {
        const [key, value] = pair.split(':');
        return { [key]: value };
      })
    );
    this.validateKeys(key, keyValue, 'authMechanismProperties', [
      'SERVICE_NAME',
      'CANONICALIZE_HOST_NAME',
      'SERVICE_REALM',
    ]);
    const UR = (v, cb) => (typeof v !== 'undefined' ? cb(v) : undefined);
    const OR = (v, cb) => (typeof v !== 'undefined' ? cb(v) : {});
    const SERVICE_NAME = UR(keyValue.SERVICE_NAME, v => this.string(v, 'SERVICE_NAME'));
    const CANONICALIZE_HOST_NAME = UR(keyValue.CANONICALIZE_HOST_NAME, v =>
      this.boolean(v, 'CANONICALIZE_HOST_NAME')
    );
    const SERVICE_REALM = UR(keyValue.SERVICE_REALM, v => this.string(v, 'SERVICE_REALM'));
    return {
      ...OR(SERVICE_NAME, SERVICE_NAME => ({ SERVICE_NAME })),
      ...OR(CANONICALIZE_HOST_NAME, CANONICALIZE_HOST_NAME => ({ CANONICALIZE_HOST_NAME })),
      ...OR(SERVICE_REALM, SERVICE_REALM => ({ SERVICE_REALM })),
    };
  }

  auth(value, key) {
    // auth is not allowed in the URI
    this.invalidOption(key, value, 'auth');
    return {};
  }

  readPreference(value, key) {
    if (Array.isArray(value)) return this.readPreference(value, key);
    if (types_1.ReadPreferenceMode[value]) return types_1.ReadPreferenceMode[value];
    this.incorrectType(key, value, 'readPreference');
    return undefined;
  }
}
exports.CoerceURI = CoerceURI;
