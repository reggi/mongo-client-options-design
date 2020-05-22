import { readPreferenceTags } from './options';
import * as assert from 'assert'
import {Coerce} from './Coerce'
import {MongoOptions} from './MongoOptions'
import {MongoOption} from './MongoOption'
import * as Enums from './Enums'

class ReadPreference { tags: string }

export const user = MongoOption.register({
  key: 'user',
  aliases: ['username'],
  type: Coerce.string,
  default: null,
})

export const pass = MongoOption.register({
  key: 'pass',
  aliases: ['password'],
  type: Coerce.utfEncoded,
  default: null,
})

export const auth = MongoOptions.create([ user, pass ])

export const j = MongoOption.register({
  key: 'j',
  aliases: ['journal'],
  type: Coerce.boolean,
  default: false,
})

export const readPreferenceTags = MongoOption.register({
  key: 'readPreferenceTags',
  type: Coerce.tags,
})

export const readPreference = MongoOption.register({
  key: 'readPreference',
  type: Coerce.readPreference,
  resolve: ({ value, parsedOptions, rawOptions }) => {
    const tags = parsedOptions.readPreferenceTags || readPreferenceTags.parse(rawOptions)
    if (tags && value instanceof ReadPreference) value.tags = tags
    return value
  }
})

export const authObj = MongoOption.register({
  key: 'auth',
  type: Coerce.object(auth),
})

export const options = MongoOptions.create([
  j,
  readPreferenceTags,
  readPreference,
  authObj,
])

const results = options.parse({
  joUrnal: true,
  joUrNAl: true,
  journal: true,
  journAl: true,
  Journal: true,
  journaL: true,
  JOURNAL: true,
  j: false,
  J: true,
})

readPreference.parseOptions({ readPreference: 'primary', readPreferenceTags: 'hello:world' })
// {
//   readPreference: ReadPreference { mode: Primary, tags: { hello: 'world'} }
// }

readPreference.parseOptions({ readPreference: 'primary' })
// {
//   readPreference: ReadPreference { mode: Primary }
// }

readPreference.parseValue('primary')
// ReadPreference { mode: Primary }

// auth.parseValue({ user: 'thomas' }) // { user: 'thomas', pass: null }

// authObj.parseValue({ auth: { user: 'thomas' } }) // { auth: { user: 'thomas', pass: null } }

/**
 * The parameters to parse would be typed as well as the results coming out
*/

assert.equal(results.j, false)


// MongoOption.register({
//   key: 'auth',
//   type: Coerce.object(auth),
// }),
// MongoOption.register({
//   key: 'j',
//   aliases: ['journal'],
//   type: Coerce.boolean,
//   default: false,
// }),
// MongoOption.register({
//   key: 'compression',
//   type: Coerce.enum(Enums.compression, 'compression')
// }),
// MongoOption.register({
//   key: 'w',
//   aliases: ['writeConcern'],
//   type: Coerce.writeConcern,
// }),
// MongoOption.register({
//   key: 'autoReconnect',
//   aliases: ['auto_reconnect'],
//   type: Coerce.boolean,
//   default: true
// })