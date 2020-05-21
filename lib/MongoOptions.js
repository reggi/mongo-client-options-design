'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.MongoOptions = void 0;
const types_1 = require('./types');

class MongoOptions {
  constructor() {
    // URI Server Properties
    this.replicaSet = undefined;
    this.tls = false;
    this.tlsCertificateKeyFile = undefined;
    this.tlsCertificateKeyFilePassword = undefined;
    this.tlsCAFile = undefined;
    this.tlsAllowInvalidCertificates = false;
    this.tlsAllowInvalidHostnames = false;
    this.tlsInsecure = false;
    this.connectTimeoutMS = 10000;
    this.socketTimeoutMS = 360000;
    this.compressors = [];
    this.zlibCompressionLevel = 0;
    // maxPoolSize: number = 100 // server default
    this.maxPoolSize = 5; // driver default
    this.minPoolSize = 0;
    this.maxIdleTimeMS = undefined;
    this.waitQueueMultiple = undefined;
    this.waitQueueTimeoutMS = undefined;
    this.w = 1;
    this.wtimeoutMS = undefined;
    this.journal = undefined;
    this.readConcernLevel = types_1.ReadConcernLevel.local;
    this.readPreference = undefined;
    this.maxStalenessSeconds = undefined;
    // readPreferenceTags: def.tags(),
    this.authSource = undefined;
    this.authMechanism = types_1.AuthMechanism.DEFAULT;
    this.authMechanismProperties = {
      SERVICE_NAME: undefined,
      CANONICALIZE_HOST_NAME: false,
      SERVICE_REALM: undefined,
    };
    this.gssapiServiceName = undefined;
    this.localThresholdMS = undefined;
    this.serverSelectionTimeoutMS = undefined;
    this.serverSelectionTryOnce = true;
    this.heartbeatFrequencyMS = undefined;
    this.appName = undefined;
    this.retryWrites = true;
    this.uuidRepresentation = undefined;
    this.directConnection = true;
    this.sslValidate = false;
    this.sslCA = undefined;
    this.sslCert = undefined;
    this.sslKey = undefined;
    this.sslPass = undefined;
    this.sslCRL = undefined;
    this.checkServerIdentity = () => {};
    this.autoReconnect = true;
    this.noDelay = true;
    this.keepAlive = true;
    this.keepAliveInitialDelay = 30000;
    this.family = null;
    this.reconnectTries = 30;
    this.reconnectInterval = 1000;
    this.ha = true;
    this.haInterval = 10000;
    this.secondaryAcceptableLatencyMS = 15;
    this.acceptableLatencyMS = 15;
    this.connectWithNoPrimary = false;
    this.wtimeout = undefined;
    this.forceServerObjectId = false;
    this.serializeFunctions = false;
    this.ignoreUndefined = false;
    this.raw = false;
    this.bufferMaxEntries = -1;
    this.pkFactory = undefined;
    this.promiseLibrary = undefined;
    this.loggerLevel = 'error';
    this.logger = undefined;
    this.promoteValues = true;
    this.promoteBuffers = false;
    this.promoteLongs = true;
    this.domainsEnabled = false;
    this.validateOptions = false;
    this.auth = {
      user: undefined,
      pass: undefined,
    };
    this.fsync = false;
    this.numberOfRetries = 5;
    this.monitorCommands = false;
    this.minSize = undefined;
    this.useNewUrlParser = true;
    this.useUnifiedTopology = false;
    // TODO: custom types:
    // autoEncryption: {}
    // driverInfo
  }
}
exports.MongoOptions = MongoOptions;
