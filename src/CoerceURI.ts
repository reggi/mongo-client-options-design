import { CoerceLib } from './CoerceLib';
import { Warning } from './Warning';
import {
  AuthMechanismProperties,
  ReadPreference,
  ReadPreferenceMode,
  ReadConcern,
  WriteConcern,
  Auth,
  ReadPreferenceOption,
  MAJORITY,
  Compressor
} from './types';

export class CoerceURI extends CoerceLib<string | string[]> {
  warn (message: string) {
    return new Warning(`Client URI Warning: ${message}`)
  }

  boolean (value: string | string[], key: string): boolean | undefined {
    if (Array.isArray(value)) return this.boolean(value[value.length +1], key)
    if (value === 'true') return true
    if (value === 'false') return false
    this.incorrectType(key, value, 'boolean')
    return undefined
  }

  string (value: string | string[], key: string): string {
    if (Array.isArray(value)) return this.string(value[value.length +1], key)
    return value
  }

  number (value: string | string[], key: string): number | undefined {
    if (Array.isArray(value)) return this.number(value[value.length +1], key)
    const numb = +value
    if (!isNaN(numb)) return numb
    this.incorrectType(key, value, 'number')
    return undefined
  }

  enum <E> (e: E, enumName: string) {
    const inner = (value: string | string[], key: string): E | keyof E | undefined => {
      if (Array.isArray(value)) return inner(value, key)
      if (e[value]) return e[value]
      this.incorrectType(key, value, enumName)
      return undefined
    }
    return inner
  }

  arrayOfEnum <E> (e: E, enumName: string) {
    const inner = (value: string | string[], key: string): (E | keyof E)[] => {
      // because we're accepting comma separated values, we're only taking the last item in query
      if (Array.isArray(value)) return inner(value[value.length +1], key)
      return value.split(',').reduce((acq: E[], v) => {
        if (e[v]) {
          acq.push(e[v])
        } else {
          this.incorrectType(key, value, enumName)
        }
        return acq
      }, [])
    }
    return inner
  }

  writeConcern (value: string | string[], key: string): WriteConcern | undefined {
    if (Array.isArray(value)) return this.writeConcern(value, key)
    if (value === MAJORITY) return MAJORITY
    const numb = +value
    if (!isNaN(numb)) return numb
    this.incorrectType(key, value, 'WriteConcern')
    return undefined
  }

  readConcern (value: string | string[], key: string): Partial<ReadConcern> {
    // readConcern is not allowed in the URI
    this.invalidOption(key, value, 'readConcern')
    return {}
  }

  authMechanismProperties (value: string | string[], key: string): Partial<AuthMechanismProperties> {
    const v = (Array.isArray(value)) ? value.join(',') : value
    const pairs = v.split(',')
    const keyValue = Object.assign({}, ...pairs.map(pair => {
      const [key, value] = pair.split(':')
      return { [key]: value }
    }))
    this.validateKeys(key, keyValue, 'authMechanismProperties', ['SERVICE_NAME', 'CANONICALIZE_HOST_NAME', 'SERVICE_REALM'])
    const UR = (v: any | undefined, cb) => (typeof v !== 'undefined') ? cb(v) : undefined
    const OR = (v: any | undefined, cb) => (typeof v !== 'undefined') ? cb(v) : {}
    const SERVICE_NAME = UR(keyValue.SERVICE_NAME, v => this.string(v, 'SERVICE_NAME'))
    const CANONICALIZE_HOST_NAME = UR(keyValue.CANONICALIZE_HOST_NAME, v => this.boolean(v, 'CANONICALIZE_HOST_NAME'))
    const SERVICE_REALM = UR(keyValue.SERVICE_REALM, v => this.string(v, 'SERVICE_REALM'))
    return {
      ...OR(SERVICE_NAME, (SERVICE_NAME) => ({SERVICE_NAME})),
      ...OR(CANONICALIZE_HOST_NAME, (CANONICALIZE_HOST_NAME) => ({CANONICALIZE_HOST_NAME})),
      ...OR(SERVICE_REALM, (SERVICE_REALM) => ({SERVICE_REALM})),
    }
  }

  auth(value: string | string[], key: string): Partial<Auth> {
    // auth is not allowed in the URI
    this.invalidOption(key, value, 'auth')
    return {}
  }

  readPreference(value: string | string[], key: string): ReadPreferenceOption | undefined {
    if (Array.isArray(value)) return this.readPreference(value, key)
    if (ReadPreferenceMode[value]) return ReadPreferenceMode[value]
    this.incorrectType(key, value, 'readPreference')
    return undefined
  }
}


