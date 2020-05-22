export type PlainObject = { [name: string]: any }

class MongoOption<
    Key extends string,
    Alias extends string[],
    Value,
    Coersions extends ((...args: any) => any)[]
> {
    value: Value
    options: PlainObject
    coersions?: Coersions
    _key?: Key
    _alias?: Alias
    _deprecate?: string

    constructor(value: Value, options: PlainObject) {
        this.value = value
        this.options = options
    }

    static load<T> (value: T, options: any) {
        return new MongoOption(value, options)
    }

    key(key: Key) {
        this._key = key
        return this
    }

    alias(...alias: Alias) {
        this._alias = alias
        return this
    }

    deprecate(message: string) {
        this._deprecate = message
        return this
    }

    coercion(coersions: Coersions) {
        const resolveValue = () => {
            if (this.value) return this.value
            const possibleKeys: string[] = []
            if (this._key) possibleKeys.push(this._key)
            if (this._alias) possibleKeys.concat(...this._alias)
            return possibleKeys.reduce((acq, key) => {
                if (acq) return acq
                if (this.options && this.options[key]) {
                    return this.options[key]
                }
                if (this.options && this.options[key.toLowerCase()]) {
                    return this.options[key.toLowerCase()]
                }
            }, undefined)
        }
        const val = resolveValue()

        if (val && this._deprecate) console.warn(this._deprecate)
        return coersions.reduce((acq, fn) => {
            if (typeof acq !== 'undefined') return acq
            return fn(val, this.options)
        }, undefined)
    }
}


const authMechanism = [
    'GSSAPI',
    'MONGODB-AWS',
    'MONGODB-X509',
    'MONGODB-CR',
    'DEFAULT',
    'SCRAM-SHA-1',
    'SCRAM-SHA-256',
    'PLAIN'
]

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

    static string(value: any): string | undefined {
        if (typeof value === 'string') return value
        return undefined
    }

    static enum<T extends any>(e: T) {
        return (value: any, options: any): T {
            if (e[value]) return value
            throw new Error('invalid type')
        }
    }

    static authMechRequireUser(extra: { user?: Function, authMechanism?: Function}) {
        return (value?: any, options: any) => {
            const mechanisms = [
                'GSSAPI',
                'MONGODB-CR',
                'PLAIN',
                'SCRAM-SHA-1',
                'SCRAM-SHA-256'
            ]
            const authMechanism = extra.authMechanism ? extra.authMechanism(undefined, options) : value
            const user = extra.user ? extra.user(undefined, options) : value
            const requiresUser = authMechanism && mechanisms.indexOf(authMechanism) === -1
            if (requiresUser && !user) {
                throw new Error(`Username required for mechanism \`${authMechanism}\``);
            }
        }
    }

}



const mongoOption {}



class MongoOptions {




    static journal(value?: string | boolean, options?: any): boolean | undefined {
        return MongoOption
            .load(value, options)
            .key('journal')
            .alias('j')
            .coercion([
                Coercion.boolean,
                Coercion.booleanFromWord({ ignoreCase: true })
            ])
    }

    static j(value?: string | boolean, options?: any): boolean | undefined {
        return MongoOption
            .load(value, options)
            .deprecate('prefer journal')
            .key('j')
            .alias('journal')
            .coercion([
                MongoOptions.journal
            ])
    }

    static get auth() {
        return class {
            static username(value?: string, options?: any): string | undefined {
                return MongoOption
                    .load(value, options && options.auth)
                    .key('username')
                    .alias('user')
                    .coercion([
                        Coercion.string,
                        Coercion.authMechRequireUser({
                            authMechanism: MongoOptions.authMechanism
                        })
                    ])
            }
            static user(value?: string, options?: any): string | undefined {
                return MongoOption
                    .load(value, options && options.auth)
                    .key('user')
                    .alias('username')
                    .coercion([
                        Coercion.string,
                        Coercion.authMechRequireUser({
                            authMechanism: MongoOptions.authMechanism
                        })
                    ])
            }
            static pass(value?: string, options?: any): string | undefined {
                return MongoOption
                    .load(value, options && options.auth)
                    .key('pass')
                    .coercion([
                        Coercion.urlEncodedString
                    ])
            }
        }
    }

    static authMechanism(value?: string | boolean, options?: any): boolean | undefined {
        return MongoOption
            .load(value, options)
            .deprecate('prefer journal')
            .key('j')
            .alias('journal')
            .coercion([
                Coercion.authMechRequireUser({
                    user: MongoOptions.auth.user
                })
            ])
    }

}

console.log(MongoOptions.journal('true'))


MongoOptions.authMechanism('GSSAPI', {})
MongoOptions.auth.user('thomas', {})



    // static tls(value?: string | boolean, options?: any): boolean | undefined {
    //      return MongoOption
    //         .load(value, options)
    //         .key('tls')
    //         .alias('ssl')
    //         .default(false)
    //         .coercion([
    //             Coersion.boolean,
    //             Coersion.booleanFromString,
    //             Coersion.booleanTandem(options, [
    //                 MongoOptions.tlsCAFile,
    //                 MongoOpitons.tlsCertificateKeyFilePassword,
    //                 MongoOptions.tlsCertificateKeyFile
    //             ])
    //         ])
    // }

    // static ssl(value?: string | boolean, options?: any): boolean | undefined {
    //     // alias of tls
    //     return MongoOption
    //         .load(value, options)
    //         .key('ssl')
    //         .deprecate('prefer tls')
    //         .coercion([
    //             MongoOptions.tls
    //         ])
    // }


    // static tlsCAFile(value?: string, options?: any): string | undefined {
    //     // alias of tls
    //     return MongoOption
    //         .load(value, options)
    //         .key('tlsCAFile')
    //         .alias('sslCA', 'tlsCA')
    //         .coercion([
    //             Coersion.string
    //         ])
    // }

    // static checkServerIdentity(value?: boolean | Function, options?: any): Function {
    //     return MongoOption
    //         .load(value, options)
    //         .key('tlscheckServerIdentityCAFile')
    //         .coercion([
    //             Coersion.function
    //             Coersion.final.functioNoOp
    //         ])
    // }

    // static readPreferenceTags(value?: PlainObjectOfStrings[] | PlainObjectOfStrings | string | string[], options?: any): PlainObjectOfStrings | undefined {

    // }

    // static readPreference(value?: ReadPreference | ReadPreferenceString, options?: any): ReadPreference {
    //     return MongoOption
    //         .load(value, options)
    //         .key('readPreference')
    //         .coercion([
    //             Coersion.readPreference({
    //                 tags: MongoOptions.readPreferenceTags(undefined, options),
    //                 hedge: MongoOptions.readPreferenceHedge(undefined, options)
    //             })
    //         ])
    // }

}

// MongoOptions.readPreference(undefined, {})







