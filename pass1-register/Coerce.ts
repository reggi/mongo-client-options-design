import { Utility } from './Utility';
import { Tags } from './types';
import { TypeWarning } from './TypeWarning'
import * as Enums from './Enums'

type CoerceTo<T> = T | TypeWarning | undefined

class ReadPreference {
  constructor (mode: any) {}
}

export class Coerce {

  static boolean (value: string | boolean): CoerceTo<boolean> {
    if (typeof value === 'undefined') return undefined
    if (value === true) return true
    if (value === false) return false
    if (value && value.match(/^true$/i)) return true
    if (value && value.match(/^false$/i)) return false
    return new TypeWarning('not able to coerce to boolean')
  }

  static string (value: string): CoerceTo<string> {
    if (typeof value === 'undefined') return undefined
    if (typeof value === 'string') return value
    return new TypeWarning('not able to coerce to string')
  }

  static enum(e: any, key: string) {
    return (value: any): CoerceTo<string> => {
      if (typeof value === 'undefined') return undefined
      if (e[value]) return value
      return new TypeWarning(`not able to coerce to ${key}`)
    }
  }

  static utfEncoded () {
  }

  static object (a: any) {
  }

  static MAJORITY = 'majority'
  static writeConcern (value: number | string ): CoerceTo<number | string> {
    if (typeof value === 'undefined') return undefined
    if (typeof value === 'number') return Math.round(value)
    if (value.match(new RegExp(this.MAJORITY, 'i'))) return this.MAJORITY
    if (!isNaN(parseInt(value, 10))) return parseInt(value, 10)
    return new TypeWarning('not able to coerce to writeConcern')
  }

  static readPreference (value: ReadPreference | string): CoerceTo<ReadPreference> {
    if (value instanceof ReadPreference) return ReadPreference
    const valid = Coerce.enum(Enums.readPreferenceMode, 'readPreferenceMode')(value)
    if (valid) return new ReadPreference(value)
    return undefined
  }

  static tag (value: string) {
    if (typeof value === 'string' && value.match(':')) {
      const splitTag = value.split(':');
      const rel = { [splitTag[0]]: splitTag[1] }
      return rel
    }
    return new TypeWarning(`invalid tag ${value}`)
  }

  static tags (value: Tags) {
    if (typeof value === 'undefined') return undefined
    if (typeof value === 'string') {
      const stringArr = value.split(',')
      const values = stringArr.map((v: any) => {
        return Coerce.tag(v)
      })
      return Utility.assign({}, ...values)
    }
    if (Array.isArray(value)) {
      const values = value.map((v: any) => {
        if (typeof v === 'string') return Coerce.tag(v)
        return v
      })
      return Utility.assign({}, ...values)
    }
    if (Utility.isPlainObject(value)) {
      return value
    }
    return new TypeWarning(`invalid tags ${value}`)
  }

}

// console.log(Coerce.tags('hello:world,hello:hi'))
// console.log(Coerce.tags(['hello:world', 'meow:hi']))
// console.log(Coerce.tags(['hello:world', { hello: 'hi'}]))
// console.log(Coerce.tags({ hello: 'world', meow: 'hi'}))

