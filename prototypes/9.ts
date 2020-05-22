// class MongoOption {
//     isLoose = false
//     isRegular = true
//     isStrict = false
//     static get loose() {
//         return class extends MongoOption {
//             isLoose = true
//             isRegular = false
//             isStrict = false
//         }
//     }
//     static get strict() {
//         return class extends MongoOption {
//             isLoose = false
//             isRegular = false
//             isStrict = true
//         }
//     }
//     static boolean (...keys: string[]) {

//     }
//     static deprecateAlias(...keys: string[]) {}

//     static if (key: any) {
//         return {
//             setFalse: (key: any) => {},
//             setTrue: (key: any) => {}
//         }
//     }

//     static ifFalse (key) {
//         return {
//             setFalse: (key: any) => {},
//             setTrue: (key: any) => {}
//         }
//     }
// }

// poolSize
// ssl
// sslValidate
// sslCA
// sslCert
// sslKey
// sslPass
// sslCRL
// checkServerIdentity

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
  optionKey: OK;
  defaultValue: DV;

  constructor(opts: {
    optionKey: OK;
    type: (a: any, o: any) => any
    defaultValue?: DV
    coercion?: any
    aliases?: any
    deprecatedAliases?: any
    deprecated?: any
    resolve?: (a: any, o: any) => any
    resolveMany?: (a: any, o: any) => any
   }) {
    this.optionKey = opts.optionKey;
    this.defaultValue = opts.defaultValue;
  }

  static register<OK, DV>(opts: {
    optionKey: OK;
    type: (a: any, o: any) => any
    defaultValue?: DV
    coercion?: any
    aliases?: any
    deprecatedAliases?: any
    deprecated?: any
    resolve?: (a: any, o: any) => any
    resolveMany?: (a: any, o: any) => any
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

class Coerce {
  static readPreference () {}
  static number () {}
  static boolean () {}
  static string () {}
  static buffer () {}
  static tags () {}
  static urlEncoded () {}
  static enum (x: any, o: { ignoreCase: boolean }) {
    return () => {}
  }
}


const Options = [
  MongoOption.register({
    optionKey: 'j',
    type: Coerce.boolean,
    aliases: ['journal'],
    defaultValue: false,
    coercion: Coerce.boolean
  }),
  MongoOption.register({
    optionKey: 'tls',
    type: Coerce.boolean,
    deprecatedAliases: ['ssl'],
    defaultValue: false,
    coercion: Coerce.boolean
  }),
  MongoOption.register({
    optionKey: 'socketTimeoutMS',
    type: Coerce.number,
    defaultValue: 360000,
    coercion: Coerce.number
  }),
  MongoOption.register({
    optionKey: 'poolSize',
    aliases: ['maxPoolSize'],
    defaultValue: 5,
    type: Coerce.number,
  }),
  MongoOption.register({
    optionKey: { auth: 'user' },
    aliases: { auth: 'username'},
    type: Coerce.string,
  }),
  MongoOption.register({
    optionKey: { auth: 'pass' },
    aliases: { auth: [ 'pass', 'password ']},
    type: Coerce.urlEncoded,
  }),
  MongoOption.register({
    optionKey: 'readPreferenceTags',
    type: Coerce.tags
  }),
  MongoOption.register({
    optionKey: 'readPreference',
    type: Coerce.readPreference,
    resolve: ({ parsedValue, parsedOptions }) => {
      // adds tags to readPreference
      const value = parsedValue
      value.tags = parsedOptions.readPreferenceTags
      return value
    }
  }),
  MongoOption.register({
    optionKey: 'authSource',
    aliases: [{ auth: ['db', 'database' ]}],
    type: Coerce.string,
    resolveMany: ({ parsedValue, optionKey}) => ({
      [optionKey]: parsedValue,
      defaultDatabase: parsedValue || 'test'
    })
  }),
  MongoOption.register({
    optionKey: 'authMechanism',
    defaultValue: authMechanism.DEFAULT,
    type: Coerce.enum(authMechanism, { ignoreCase: false })
  }),
  MongoOption.register({
    optionKey: 'compression',
    type: Coerce.enum(compression, { ignoreCase: false })
  }),
  MongoOption.register({
    optionKey: 'ca',
    optionKey: ['sslCA'],

    type: Coerce.enum(compression, { ignoreCase: false })
  })
]

//   static ca = MongoOption.register({
//     optionKey: ['sslCA'],
//     deprecated: 'use tlsCAFile'
//     type: Coerce.buffer
//   })

//   static readPreferenceTags = MongoOption.register({
//     optionKey: ['readPreferenceTags'],
//     type: Coerce.tags
//   })

//   static caFile = MongoOption.register({
//     optionKey: ['tlsCAFile'],
//     type: Coerce.string
//   })
// }

// type MongoExternalOptions<T> = any
// type MongoInternalOptions<T> = any

// type Options = MongoExternalOptions<typeof MongoOptions>
// type ParsedOptions = MongoInternalOptions<typeof MongoOptions>

// function parse (opt: Options): ParsedOptions {

// }

