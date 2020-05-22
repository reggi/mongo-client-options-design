
export type PlainObject = { [name: string]: any }
export type PlainObjectOf<T> = { [name: string]: T }
export type PlainObjectOfStrings = PlainObjectOf<string>

class ConversionTable {
    static warn: boolean = true
    static shouldThrow: boolean = false
    static resolve(message: string) {
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
    static plainObject(value: any): PlainObject | undefined {
        const valid = value && value.constructor === Object || false;
        if (valid) return value
        return this.resolve(`${value} is not a plain object`)
    }
    static keyStringValue(value: any): PlainObjectOfStrings | undefined {
        if (this.supress.plainObject(value)) {
            const keys = Object.keys(value)
            if (keys.length !== 1) {
                return this.resolve(`${JSON.stringify(value)} is a plainObject with too many key-value pairs`)
            }
            if (typeof value[keys[0]] !== 'string') {
                return this.resolve(`${JSON.stringify(value)} is a key-value pair whose value is not a string`)
            }
            return value
        }
        if (typeof value === 'string') {
            const match = value.match(/(.+):(.+)/)
            if (match) {
                return { [match[1]]: match[2] }
            }
        }
        return this.resolve(`${value} is not a valid keyStringValue`)
    }

    // static plainObjectOfStrings(value: any): PlainObjectOfStrings {
    //     const valid = value && value.constructor === Object || false;
    //     if (!valid) throw new Error('invalid type')



    //     // this.string(value[key])

    //     return Object.keys(value).map(key => )
    // }

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
}



// ConversionTable.plainObjectOfStrings({ meow: true }) // {}
// ConversionTable.plainObjectOfStrings({ meow: 'hello' }) // { meow: 'hello' }



console.log(ConversionTable.throw.keyStringValue('hello:meow')



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