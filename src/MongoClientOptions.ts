import { CoerceOptions } from './CoerceOptions';
import * as url from 'url'
import * as querystring from 'querystring'
import { Entry } from './Entry';
import { MongoOptions } from "./MongoOptions"
import { CoerceURI } from './CoerceURI';
import {
  Compressor,
  AuthMechanismProperties,
  ReadConcernLevel,
  AuthMechanism,
  ReadConcern
 } from "./types"

export class MongoClientOptions extends MongoOptions {
  // ----- Overwrite types from MongoOptions for internal typing ------

  authMechanismProperty: AuthMechanismProperties

  // ----- URI-specific aliases -----

  get ssl () {
    return this.tls
  }

  get j () {
    return this.journal
  }

  // ----- Driver-specific aliases -----

  get poolSize () {
    return this.maxPoolSize
  }

  get readConcern () {
    return {
      level: this.readConcernLevel
    }
  }

  get appname () {
    return this.appName
  }

  get auto_reconnect () {
    return this.autoReconnect
  }

  /** Do not use ".compression" use array ".compressors" */
  get compression () {
    // this is an example of an internal deprecation
    throw new Error('internally use compressors')
    return undefined
  }

  // ----- Internal alias variables not allowed in URI or Options -----

  get writeConcern () {
    return this.w
  }

  /**
   * This handler loops over every key in URI query as well as
   * every option in the options object.
   */
  assignOptions (queryOptions: any, options: any) {
    // defining these up here because we don't need to loop these
    const coerceURI = new CoerceURI()
    const coerceOptions = new CoerceOptions()
    // for URI options
    Object.keys(queryOptions).forEach(authoredKey => {
      const value = queryOptions[authoredKey]
      const entry = new Entry({ lib: coerceURI, authoredKey, value })
      this.uriOptions(entry)
    })
    // for options object
    Object.keys(options).forEach(authoredKey => {
      const value = options[authoredKey]
      const entry = new Entry({ lib: coerceOptions, authoredKey, value })
      this.uriOptions(entry)
      this.driverOptions(entry)
    })
  }

  uriOptions (entry: Entry) {
    // OFFICIAL URI Options
    entry.match('replicaSet').toString().assign(this)
    entry.match('ssl').favor('tls').toBoolean().assign(this, 'tls')
    entry.match('tls').toBoolean().assign(this)
    entry.match('tlsCertificateKeyFile').toString().assign(this)
    entry.match('tlsCertificateKeyFilePassword').toString().assign(this)
    entry.match('tlsCAFile').toString().assign(this)
    entry.match('tlsAllowInvalidCertificates').toBoolean().assign(this)
    entry.match('tlsAllowInvalidHostnames').toBoolean().assign(this)
    entry.match('tlsInsecure').toBoolean().assign(this)
    entry.match('connectTimeoutMS').toNumber().assign(this)
    entry.match('socketTimeoutMS').toNumber().assign(this)
    entry.match('compressors').toArrayOfEnum({ Compressor }).concat(this)
    entry.match('zlibCompressionLevel').toNumber().assign(this)
    entry.match('minPoolSize').toNumber().assign(this)
    entry.match('maxPoolSize').toNumber().assign(this)
    entry.match('maxIdleTimeMS').toNumber().assign(this)
    entry.match('waitQueueMultiple').toNumber().assign(this)
    entry.match('waitQueueTimeoutMS').toNumber().assign(this)
    entry.match('w').toWriteConcern().assign(this)
    entry.match('wtimeoutMS').toNumber().assign(this)
    entry.match('journal').toBoolean().assign(this)
    entry.match('j').toBoolean().assign(this, 'journal')
    entry.match('readConcernLevel').toEnum({ ReadConcernLevel }).assign(this)
    entry.match('readPreference').toReadPreference().assign(this)
    entry.match('maxStalenessSeconds').toNumber().assign(this)
    entry.match('authSource').toString().assign(this)
    entry.match('authMechanism').toEnum({ AuthMechanism }).assign(this)
    entry.match('authMechanismProperties').toAuthMechanismProperties().objectAssign(this)
    entry.match('gssapiServiceName').toString().assign(this)
    entry.match('localThresholdMS').toNumber().assign(this)
    entry.match('serverSelectionTimeoutMS').toNumber().assign(this)
    entry.match('serverSelectionTryOnce').toBoolean().assign(this)
    entry.match('heartbeatFrequencyMS').toNumber().assign(this)
    entry.match('appName').toString().assign(this)
    entry.match('retryWrites').toBoolean().assign(this)
    entry.match('uuidRepresentation').notSupported()
    entry.match('directConnection').toBoolean().assign(this)
    entry.uriNoMatch() // if it's not been matched it shouldn't be in the URI
  }

  driverOptions (entry: Entry) {
    // Custom Driver options
    entry.match('auto_reconnect').toBoolean().assign(this, 'autoReconnect')
    entry.match('compression').toEnum({ Compressor }).push(this, 'compressors')
    entry.match('poolSize').toNumber().assign(this, 'maxPoolSize')
    entry.match('appname').toString().assign(this, 'appName')
    entry.match('readConcern').toReadConcern().use(v => {
      if (v.level) this.readConcernLevel = v.level
    })
    entry.match('auth').toAuth().assign(this)
    entry.optionsNoMatch() // if it's not been matched it shouldn't be in options
  }

  // constructor (connectionString, options: Partial<MongoOptions> = {}) {
  constructor (
    connectionString,
    options: Partial<MongoOptions> & { [s: string]: any } = {},
    callback?: (err, v: MongoClientOptions) => any
  ) {
    super()

    const parsedUrl = url.parse(connectionString)

    // Ideally here, add the existing URI parser to add things like hosts and
    // protocol, username, and password from the string database to the options,
    // I left this of this demo, but it would be here the values of which would
    // be attached to `this`. Up for debate whether or not we make it available
    // to the user to add properties like `host(s)` in from the options. That
    // functionality is not hard to add in.

    const queryOptions = parsedUrl.query ? querystring.parse(parsedUrl.query) : {}
    this.assignOptions(queryOptions, options)

    // Now that the options values are "finalized" we can apply checks and
    // change state if we have to. Below would be a list of functions that
    // mutate the state of this object.

    this.resolveReadPreference()
    this.translateTLS()
    this.validateAuth()

    // Here we include any async operations, unlike our current options parser /
    // validator,this allows use to keep this function sync by omitting the
    // callback. The this.freeze method was added to ensure that in the callback
    // case objects aren't being frozen then updated by the async operations.

    if (callback) {
      // example async stuff
      this.resolveTLSFiles((err) => {
        if (err) throw err
        this.DNSCheck((err) => {
          if (err) throw err
          if (callback) {
            this.freeze()
            return callback(err, this)
          }
        })
      })
    } else {
      this.freeze()
    }
  }

  freeze () {
    Object.freeze(this)
    Object.freeze(this.auth)
    Object.freeze(this.authMechanismProperties)
    Object.freeze(this.compressors)
    Object.freeze(this.readPreference)
  }

  translateTLS () {
    if (this.tlsInsecure) {
      this.checkServerIdentity = () => {}
      this.sslValidate = false
    } else {
      this.sslValidate = this.tlsAllowInvalidCertificates
    }
  }

  validateAuth () {
    // do stuff to validate user / password and authMech
  }

  resolveReadPreference () {
    // ensure this.readPreference is an instance of ReadPreference and not a mode string
  }

  resolveTLSFiles (cb) {
    return cb(null)
  }

  DNSCheck (cb) {
    return cb(null)
  }

}
