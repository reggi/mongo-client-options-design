
class Coercion {
    static boolean(value: boolean): boolean | undefined {
        if (value === true) return value
        if (value === false) return value
        return undefined
    }
    static booleanFromWord(opt: { ignoreCase: boolean }) {
        return (value: string): boolean | undefined => {
            if (typeof value !== 'string') return undefined
            if (opt.ignoreCase) {
                if (value.match(/^true$/i)) return true
                if (value.match(/^false$/i)) return false
            } else {
                if (value.match(/^true$/)) return true
                if (value.match(/^false$/)) return false
            }
            return undefined
        }
    }
    static booleanFromString (value: string) {
        if (typeof value === 'string') return true
        return false
    }
    static bool = [
        Coercion.boolean,
        Coercion.booleanFromWord({ ignoreCase: true }),
        Coercion.booleanFromString
    ]
}

// class MongoOptions {
//     static journal = MongoOption.boolean('journal')
//     static slaveOk = MongoOption.boolean('slaveOk', 'slave_ok')
//     static tls = MongoOption.boolean('tls', 'ssl')

// }

class Opt {
    static bool (...keys: string[]) {
        return new MongoOption()
    }
    static alias (...keys: string[]) {
        return {
            of: (existing) => {},
            prefer: (existing) => {}
        }
    }
}

class Alias {
    static of (a: any) {}
}

class Deprecated {
    static of (a: any) {}

    static get alias () {
        return class extends Deprecated{
            alias: true
        }
    }
}

const authMechanisms = [
    'GSSAPI',
    'MONGODB-AWS',
    'MONGODB-X509',
    'MONGODB-CR',
    'DEFAULT',
    'SCRAM-SHA-1',
    'SCRAM-SHA-256',
    'PLAIN'
]

const userRequiredAuthMechanisms = [
    'GSSAPI',
    'MONGODB-CR',
    'PLAIN',
    'SCRAM-SHA-1',
    'SCRAM-SHA-256'
]

class MongoOptions {
    static journal =  Opt
      .booleanFromString
      .booleanFromWord
      .booleanFromLetter
      .boolean
      .alias('j')
      .key('journal')

    static j = Opt
      .aliasOf(MongoOptions.journal)
      .key('j')

    static tls = Opt.
      .booleanFromString
      .booleanFromWord
      .booleanFromLetter
      .boolean
      .aliases('ssl', 'tlsCAFile', 'tlsCertificateKeyFile')
      .key('tls')

    static tlsCertificateKeyFilePassword = Opt
      .string
      .key('tlsCertificateKeyFilePassword')

    static tlsInsecure = Opt
      .boolean
      .booleanFromString
      .booleanFromWord
      .booleanFromLetter
      .key('tlsInsecure')

    static checkServerIdentity = Opt
      .function
      .functionNoop
      .key('checkServerIdentity')

    static auth = Opt
      .object(class {
        static user = Opt
          .string
          .key('user')

        static username = Opt
          .internal
          .aliasOf(MongoOptions.auth.user)
          .key('username')

      })
      .key('auth')

    static ssl = Opt
      .deprecated
      .aliasOf(MongoOptions.tls)
      .key('ssl')

    static sslValidate = Opt
      .deprecated
      .booleanFlexable
      .negateIf(MongoOptions.tlsInsecure)
      .key('sslValidate')

    static sslPass = Opt
      .internal
      .aliasOf(MongoOptions.tlsCertificateKeyFilePassword)
      .key('sslPass')

    static authMechanism = Opt
      .enum(authMechanisms)
      .subsetRequireSibling(userRequiredAuthMechanisms, MongoOptions.auth.user)
      .key('authMechanism')

}









