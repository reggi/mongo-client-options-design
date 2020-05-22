
export type PlainObject = { [name: string]: any }
export type PlainObjectOf<T> = { [name: string]: T }
export type PlainObjectOfStrings = PlainObjectOf<string>


class ConversionPlainObject {
    static warn: boolean = true
    static shouldThrow: boolean = false

    static resolve(type: any, message: string): undefined {
        const m = `${JSON.stringify(type)} ${message}`
        if (this.warn) console.warn(m)
        if (this.shouldThrow) throw new Error(m)
        return undefined
    }

    static plainObject(value: any): PlainObject | undefined {
        const valid = value && value.constructor === Object || false;
        if (valid) return value
        return this.resolve(value, `is not a plain object`)
    }

    static limit(value: any, limit: number): PlainObject | undefined {
        const e = this.plainObject(value)
        if (!e) return e
        if (Object.keys(e).length <= limit) return value
        return this.resolve(value, `is not a not below ${limit}`)
    }

}

Conversion.keyValue('hello:world')


class ConversionTable {
    static warn: boolean = true
    static shouldThrow: boolean = false

    static resolve(message: string): undefined {
        if (this.warn) console.warn(message)
        if (this.shouldThrow) throw new Error(message)
        return undefined
    }

    static get supress() {
        return class extends ConversionTable {
            static warn = false
        }
    }

    static get throw() {
        return class extends ConversionTable {
            static shouldThrow = true
        }
    }

    static boolean(value: any): boolean | undefined {
        if (typeof value === 'boolean') return value
        if (value === 'true') return true
        if (value === 'false') return false
        return this.resolve(`${value} is not a valid boolean`)
    }

    static number(value: any): number | undefined {
        if (typeof value === 'number') return value
        const parse = parseInt(value, 10)
        if (typeof parse === 'number') return parse
        return this.resolve(`${value} is not a number`)
    }

    static string(value: any): string | undefined {
        if (typeof value === 'string') return value
        return this.resolve(`${value} is not a string`)
    }

    static keyValues(value: any): PlainObject {

    }

    // static plainObject(value: any): PlainObject | undefined {
    //     const valid = value && value.constructor === Object || false;
    //     if (valid) return value
    //     return this.resolve(`${value} is not a plain object`)
    // }

    // static plainObjectLimit(value: any, limit: number): PlainObject | undefined {
    //     if (this.plainObject(value)) {
    //         const size = Object.keys(value).length)
    //         if (size >= limit) {
    //             return value
    //         }
    //     }
    //     return this.resolve(`${JSON.stringify(value)} is not a limited plain object`)
    // }

    // static plainObjectOfStrings(value: any): PlainObjectOfStrings {
    //     const obj: PlainObjectOfStrings = {}
    //     Object.keys(value)
    //         .forEach((key: string): void => {
    //             const val = value[key]
    //             const cleanVal = this.supress.string(val)
    //             const ins = { [key]: val }
    //             if (typeof cleanVal !== 'undefined') {
    //                 obj[key] = cleanVal
    //             }
    //             this.resolve(`${JSON.stringify(ins)} does not have a string value`)
    //         })
    //     return obj
    // }

    // static keyStringValue(value: any): PlainObjectOfStrings | undefined {

    //     if (typeof value === 'string') {
    //         const match = value.match(/(.+):(.+)/)
    //         if (match) {
    //             return { [match[1]]: match[2] }
    //         }
    //     }
    //     if (this.plainObject(value)) {
    //         if (this.plainObjectLimit(value, 1)) {
    //             return this.plainObjectOfStrings(value)
    //         }
    //     }
    //     return this.resolve(`${JSON.stringify(value)} is not a valid keyStringValue`)
    // }

    // static arrayOfKeyStringValue(value: any): PlainObjectOfStrings[] | undefined {
    //     if (typeof value === 'string') {
    //         const split = value.split(',')
    //         return this.arrayOfKeyStringValue(split)
    //     }
    //     return value.map((v: any) => {
    //         return this.keyStringValue(v)
    //     })
    //         .filter((v: PlainObjectOfStrings | undefined) => v)
    //         .filter((v: any) => Object.keys(v).length !== 0)
    // }

}

console.log(ConversionTable.arrayOfKeyStringValue([{ hello: true }, 'key:value'])


    // static splitablePlainObjectOfStrings(value: any): PlainObjectOfStrings[] {
    //     if (isPlainObject(value)) return [value]

    //     const parse = (value: any) => {
    //         if (typeof value === 'string') {
    //             return value.split(',').map((tagSet: string) => {
    //                 const splitTag = tagSet.split(':');
    //                 const rel: PlainObjectOfStrings = { [splitTag[0]]: splitTag[1] }
    //                 return rel
    //             })
    //         }
    //         return undefined
    //     }

    //     throw new Error('invalid type')



        // const recourse = (value: any) => {
        //     if (typeof value === 'string') {
        //         return value.split(',').map((tagSet: string) => {
        //             const splitTag = tagSet.split(':');
        //             const rel: PlainObjectOfStrings = { [splitTag[0]]: splitTag[1] }
        //             return rel
        //         })
        //     }
        //     if (Array.isArray(value)) {
        //         return value.map(recourse)
        //     }
        //     return []
        // }

    // }
    // static strings(value: any): string[] {
    //     return value.map(this.string)
    // }
    // static uriEncoded(value: any): string {
    //     return decodeURIComponent(value)
    // }
    // static enum<T extends any>(value: any, e: T): T {
    //     if (e[value] === value) return value
    //     throw new Error('invalid type')
    // }
    // static function(value: any): Function {
    //     if (typeof value === 'function') return value
    //     throw new Error('invalid function')
    // }

// ConversionTable.plainObjectOfStrings({ meow: true }) // {}
// ConversionTable.plainObjectOfStrings({ meow: 'hello' }) // { meow: 'hello' }

// class MongoOption<T> {
//     key: string
//     type: T

//     constructor(args: {
//         key: string
//         type: T
//     }) {
//         this.key = args.key
//         this.type = args.type
//     }

//     static string(key: string) {
//         return new MongoOption(key, 'string')
//     }

//     static object(key: string, options: MongoOption[]) {
//         const type = MongoOptions.create(options)
//         return new MongoOption(key, type)
//     }

// }

// class MongoOptions {
//     options: MongoOption[]
//     constructor(
//         options: MongoOption[]
//     ) {
//         this.options = options
//     }
//     static create(options: MongoOption[]) {
//         return new MongoOptions(options)
//     }
// }

// // const mongoOptions = [
// //     MongoOption.func('promiseLibrary', 1),
// //     MongoOption.union('readPreference', [
// //         ReadPreference,
// //         'primary',
// //         'primaryPreferred',
// //         'secondary',
// //         'secondaryPreferred',
// //         'nearest'
// //     ]),
// //     MongoOption.object('auth', [
// //         MongoOption.string('user'),
// //         MongoOption.string('pass')
// //     ]),
// //     MongoOption.number('keepAliveInitialDelay', 3000),
// //     MongoOption.splitableString('readPreferenceTags')
// // ]


// // // type methods = keyof typeof CoersionTable



