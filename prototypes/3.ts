    // static boolean(value: any): boolean | undefined {
    //     if (typeof value === 'boolean') return value
    //     if (value === 'true') return true
    //     if (value === 'false') return false
    //     return this.resolve(`${value} is not a valid boolean`)
    // }

class Options {
    options: any
    constructor(options: any) {
        this.options = options
    }
    fetch(...keys: string[]): any | undefined {
        return keys.reduce((acq, key) => {
            if (acq) return acq
            if (this.options[key]) {
                return this.options[key]
            }
            if (this.options[key.toLowerCase()]) {
                return this.options[key.toLowerCase()]]
            }
        }, undefined)
    }
}


class AltMongoOptions {
    static readConcernLevel(options: any): {

    }

    static readConcern(options: Options): { level: number } {

    }

    static checkServerIdentity(options: Options): function {

    }

    static sslCert(options: Options): string {

    }

    static journal(value: boolean, options: Options): boolean {
        const value = options.findAlias('j')

    }

    static directConnection(value: boolean, options: Options): boolean {
        // const value = options.findalias('directConnection')

    }
}

// warn if alias dual alias present

abstract class MongoOption<Parent extends MongoOption<Parent>> {
    abstract key: string
    abstract aliases: string[]
    abstract type: (...args: any) => any
    abstract static coersion: ((...args: any) => any)[]
    abstract default: any

    parse(value: Parameters<Parent['type']>[0]) {

    }
}

class Coersion {
    static boolean(value: boolean): boolean | undefined {
        if (value === true) return value
        if (value === false) return value
        return undefined
    }
    static booleanFromString(value: string): boolean | undefined {
        if (value.match(/^true$/i) || value.match(/^t$/i)) return true
        if (value.match(/^false$/i) || value.match(/^f$/i)) return false
        return undefined
    }
}

class Journal extends MongoOption<Journal> {
    key = 'journal'
    aliases = ['j']
    coersion = [
        Coersion.boolean,
        Coersion.booleanFromString
    ]
    default = false
}


    // static promiseLibrary(options: Options) {
    //     return options
    //         .fetch('promiseLibrary')
    //         .coersion([
    //             Coersion.function,
    //         ])
    //         .set
    // }

    // static compressors(options: Options) {
    //     return options
    //         .fetch('compressors')
    //         .coersion([
    //             Coersion.require.emum(['snappy' | 'zlib']),
    //         ])
    //         .set
    // }

    // static appName(value: string, options: Options) {

    // }



