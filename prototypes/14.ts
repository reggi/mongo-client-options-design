import * as querystring from 'querystring';
import * as url from 'url';


// uri options schema:

class Coerce {
  static string () {}
  static boolean () {}
  static number () {}
  static tags () {}
  static readPreference () {}
}

const URIOption = <A, B>(coerce: A, opt?: { isArray?: boolean, default?: B }) => {
  return {
    isArray: opt.isArray,
    default: opt.default,
    coerce
  }
}

const URIOptionsSchema = {
  [replicaSet]: URIOption(Coerce.string),
  // [w]: URIOption(Coerce.boolean),
  // [tls]: URIOption(Coerce.boolean),
  // [ssl]: URIOption(Coerce.boolean),
  // [tlsCertificateKeyFile]: URIOption(Coerce.string),
  // [tlsCertificateKeyFilePassword]: URIOption(Coerce.string),
  // [tlsCAFile]: URIOption(Coerce.string),
  // [tlsAllowInvalidCertificates]: URIOption(Coerce.string),
  // [tlsAllowInvalidHostnames]: URIOption(Coerce.string),
  // [tlsInsecure]: URIOption(Coerce.boolean),
  // [connectTimeoutMS]: URIOption(Coerce.number),
  // [socketTimeoutMS]: URIOption(Coerce.number),
  // [readPreference]: URIOption(Coerce.readPreference),
  // [readPreferenceTags]: URIOption(Coerce.tags, { isArray: true })

  // [maxPoolSize] = URIOption(Coerce.number, { default: 100 })

  /**
   * Specify a custom app name.
   * https://docs.mongodb.com/manual/reference/connection-string/#urioption.appName
   */
  appName: URIOption(Coerce.string)
}

// type UnionToIntersection<U> =
// 	(U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

// type OptionsFromListA<M extends readonly MongoOption<any, any>[]> = {
//     [K in keyof M]: M[K] extends MongoOption<any, any> ? Record<M[K]['key'], Parameters<M[K]['validate']>[0]> : never
// }[number]

// type OptionsFromList<M extends readonly MongoOption<any, any>[]> = Partial<UnionToIntersection<OptionsFromListA<M>>>

function parseUriOptions (connectionString: string) {
  const parsedUrl = url.parse(connectionString)
  const options = querystring.parse(parsedUrl.query)
  const validKeys = Object.keys(URIOptionsSchema)
  const mappedKeys = Object.assign({}, ...validKeys.map(k => ({[k.toLowerCase()]: k})))
  const results = Object.keys(options).reduce((acq, authoredKey) => {
    const validKey = mappedKeys[authoredKey.toLowerCase()]
    if (validKey) {
      const value = options[authoredKey]
      const handlers = URIOptionsSchema[validKey]
      if (handlers.isArray && acq[validKey]) {
        acq[validKey].concat(handlers.coerce(value))
      } else if (acq[validKey]) {
        acq[validKey] = handlers.coerce(value)
      }
    } else {
      console.warn(`${authoredKey} is not a valid option key`)
    }
    return acq
  }, {})
  return results
}

// const results = parseUriOptions("localhost?rePlicaSet=dope&rePlicaSet=woof&replicaSet=meow&w=true")

// results.appName

// const URIOptionsSchema = parseUriOptions('meow')

// URIOptionsSchema.replicaSet





// // class Coerce {
// //   static enum = <T> (enum: T) => (value?: keyof typeof UuidRepresentation): UuidRepresentation => {
// //     if (UuidRepresentation[value]) return UuidRepresentation[value]
// //     return undefined
// //   }

// //   static boolean () {

// //   }
// // }


// // // class RawMongoUriOptions {

// // //   /**
// // //    * Specify a custom app name.
// // //    * https://docs.mongodb.com/manual/reference/connection-string/#urioption.appName
// // //    */
// // //   appName? (value?: string): string {
// // //     if (typeof value === 'undefined') return undefined
// // //     return undefined
// // //   }

// // //   /**
// // //    * Enable retryable writes.
// // //    * https://docs.mongodb.com/manual/reference/connection-string/#urioption.retryWrites
// // //    */
// // //   retryWrites? (value?: keyof typeof BooleanValue): boolean {
// // //     if (BooleanValue[value]) {
// // //       if (BooleanValue[value] === BooleanValue.true) return true
// // //       if (BooleanValue[value] === BooleanValue.false) return false
// // //     }
// // //     return undefined
// // //   }

// // //   /**
// // //    * https://docs.mongodb.com/manual/reference/connection-string/#urioption.uuidRepresentation
// // //    */
// // //   uuidRepresentation (value?: keyof typeof UuidRepresentation): UuidRepresentation {
// // //     if (UuidRepresentation[value]) return UuidRepresentation[value]
// // //     return undefined
// // //   }
// // // }

// // class MongoUriOptions {

// //   /**
// //    * Specify a custom app name.
// //    * https://docs.mongodb.com/manual/reference/connection-string/#urioption.appName
// //    */
// //   static appName = find('appName', Coerce.string)

// //   /**
// //    * Enable retryable writes.
// //    * https://docs.mongodb.com/manual/reference/connection-string/#urioption.retryWrites
// //    */
// //   static retryWrites = find('retryWrites', Coerce.boolean)

// //   /**
// //    * https://docs.mongodb.com/manual/reference/connection-string/#urioption.uuidRepresentation
// //    */
// //   static uuidRepresentation = find('uuidRepresentation', Coerce.enum(UuidRepresentation))
// // }



// // const retryWrites = 'retryWrites'

// // class Options {
// //   [retryWrites]: boolean
// // }

// // const x = new Options()

// // x[retryWrites]

function isPlainObject(obj: any): obj is PlainObject {
  return obj && obj.constructor === Object || false;
}


function tags (value: any) {
  if (typeof value === 'string') {

  }

  if (Array.isArray(value)) {

  }
}



class MongoURI {
  keys: {
    [replicaSet]?: string
    [w]?: boolean
    [tls]?: boolean
    [ssl]?: boolean
    [tlsCertificateKeyFile]?: string
    [tlsCertificateKeyFilePassword]?: string
    [tlsCAFile]?: string
    [tlsAllowInvalidCertificates]?: string
    [tlsAllowInvalidHostnames]?: string
    [tlsInsecure]?: boolean
    [connectTimeoutMS]?: number
    [socketTimeoutMS]?: number
    [readPreference]?: ReadPreferenceMode
    [readPreferenceTags]?: any[]
  }

  definitions = {
    [replicaSet]: {},
    [w]: {},
    [tls]: {},
    [ssl]: {},
    [tlsCertificateKeyFile]: {},
    [tlsCertificateKeyFilePassword]: {},
    [tlsCAFile]: {},
    [tlsAllowInvalidCertificates]: {},
    [tlsAllowInvalidHostnames]: {},
    [tlsInsecure]: {},
    [connectTimeoutMS]: {},
    [socketTimeoutMS]: {},
    [readPreference]: {},
    [readPreferenceTags]: {},
  }

  get lowerCaseKeys () {

  }

  constructor () {

  }
  static parse (connectionString: string) {
    return new MongoURI()
  }
}

MongoURI.parse('hello-world').replicaSet




