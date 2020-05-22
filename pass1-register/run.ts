import { MongoOption } from './MongoOption'
import { Coerce } from "./Coerce"

const j = MongoOption.register({
   key: 'j',
   aliases: ['journal'] as const,
   deprecatedAliases: ['journal'] as const,
   type: Coerce.boolean,
   default: false,
})


const x = j.fromValue(true).option.parse()

console.log(j.fromValue('true').option.parse())
console.log(j.fromValue(true).option.parse())

console.log(j.fromValue('true').value.parse())
const s = j.fromValue(true).value.parse()

const vv = j.fromOptions

