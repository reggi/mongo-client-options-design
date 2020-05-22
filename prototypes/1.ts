class OptionValidate {
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
    static enum<T extends any>(value: any, e: T): T {
        if (e[value]) return value
        throw new Error('invalid type')
    }
}

class MongoOption<key, T> {
    isDeprecated: boolean = false
    isArrayOf: boolean = false
    key: key
    alias: string | string[] | undefined
    typeName: 'boolean' | 'number' | 'string' | 'strings' | 'enum' | 'uriEncoded'
    runtimeTypeChecker: (v: any, e?: T) => any
    enum?: T
    constructor(
        key: key,
        alias: string | string[] | undefined,
        typeName: 'boolean' | 'number' | 'string' | 'strings' | 'enum' | 'uriEncoded',
        e?: T
    ) {
        this.key = key
        this.typeName = typeName
        this.runtimeTypeChecker = OptionValidate[typeName]
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
    static enum<e>(enumType: e) {
        return <key>(key: key, alias?: string | string[]) => {
            return new this<key, e>(key, alias, 'enum', enumType)
        }
    }
    static object(one?: string | MongoOption<any, any>[], options?: MongoOption<any, any>[]) {
        if (one) {
            return
        }
    }
    static get deprecated() {
        return class extends MongoOption<any, any> {
            isDeprecated = true
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
    ZLUB = 'zlib'
}

class MongoOptions {
    static list = [
        MongoOption.boolean('journal', ['j'])
        MongoOption.deprecated.number('wtimeout', 'wtimeoutms'),
        MongoOption.warn.string('replicaSet'),
        MongoOption.number('connectTimeoutMS'),
        MongoOption.number('maxPoolSize'),
        MongoOption.number('minPoolSize'),
        MongoOption.number('maxIdleTimeMS'),
        MongoOption.number('waitQueueMultiple'),
        MongoOption.number('waitQueueTimeoutMS'),
        MongoOption.uriEncoded('appName'),
        MongoOption.enum(compressor)('compressor'),
        MongoOption.choice.string('compressor', ['snappy', 'zlib']),
        MongoOption.throw.multiple('readPreference', [
            MongoOption.instanceof(ReadPreference),
            MongoOption.choice(['primary', 'primaryPrefered']),
        ])


        MongoOption.enum(authMechanism)('authMechanism')

        MongoOption.function.preferNoOp('checkServerIdentity')
        MongoOption.function.preferUndefined('promiseLibrary')

        MongoOption.strings('readPreferenceTags'),
        MongoOption.boolean('directConnection')
    ] as const
    static validate(options: OptionsFromList<typeof MongoOptions.list>) {

    }
}


(undefined | function)


MongoOptions.define('ssl', [

    MongoOption.type.presenceOf(['tlsCAFile', 'tlsCertificateKeyFile', 'tlsCertificateKeyFilePassword']),
    MongoOption.type.boolean()
])

MongoOption.deprecateAlias.string('tlsCAFile', 'sslCA')
MongoOption.deprecateAlias.string('tls', 'ssl')


class MongoOption {
    key: string
    constructor(
        key: string
    ) {
        this.key = key
    }
}

class MongoOptions {
    constructor(options: )
}











// works!
MongoOptions.validate({
    journal: true,
    replicaSet: 'hello-world'
    compressor: ''
})

// breaks types
MongoOptions.validate({
    journal: 1,
    replicaSet: true
})



// class Option {
//     static boolean(a: any) {

//     }
// }

// class Options {
//     static create(a: any, b: Option[]) {

//     }
// }

// const MongoOptions = Options.create([
//     Option.boolean('journal', 'j'),
//     Option.deprecated.number('wtimeout', 'wtimeoutms'),
//     Option.string('replicaSet'),
//     Option.number('connectTimeoutMS'),
//     Option.number('maxPoolSize'),
//     Option.number('minPoolSize'),
//     Option.number('maxIdleTimeMS'),
//     Option.number('waitQueueMultiple'),
//     Option.number('waitQueueTimeoutMS'),
//     Option.object('auth', [
//         Option.string('user'),
//         Option.string('pass'),
//     ])),
//     Option.strings('readPreferenceTags'),
//     Option.boolean('directConnection')
// ])



// MongoOptions.validate({
//     journal: true
//  })
