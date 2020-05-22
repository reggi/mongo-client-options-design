import { Utility } from './Utility';
import { options } from './options'

type toString = ReturnType<typeof MongoConnectionString.parseString> & Parameters<typeof options.parse>[0]

export class MongoConnectionString {
  static parseString (connectionString: string) {
    return {
      host: ''
    }
  }
  static toString (o: toString) {
    return ""
  }
  static parse (connectionString: string, o: Parameters<typeof options.parse>[0]) {
    const stringOptions = this.parseString(connectionString)
    const stringOptionsParsed = options.parse(stringOptions)
    const optionsParsed = options.parse(o)
    // just like object.assign, warns collisions
    return Utility.assign(stringOptionsParsed, optionsParsed)
  }
}

const o = MongoConnectionString.parse('mongodb://localhost:27017', { tls: true })

const str = MongoConnectionString.toString(o) // mongodb://localhost:27017?tls=true


