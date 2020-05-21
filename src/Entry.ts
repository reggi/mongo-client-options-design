import { Warning } from './Warning';
import { CoerceOptions } from './CoerceOptions';
import { CoerceURI } from './CoerceURI';
import { MongoOptions } from './MongoOptions';

/**
 * Cache-store for loweCase values { 'HELLO': 'hello' }
 */
const casingCache = {}
const toLowerCase = (value) => {
  if (casingCache[value]) return casingCache[value]
  casingCache[value] = value.toLowerCase()
  return casingCache[value]
}

/**
 * Responsible for converting either URI option, or Object option to a validated
 * type. Handles deprecation warnings. Useful methods for assigning coerced
 * value to parent object.
 */
export class Entry {
  lib: CoerceURI | CoerceOptions
  authoredKey: string
  isMatch: boolean = false
  hasMatch: boolean = false
  value: any
  key?: string
  isURI: boolean
  isOptions: boolean

  constructor (opt: {
    lib: CoerceURI | CoerceOptions,
    authoredKey: string,
    value: any,
    match?: boolean
  }) {
    this.lib = opt.lib
    this.authoredKey = opt.authoredKey
    this.value = opt.value
    this.isMatch = opt.match || false
    this.isURI = this.lib instanceof CoerceURI
    this.isOptions = this.lib instanceof CoerceOptions
  }

  match (key: keyof MongoOptions) {
    this.key = key
    this.isMatch = false
    if (this.isURI) {
      // cache lowerCase values
      if (toLowerCase(this.authoredKey) == toLowerCase(key)) {
        this.isMatch = true
        this.hasMatch = true
      }
    }
    if (this.isOptions) {
      if (this.authoredKey === key) {
        this.isMatch = true
        this.hasMatch = true
      }
    }
    return this
  }

  // ----- Deprecation / Warning Methods -----

  uriNoMatch () {
    if (this.hasMatch === false) {
      if (this.isURI) {
        this.lib.warn(`Unrecognized option \`${this.authoredKey}\``)
      }
    }
    return this
  }

  optionsNoMatch () {
    if (this.hasMatch === false) {
      if (this.isOptions) {
        this.lib.warn(`Unrecognized option \`${this.authoredKey}\``)
      }
    }
    return this
  }

  noMatch () {
    this.uriNoMatch()
    this.optionsNoMatch()
    return this
  }

  uriFavor (favor?: string) {
    if (!this.isMatch) return this
    if (this.isURI) {
      this.lib.warn(`"${this.authoredKey}" is deprecated, please use "${favor}"`)
    }
    return this
  }

  optionFavor (favor: string) {
    if (!this.isMatch) return this
    if (this.isOptions) {
      this.lib.warn(`"${this.authoredKey}" is deprecated, please use "${favor}"`)
    }
    return this
  }

  favor (favor: string) {
    this.uriFavor(favor)
    this.optionFavor(favor)
    return this
  }

  notSupported () {
    if (!this.isMatch) return this
    this.lib.warn(`"${this.authoredKey}" is a valid mongo URI option but it's not supported in this driver`)
    return this
  }

  // ----- Coercion Methods -----

  toString () {
    if (!this.isMatch) return this
    this.value = this.lib.string(this.value, this.authoredKey)
    return this
  }

  toBoolean () {
    if (!this.isMatch) return this
    this.value = this.lib.boolean(this.value, this.authoredKey)
    return this
  }

  toNumber () {
    if (!this.isMatch) return this
    this.value = this.lib.number(this.value, this.authoredKey)
    return this
  }

  toArrayOfEnum <E> (eObj: { [name: string]: E }) {
    if (!this.isMatch) return this
    const enumName = Object.keys(eObj)[0]
    const e = eObj[enumName]
    // have to force fn to be any because of argument-type overlap
    const fn = this.lib.arrayOfEnum.bind(this.lib) as any
    this.value = fn(e, enumName)(this.value, this.authoredKey)
    return this
  }

  toEnum <E> (eObj: { [name: string]: E }) {
    if (!this.isMatch) return this
    const enumName = Object.keys(eObj)[0]
    const e = eObj[enumName]
    // have to force fn to be any because of argument-type overlap
    const fn = this.lib.enum.bind(this.lib) as any
    this.value = fn(e, enumName)(this.value, this.authoredKey)
    return this
  }

  toWriteConcern () {
    if (!this.isMatch) return this
    this.value = this.lib.writeConcern(this.value, this.authoredKey)
    return this
  }

  toReadConcern () {
    if (!this.isMatch) return this
    this.value = this.lib.readConcern(this.value, this.authoredKey)
    return this
  }

  toAuthMechanismProperties () {
    if (!this.isMatch) return this
    this.value = this.lib.authMechanismProperties(this.value, this.authoredKey)
    return this
  }

  toAuth () {
    if (!this.isMatch) return this
    this.value = this.lib.auth(this.value, this.authoredKey)
    return this
  }

  toReadPreference () {
    if (!this.isMatch) return this
    this.value = this.lib.readPreference(this.value, this.authoredKey)
    return this
  }

  // ----- Value-export Methods -----

  /**
   * Returns true if the value has changed state.
   */
  get shouldUpdateValue () {
    const isUndefined = (typeof this.value === 'undefined')
    const isEmptyArray = Array.isArray(this.value) && this.value.length == 0
    return this.isMatch && !isUndefined && !isEmptyArray
  }

  /**
   * Fires callback if shouldUpdateValue
   */
  use (cb) {
    if (this.shouldUpdateValue) {
      cb(this.value)
    }
    return this
  }

  /**
   * Assigns value to parent object using the key provided in match, or key
   * argument if available. Only assigns value if shouldUpdateValue.
   */
  assign (parent: any, key?: keyof MongoOptions) {
    if (this.shouldUpdateValue) {
      const resolveKey = key || this.key
      if (typeof resolveKey !== 'undefined') {
        parent[resolveKey] = this.value
      }
    }
    return this
  }

  /**
   * Assumes that parent key value, and the new value are objects and uses
   * object.assign to overwrite new values over the existing.
   */
  objectAssign (parent: any, key?: keyof MongoOptions) {
    if (this.shouldUpdateValue) {
      const resolveKey = key || this.key
      if (typeof resolveKey !== 'undefined') {
        parent[resolveKey] = Object.assign({}, parent[resolveKey], this.value)
      }
    }
    return this
  }

  /**
   * Assumes that parent key value, and the new value is an array, and spreads
   * old values and new values over an empty array.
   */
  concat (parent: any, key?: keyof MongoOptions) {
    if (this.shouldUpdateValue) {
      const resolveKey = key || this.key
      if (typeof resolveKey !== 'undefined') {
        if (Array.isArray(parent[resolveKey])) {
          parent[resolveKey] = [...parent[resolveKey], ...this.value]
        }
      }
    }
    return this
  }

  /**
   * Assumes that parent key value is array, and the value is an item that
   * belongs in the array. Appends the array value.
   */
  push (parent: any, key?: keyof MongoOptions) {
    if (this.shouldUpdateValue) {
      const resolveKey = key || this.key
      if (typeof resolveKey !== 'undefined') {
        if (Array.isArray(parent[resolveKey])) {
          parent[resolveKey] = [...parent[resolveKey], this.value]
        }
      }
    }
    return this
  }
}