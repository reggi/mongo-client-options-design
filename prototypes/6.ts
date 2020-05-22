

class Opt {
    static boolean (...keys: string[]) {
        return new MongoOption()
    }
    static alias (...keys: string[]) {
        return {
            of: (existing) => {},
            prefer: (existing) => {}
        }
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
    static flexBoolean = [
        Coercion.boolean,
        Coercion.booleanFromWord({ ignoreCase: true })
    ]
}

class MongoOptions {
    static journal = MongoOption.boolean('journal')
    static slaveOk = MongoOption.boolean('slaveOk', 'slave_ok')
    static tls = MongoOption.boolean('tls', 'ssl')

}

class MongoOptions {
    static j = MongoOptions.journal
    static journal = Opt.alias('j').type(Coercion.boolean)
}


return MongoOption
.load(value, options)
.key('journal')
.alias('j')
.coercion()




