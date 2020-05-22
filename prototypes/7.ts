class Utils {
    static warn (message) {
        console.warn(message)
    }
    static find (options: any, ...keys: string[]) {
        const viable = keys.reduce((acq, key) => {
            if (options && options[key]) {
                acq.push([key, options[key]])
            }
            if (options && options[key.toLowerCase()]) {
                const k = key.toLowerCase()
                acq.push([k, options[k]])
            }
            return acq
        }, [])
        if (viable.length === 0) return undefined
        const key = viable[0]
        const value = viable[1]
        viable.shift().forEach(opt => {
            Utils.warn(`ignoring alias option ${opt} in favor of ${key}`)
        })
        return value
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


class MongoOptions {
    static journal(options: {
        journal: string | boolean,
        j: string | boolean
    }): boolean | undefined {


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
}


MongoOptions.journal()





