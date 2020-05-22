/**
 *
 * 8 is going to have an emphasis on reduction
 * that was a pun,
 * it's going to really consider, not looping to much
 *
 * all the previous iterations loop over the entire options object
 * for each .find, for each property, 30x times!
 *
 *
 */

type PlainObject = { [name: string]: any }

class Utils {
  static coersion (a: any, arr: any[]) {

  }

  static keys <T>(g: T) {
    return Object.keys(g) as (keyof T)[]
  }

  static isPlainObject(obj: any): obj is PlainObject {
      return obj && obj.constructor === Object || false;
  }

  static map <T> (g: T, handler: (...args: any) => any) {
    const start = Array.isArray(g) ? [] : {}
    return Utils.keys(g).reduce((acq:any, key, total) => {
      const value = g[key]
      acq[key] = handler(key, value, acq, total)
      return acq
    }, start)
  }

  static deepMap <T> (g: T, handler: (...args: any) => any) {
    const start = Array.isArray(g) ? [] : {}
    return Utils.keys(g).reduce((acq:any, key, total) => {
      const value = g[key]
      if (Array.isArray(value)) {
        acq[key] = Utils.deepMap(value, handler)
        return acq
      }
      if (Utils.isPlainObject(value)) {
        acq[key] = Utils.deepMap(value, handler)
        return acq
      }
      acq[key] = handler(key, value, acq, total)
      return acq

    }, start)
  }
}

class MongoOption {
    constructor () {

    }
    bool(...keys: string[]) {

    }
}

class MongoOptions {
    static j (options: any) {
        return
    }
}

function parse (options: any) {
    return {
        j: MongoOptions.j(options),
    }
}

const options = {
    journal: true,
    joUrnal: true,
    ssl: true,
    ssL: true,
    SSL: true
}

const mapping = {
    'j': MongoOption.bool('j', 'journal')
    'ssl': ['ssl', 'tls'],
    'tls': ['tls', 'ssl'],
}

const x = Utils.map(mapping, (key, value) => {
    return [...value, 'poop']
})

console.log(x)