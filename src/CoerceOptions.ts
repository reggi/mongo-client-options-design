import { Warning } from './Warning';
import { CoerceLib } from './CoerceLib';
import {
  ReadConcern,
  ReadPreference,
  ReadConcernLevel,
  AuthMechanismProperties,
  ReadPreferenceMode,
  WriteConcern,
  Auth,
  ReadPreferenceOption,
  MAJORITY
} from './types';

export class CoerceOptions extends CoerceLib<any> {
  warn (message: string) {
    return new Warning(`Client Options Warning: ${message}`)
  }

  boolean (value: any, key: string): boolean | undefined {
    if (typeof value === 'boolean') return value
    this.incorrectType(key, value, 'boolean')
    return undefined
  }

  string (value: any, key: string): string | undefined {
    if (typeof value === 'string') return value
    this.incorrectType(key, value, 'string')
    return undefined
  }

  number (value: any, key: string): number | undefined {
    if (typeof value === 'number') return value
    this.incorrectType(key, value, 'number')
    return undefined
  }

  enum <E> (e: E, enumName: string) {
    return (value: any, key: string): E | keyof E | undefined => {
      if (e[value]) return e[value]
      this.incorrectType(key, value, enumName)
      return undefined
    }
  }

  arrayOfEnum <E> (e: E, enumName: string) {
    return (value: any, key: string): (E | keyof E)[] => {
      if (Array.isArray(value)) {
        return value.reduce((acq, v) => {
          if (e[v]) {
            acq.push(e[v])
          } else {
            this.incorrectType(key, value, enumName)
          }
          return acq
        }, [])
      }
      this.incorrectType(key, value, 'Array')
      return []
    }
  }

  writeConcern (value: any, key: string): WriteConcern | undefined {
    if (typeof value === 'number') return value
    if (value === MAJORITY) return MAJORITY
    const numb = +value
    if (!isNaN(numb)) return numb
    this.incorrectType(key, value, 'writeConcern')
    return undefined
  }

  readConcern (value: any, key: string): Partial<ReadConcern> {
    this.validateKeys(key, value, 'readConcern', ['level'])
    const level = this.enum(ReadConcernLevel, 'ReadConcernLevel')(value.level, 'level')
    return {
      ...((typeof level !== 'undefined') ? { level }: {}),
    }
  }

  authMechanismProperties (value: any, key: string): Partial<AuthMechanismProperties> {
    this.validateKeys(key, value, 'authMechanismProperties', ['SERVICE_NAME', 'CANONICALIZE_HOST_NAME', 'SERVICE_REALM'])
    const UR = (v: any | undefined, cb) => (typeof v !== 'undefined') ? cb(v) : undefined
    const OR = (v: any | undefined, cb) => (typeof v !== 'undefined') ? cb(v) : {}
    const SERVICE_NAME = UR(value.SERVICE_NAME, v => this.string(v, 'SERVICE_NAME'))
    const CANONICALIZE_HOST_NAME = UR(value.CANONICALIZE_HOST_NAME, v => this.boolean(v, 'CANONICALIZE_HOST_NAME'))
    const SERVICE_REALM = UR(value.SERVICE_REALM, v => this.string(v, 'SERVICE_REALM'))
    return {
      ...OR(SERVICE_NAME, (SERVICE_NAME) => ({SERVICE_NAME})),
      ...OR(CANONICALIZE_HOST_NAME, (CANONICALIZE_HOST_NAME) => ({CANONICALIZE_HOST_NAME})),
      ...OR(SERVICE_REALM, (SERVICE_REALM) => ({SERVICE_REALM})),
    }
  }

  auth(value: any, key: string): Partial<Auth> {
    this.validateKeys(key, value, 'auth', ['username', 'user', 'pass', 'password'])
    const user = value.user ? this.string(value.user, 'user') : undefined
    const username = value.username ? this.string(value.user, 'username') : undefined
    // TODO: Consider URL decode password value
    const pass = value.user ? this.string(value.pass, 'pass') : undefined
    const password = value.username ? this.string(value.password, 'password') : undefined
    return {
      ...((typeof username !== 'undefined') ? { user: username }: {}),
      ...((typeof user !== 'undefined') ? { user: user }: {}),
      ...((typeof password !== 'undefined') ? { pass: password }: {}),
      ...((typeof pass !== 'undefined') ? { pass: pass }: {})
     }
  }

  readPreference(value: any, key: string): ReadPreferenceOption | undefined {
    if (value instanceof ReadPreference) return value
    if (typeof value === 'string') {
      if (ReadPreferenceMode[value]) return ReadPreferenceMode[value]
    }
    this.incorrectType(key, value, 'readPreference')
    return undefined
  }
}


