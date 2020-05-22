export type PlainObject = { [name: string]: any }

class MongoOption<
    Key extends string,
    Alias extends string[],
    Value,
    Coercions extends ((...args: any) => any)[]
> {
    value: Value
    options: PlainObject
    coercions?: Coercions
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

    coercion(coercions: Coercions) {
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
        return coercions.reduce((acq, fn) => {
            if (typeof acq !== 'undefined') return acq
            return fn(val, this.options)
        }, undefined)
    }
}

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
}

class Definitions {
    static journal (value?: string | boolean, options?: any ): boolean | undefined {
        return MongoOption
            .load(value, options)
            .key('journal')
            .alias('j')
            .coercion([
                Coercion.boolean,
                Coercion.booleanFromWord({ ignoreCase: true })
            ])
    }
}

class MongoOptions {
    options: any
    constructor (options: any)  {
        this.options = options
    }
    static parse (options: any) {
        return new MongoOptions(options)
    }
    get journal () {
        return Definitions.journal(undefined, this.options)
    }
}

const options = MongoOptions.parse({ })

options.journal




