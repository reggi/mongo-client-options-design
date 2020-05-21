'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.CoerceOptions = void 0;
const Warning_1 = require('./Warning');
const CoerceLib_1 = require('./CoerceLib');
const types_1 = require('./types');

class CoerceOptions extends CoerceLib_1.CoerceLib {
  warn(message) {
    return new Warning_1.Warning(`Client Options Warning: ${message}`);
  }

  boolean(value, key) {
    if (typeof value === 'boolean') return value;
    this.incorrectType(key, value, 'boolean');
    return undefined;
  }

  string(value, key) {
    if (typeof value === 'string') return value;
    this.incorrectType(key, value, 'string');
    return undefined;
  }

  number(value, key) {
    if (typeof value === 'number') return value;
    this.incorrectType(key, value, 'number');
    return undefined;
  }

  enum(e, enumName) {
    return (value, key) => {
      if (e[value]) return e[value];
      this.incorrectType(key, value, enumName);
      return undefined;
    };
  }

  arrayOfEnum(e, enumName) {
    return (value, key) => {
      if (Array.isArray(value)) {
        return value.reduce((acq, v) => {
          if (e[v]) {
            acq.push(e[v]);
          } else {
            this.incorrectType(key, value, enumName);
          }
          return acq;
        }, []);
      }
      this.incorrectType(key, value, 'Array');
      return [];
    };
  }

  writeConcern(value, key) {
    if (typeof value === 'number') return value;
    if (value === types_1.MAJORITY) return types_1.MAJORITY;
    const numb = +value;
    if (!isNaN(numb)) return numb;
    this.incorrectType(key, value, 'writeConcern');
    return undefined;
  }

  readConcern(value, key) {
    this.validateKeys(key, value, 'readConcern', ['level']);
    const level = this.enum(types_1.ReadConcernLevel, 'ReadConcernLevel')(value.level, 'level');
    return {
      ...(typeof level !== 'undefined' ? { level } : {}),
    };
  }

  authMechanismProperties(value, key) {
    this.validateKeys(key, value, 'authMechanismProperties', [
      'SERVICE_NAME',
      'CANONICALIZE_HOST_NAME',
      'SERVICE_REALM',
    ]);
    const UR = (v, cb) => (typeof v !== 'undefined' ? cb(v) : undefined);
    const OR = (v, cb) => (typeof v !== 'undefined' ? cb(v) : {});
    const SERVICE_NAME = UR(value.SERVICE_NAME, v => this.string(v, 'SERVICE_NAME'));
    const CANONICALIZE_HOST_NAME = UR(value.CANONICALIZE_HOST_NAME, v =>
      this.boolean(v, 'CANONICALIZE_HOST_NAME')
    );
    const SERVICE_REALM = UR(value.SERVICE_REALM, v => this.string(v, 'SERVICE_REALM'));
    return {
      ...OR(SERVICE_NAME, SERVICE_NAME => ({ SERVICE_NAME })),
      ...OR(CANONICALIZE_HOST_NAME, CANONICALIZE_HOST_NAME => ({ CANONICALIZE_HOST_NAME })),
      ...OR(SERVICE_REALM, SERVICE_REALM => ({ SERVICE_REALM })),
    };
  }

  auth(value, key) {
    this.validateKeys(key, value, 'auth', ['username', 'user', 'pass', 'password']);
    const user = value.user ? this.string(value.user, 'user') : undefined;
    const username = value.username ? this.string(value.user, 'username') : undefined;
    const pass = value.user ? this.string(value.pass, 'pass') : undefined;
    const password = value.username ? this.string(value.password, 'password') : undefined;
    return {
      ...(typeof username !== 'undefined' ? { user: username } : {}),
      ...(typeof user !== 'undefined' ? { user: user } : {}),
      ...(typeof password !== 'undefined' ? { pass: password } : {}),
      ...(typeof pass !== 'undefined' ? { pass: pass } : {}),
    };
  }

  readPreference(value, key) {
    if (value instanceof types_1.ReadPreference) return value;
    if (typeof value === 'string') {
      if (types_1.ReadPreferenceMode[value]) return types_1.ReadPreferenceMode[value];
    }
    this.incorrectType(key, value, 'readPreference');
    return undefined;
  }
}
exports.CoerceOptions = CoerceOptions;
