class Util {
  static find (raw: any, keys: string[]): any {
    return 'hi'
  }
}

class Parse {
  static boolean (value: string | boolean) {
    if (value === 'false') return false
    if (value === 'true') return true
    if (value === false) return false
    if (value === true) return true
    throw new Error('')
  }
}

class Stringify {
  static boolean (value: boolean) {
    if (value === false) return 'false'
    if (value === true) return 'true'
    throw new Error('')
  }
}

class Journal extends Option {
  static parse (value: string | boolean | { j?: string | boolean, journal?: string | boolean }) {
    const r = Util.find(value, ['j', 'journal'])
    return { 'j': Parse.boolean(r) }
  }

  static stringify (value: { j?: boolean }) {
    return { 'j': Stringify.boolean(value.j) }
  }
}


Journal.parse('true')
