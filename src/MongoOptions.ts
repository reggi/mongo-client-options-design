import {
  Compressor,
  ReadConcernLevel,
  ReadPreference,
  ReadPreferenceMode,
  AuthMechanism,
  AuthMechanismProperties,
  ReadConcern,
  Auth
} from './types';

export class MongoOptions {
  // URI Server Properties
  replicaSet: string | undefined = undefined
  tls: boolean = false
  ssl: MongoOptions['tls'] // don't assign default value for values for aliases, or will-be getters internally
  tlsCertificateKeyFile: string | undefined = undefined
  tlsCertificateKeyFilePassword: string | undefined = undefined
  tlsCAFile: string | undefined = undefined
  tlsAllowInvalidCertificates: boolean = false
  tlsAllowInvalidHostnames: boolean = false
  tlsInsecure: boolean = false
  connectTimeoutMS: number = 10000
  socketTimeoutMS: number = 360000
  compressors: (keyof typeof Compressor)[] = []
  zlibCompressionLevel: number = 0
  // maxPoolSize: number = 100 // server default
  maxPoolSize: number = 5 // driver default
  minPoolSize: number = 0
  maxIdleTimeMS: number | undefined = undefined
  waitQueueMultiple: number | undefined = undefined
  waitQueueTimeoutMS: number | undefined = undefined
  w: number | 'majority' = 1
  wtimeoutMS: number | undefined = undefined
  journal: boolean | undefined = undefined
  j: MongoOptions['journal'] // don't assign default value for values for aliases, or will-be getters internally
  readConcernLevel: keyof typeof ReadConcernLevel = ReadConcernLevel.local
  readPreference: ReadPreference | keyof typeof ReadPreferenceMode | undefined = undefined
  maxStalenessSeconds:  number | undefined = undefined
  // readPreferenceTags: def.tags(),
  authSource: string | undefined = undefined
  authMechanism: AuthMechanism = AuthMechanism.DEFAULT
  authMechanismProperties: Partial<AuthMechanismProperties> = {
    SERVICE_NAME: undefined,
    CANONICALIZE_HOST_NAME: false,
    SERVICE_REALM: undefined
  }
  gssapiServiceName:  string | undefined = undefined
  localThresholdMS:  number | undefined = undefined
  serverSelectionTimeoutMS:  number | undefined = undefined
  serverSelectionTryOnce: boolean = true
  heartbeatFrequencyMS:  number | undefined = undefined
  appName: string | undefined = undefined
  retryWrites: boolean = true
  uuidRepresentation: ReadConcernLevel | undefined = undefined
  directConnection: boolean = true

  // Driver Specific
  poolSize: MongoOptions['maxPoolSize'] // don't assign default value for values for aliases, or will-be getters internally
  sslValidate: boolean = false
  sslCA: Buffer | undefined = undefined
  sslCert: Buffer | undefined = undefined
  sslKey: Buffer | undefined = undefined
  sslPass: Buffer | undefined = undefined
  sslCRL: Buffer | undefined = undefined
  checkServerIdentity: Function = () => {}
  autoReconnect: boolean = true
  auto_reconnect: MongoOptions['autoReconnect']  // don't assign default value for values for aliases, or will-be getters internally
  noDelay: boolean = true
  keepAlive: boolean = true
  keepAliveInitialDelay: number = 30000
  family: 4 | 6 | null = null
  reconnectTries: number = 30
  reconnectInterval: number = 1000
  ha: boolean = true
  haInterval: number = 10000
  secondaryAcceptableLatencyMS: number = 15
  acceptableLatencyMS: number = 15
  connectWithNoPrimary: boolean = false
  wtimeout: number | undefined = undefined
  forceServerObjectId: boolean = false
  serializeFunctions: boolean = false
  ignoreUndefined: boolean = false
  raw: boolean = false
  bufferMaxEntries: number = -1
  pkFactory: object | undefined = undefined
  promiseLibrary: Function | undefined = undefined
  readConcern: Partial<ReadConcern> // don't assign default value for values for aliases, or will-be getters internally
  loggerLevel: 'error' | 'warn' | 'info' | 'debug' = 'error'
  logger: object | undefined = undefined
  promoteValues: boolean = true
  promoteBuffers: boolean = false
  promoteLongs: boolean = true
  domainsEnabled: boolean = false
  validateOptions: boolean = false
  appname: MongoOptions['appName'] // don't assign default value for values for aliases, or will-be getters internally
  auth: Partial<Auth> = {
    user: undefined,
    pass: undefined
  }
  fsync: boolean = false
  numberOfRetries: number = 5
  monitorCommands: boolean = false
  minSize: number | undefined = undefined
  useNewUrlParser: boolean = true
  useUnifiedTopology: boolean = false
  compression: keyof typeof Compressor | undefined // don't assign default value for values for aliases, or will-be getters internally
  // TODO: custom types:
  // autoEncryption: {}
  // driverInfo
}

