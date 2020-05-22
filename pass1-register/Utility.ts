import { TypeWarning } from './TypeWarning';

export type PlainObject = { [name: string]: any }

export class Utility {

  static keys <T>(g: T) {
    return Object.keys(g) as (keyof T)[]
  }

  static tuple<T extends readonly string[]>(...args: T) {
    return args
  }

  static isPlainObject(obj: any): obj is PlainObject {
    return obj && obj.constructor === Object || false;
}

  static map <T> (g: T, handler: (...args: any) => any) {
    const start = Array.isArray(g) ? [] : {}
    return Utility.keys(g).reduce((acq:any, key, total) => {
      const value = g[key]
      acq[key] = handler(key, value, acq, total)
      return acq
    }, start)
  }

  static deepMap <T> (g: T, handler: (...args: any) => any) {
    const start = Array.isArray(g) ? [] : {}
    return Utility.keys(g).reduce((acq:any, key, total) => {
      const value = g[key]
      if (Array.isArray(value)) {
        acq[key] = Utility.deepMap(value, handler)
        return acq
      }
      if (Utility.isPlainObject(value)) {
        acq[key] = Utility.deepMap(value, handler)
        return acq
      }
      acq[key] = handler(key, value, acq, total)
      return acq

    }, start)
  }

  /** just like Object.assign, but shallow warns duplicates */
  static assign (...obj: any): any {
    const store = []
    Object.values(obj).forEach((value) => {
      Object.keys(value).forEach((value) => {
        if (store.includes(value)) {
          return new TypeWarning(`duplicated tag ${value}`)
        }
        store.push(value)
      })
    })
    return Object.assign.apply(null, obj)
  }

}