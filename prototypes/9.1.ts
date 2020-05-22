import * as fs from 'fs'

// const rules = [
//     MongoOption.loose.boolean('j', 'journal'),
//     MongoOption.loose.boolean('tls', 'ssl'),

//     // MongoOption.deprecateAlias('ssl'),
//     // MongoOption.if('tlsInsecure').setFalse('sslValidate'),
//     // MongoOption.if('tlsInsecure').setFalse('checkServerIdentity'),
//     // MongoOption.ifFalse('tlsInsecure', 'tlsAllowInvalidHostnames').setFalse('checkServerIdentity')
// ]

// Object.assign(queryString, {
//     checkServerIdentity: queryString.tlsAllowInvalidHostnames ? false : true,
//     sslValidate: queryString.tlsAllowInvalidCertificates ? false : true
//   });

class MongoOption<DV, OK> {
  key: OK;
  default: DV;

  constructor(opts: {
    key?: OK;
    type?: (a: any, o: any) => any
    default?: DV
    coercion?: any
    aliases?: any
    deprecatedAliases?: any
    deprecated?: any
    resolve?: (a: any, o: any) => any
    resolveMany?: (a: any, o: any) => any
   }) {
    this.key = opts.key;
    this.default = opts.default;
  }

  static register<OK, DV>(opts: {
    key?: OK;
    type?: (a: any, o: any) => any
    default?: DV
    coercion?: any
    aliases?: any
    deprecatedAliases?: any
    deprecated?: any
    resolve?: (a: any, o: any) => any
    resolveAsync?: (a: any, o: any) => any
    resolveMany?: (a: any, o: any) => any
    resolveManyAsync?: (a: any, o: any) => any
  }) {
    return new MongoOption(opts);
  }
}

const authMechanism = {
  'DEFAULT': 'DEFAULT'
}

const compression = {
  'snappy': 'snappy',
  'zlib': 'zlib'
}

class ReadPreference {
  constructor(node: string) {}
}

const readPreferenceTypes = [
  'primary',
  'primary_preferred'
]

class Warn {
  message: string
  constructor (message: string) {
    this.message = message
  }
}

type CoerceTo<T> = T | Warn | undefined

class Coerce {

  /** coerces option to boolean, can be string value */
  static boolean (value: string | boolean): CoerceTo<boolean> {
    if (value === true) return true
    if (value === false) return false
    if (value && value.match(/^true$/i)) return true
    if (value && value.match(/^false$/i)) return false
    return new Warn('not a boolean')
  }

  /** coerces option to string */
  static string (value: string): CoerceTo<string> {
    if (typeof value === 'string') return value
    return new Warn('not a string')
  }

  static enum <T extends any> (e: T) {
    return (value: string): CoerceTo<keyof T> => {
      if (e[value]) return value
      return (eName) ? new Warn(`not a ${eName}`) : new Warn(`not a enum`)
    }
  }

  static readPreference (value: ReadPreference | string): CoerceTo<ReadPreference> {
    if (value instanceof ReadPreference) return ReadPreference
    const valid = Coerce.enum(readPreferenceTypes)(value)
    if (valid) return new ReadPreference(value)
    return undefined
  }

  static buffer (value: Buffer): CoerceTo<Buffer> {
    if (typeof value === 'undefined') return undefined
    if (Buffer.isBuffer(value)) return value
    return new Warn('not a buffer')
  }

  // static number () {}
  // static buffer () {}
  // static tags () {}
  // static urlEncoded () {}
  // static enum (x: any, o: { ignoreCase: boolean }) {
  //   return () => {}
  // }
}

"ignoring option value of 'j' not a boolean"

const MongoOptions = [
  MongoOption.register({
    key: 'j',
    aliases: ['journal'],
    type: Coerce.boolean,
    default: false,
  }),
  // MongoOption.register({
  //   optionKey: 'tls',
  //   type: Coerce.boolean,
  //   deprecatedAliases: ['ssl'],
  //   defaultValue: false,
  //   coercion: Coerce.boolean
  // }),
  // MongoOption.register({
  //   optionKey: 'socketTimeoutMS',
  //   type: Coerce.number,
  //   defaultValue: 360000,
  //   coercion: Coerce.number
  // }),
  // MongoOption.register({
  //   optionKey: 'poolSize',
  //   aliases: ['maxPoolSize'],
  //   defaultValue: 5,
  //   type: Coerce.number,
  // }),
  // MongoOption.register({
  //   optionKey: { auth: 'user' },
  //   aliases: { auth: 'username'},
  //   type: Coerce.string,
  // }),
  // MongoOption.register({
  //   optionKey: { auth: 'pass' },
  //   aliases: { auth: [ 'pass', 'password ']},
  //   type: Coerce.urlEncoded,
  // }),
  // MongoOption.register({
  //   optionKey: 'readPreferenceTags',
  //   type: Coerce.tags
  // }),
  // MongoOption.register({
  //   optionKey: 'readPreference',
  //   type: Coerce.readPreference,
  //   resolve: ({ parsedValue, parsedOptions }) => {
  //     // adds tags to readPreference
  //     const value = parsedValue
  //     value.tags = parsedOptions.readPreferenceTags
  //     return value
  //   }
  // }),
  // MongoOption.register({
  //   optionKey: 'authSource',
  //   aliases: [{ auth: ['db', 'database' ]}],
  //   type: Coerce.string,
  //   resolveMany: ({ parsedValue, optionKey}) => ({
  //     [optionKey]: parsedValue,
  //     defaultDatabase: parsedValue || 'test'
  //   })
  // }),
  // MongoOption.register({
  //   optionKey: 'authMechanism',
  //   defaultValue: authMechanism.DEFAULT,
  //   type: Coerce.enum(authMechanism, { ignoreCase: false })
  // }),
  // MongoOption.register({
  //   optionKey: 'compression',
  //   type: Coerce.enum({ compression })
  // }),
  // MongoOption.register({
  //   optionKey: 'sslCA',
  //   deprecated: 'sslCA is deprecated prefer tlsCAFile',
  //   type: Coerce.string
  // }),
  // MongoOption.register({
  //   optionKey: 'tlsCAFile',
  //   type: Coerce.string,
  //   resolveManyAsync: ({ parsedValue, parsedOptions }, callback) => {
  //     if (!parsedOptions.tlsCAFile) return undefined
  //     return fs.readFile(parsedOptions.tlsCAFile, (err, buffer) => {
  //       if (err) return callback(err)
  //       return callback(null, { tlsCA: buffer})
  //     })
  //   }
  // }),
  // MongoOption.register({
  //   resolveMany: ({ parsedValue, parsedOptions }, callback) => {
  //     const picked = pick(parsedOptions, ['ca'])
  //     return picked
  //   }
  // }),
]

type MongoExternalOptions<T> = any
type MongoInternalOptions<T> = any

type Options = MongoExternalOptions<typeof MongoOptions>
type ParsedOptions = MongoInternalOptions<typeof MongoOptions>

function parse (opt: Options): ParsedOptions {
  const results = MongoOptions.reduce((acq, option) => {



    // resolve option.key

    // resolve option.aliases

    // resolve option.deprecatedAliases

    // resolve option.resolve

    // resolve option.resolveMany

    // resolve option.resolveAsync

    // resolve option.resolveManyAsync

    // option.type()

  }, {})
  return Object.freeze(results)
}

const values = parse({})

// values.tlsOptions
