class Coerce {
  static boolean(value: any): boolean {
      if (typeof value === 'boolean') return value
      if (value === 'true') return true
      if (value === 'false') return false
      throw new Error('invalid type')
  }
  static number(value: any): number {
      if (typeof value === 'number') return value
      const parse = parseInt(value, 10)
      if (typeof parse === 'number') return parse
      throw new Error('invalid type')
  }
  static string(value: any): string {
      if (typeof value === 'string') return value
      throw new Error('invalid type')
  }
  static strings(value: any): string[] {
      return value.map(this.string)
  }
  static uriEncoded(value: any): string {
      return decodeURIComponent(value)
  }
}

class MongoOption<key, T> {
  isDeprecated: boolean = false
  isArrayOf: boolean = false
  key: key
  alias: string | string[] | undefined
  typeName: 'boolean' | 'number' | 'string' | 'strings' | 'uriEncoded'
  runtimeTypeChecker: (v: any, e?: T) => any
  enum?: T
  constructor(
      key: key,
      alias: string | string[] | undefined,
      typeName: 'boolean' | 'number' | 'string' | 'strings'| 'uriEncoded',
      e?: T
  ) {
      this.key = key
      this.typeName = typeName
      this.runtimeTypeChecker = Coerce[typeName]
      this.enum = e
  }
  validate(value: T) {
      try {
          return this.runtimeTypeChecker(value)
      } catch (e) {
          console.warn(`option ${this.key} isn't a ${this.typeName}`)
      }
      return undefined
  }
  static boolean<key extends string> (key: key, alias?: string | string[]) {
      return new this<key, boolean>(key, alias, 'boolean')
  }
  static number<key extends string>(key: key, alias?: string | string[]) {
      return new this<key, number>(key, alias, 'number')
  }
  static string<key extends string>(key: key, alias?: string | string[]) {
      return new this<key, string>(key, alias, 'string')
  }
  static strings<key extends string>(key: key, alias?: string | string[]) {
      return new this<key, string[]>(key, alias, 'strings')
  }
  static uriEncoded<key extends string>(key: key, alias?: string | string[]) {
      return new this<key, string[]>(key, alias, 'uriEncoded')
  }
  static object(one?: string | MongoOption<any, any>[], options?: MongoOption<any, any>[]) {
      if (one) {
          return
      }
  }
}

type UnionToIntersection<U> =
(U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

type OptionsFromListA<M extends readonly MongoOption<any, any>[]> = {
  [K in keyof M]: M[K] extends MongoOption<any, any> ? Record<M[K]['key'], Parameters<M[K]['validate']>[0]> : never
}[number]

type OptionsFromList<M extends readonly MongoOption<any, any>[]> = Partial<UnionToIntersection<OptionsFromListA<M>>>

enum compressor {
  SNAPPY = 'snappy',
  ZLIB = 'zlib'
}

const mongClientOptions = [
MongoOption.boolean('journal', ['j']),
MongoOption.number('connectTimeoutMS'),
MongoOption.number('maxPoolSize'),
MongoOption.number('minPoolSize'),
MongoOption.number('maxIdleTimeMS'),
MongoOption.number('waitQueueMultiple'),
MongoOption.number('waitQueueTimeoutMS'),
MongoOption.uriEncoded('appName'),
] as const;

interface Options {
/**
     * If the database authentication is dependent on another databaseName.
     */
    authSource?: string;
    /**
     * Default: false; Force server to create _id fields instead of client.
     */
    forceServerObjectId?: boolean;
    /**
     * Default: false; Use c++ bson parser.
     */
    native_parser?: boolean;
    /**
     * Serialize functions on any object.
     */
    serializeFunctions?: boolean;
    /**
     * Specify if the BSON serializer should ignore undefined fields.
     */
    ignoreUndefined?: boolean;
    /**
     * Return document results as raw BSON buffers.
     */
    raw?: boolean;
    /**
     * Default: true; Promotes Long values to number if they fit inside the 53 bits resolution.
     */
    promoteLongs?: boolean;
    /**
     * Default: false; Promotes Binary BSON values to native Node Buffers
     */
    promoteBuffers?: boolean;
    /**
     * Default: true; Promotes BSON values to native types where possible, set to false to only receive wrapper types.
     */
    promoteValues?: boolean;
    /**
     * Custom primary key factory to generate _id values (see Custom primary keys).
     */
    pkFactory?: object;
    /**
     * ES6 compatible promise constructor
     */
    promiseLibrary?: PromiseConstructor;
    /**
     * Sets a cap on how many operations the driver will buffer up before giving up on getting a
     * working connection, default is -1 which is unlimited.
     */
    bufferMaxEntries?: number;
}

/**
 *
 *
 * @export
 * @param {Options} options
 */
export default function parse(options: Options) {

}



// parse({
//   journal: 1
// })

// parse({
//   journal: true,
//   notAnOption: true // not a valid key
// })

// // breaks types
// parse({
//     journal: 1, // wrong value type
//     notAnOption: true // not a valid key
// })
