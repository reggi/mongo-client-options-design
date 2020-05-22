// URI Options

// https://docs.mongodb.com/manual/reference/connection-string/#replica-set-option
export const replicaSet = 'replicaSet';

// https://docs.mongodb.com/manual/reference/connection-string/#connection-options
export const tls = 'tls';
export const ssl = 'ssl';
export const tlsCertificateKeyFile = 'tlsCertificateKeyFile';
export const tlsCertificateKeyFilePassword = 'tlsCertificateKeyFilePassword';
export const tlsCAFile = 'tlsCAFile';
export const tlsAllowInvalidCertificates = 'tlsAllowInvalidCertificates';
export const tlsAllowInvalidHostnames = 'tlsAllowInvalidHostnames';
export const tlsInsecure = 'tlsInsecure';

// https://docs.mongodb.com/manual/reference/connection-string/#timeout-options
export const connectTimeoutMS = 'connectTimeoutMS';
export const socketTimeoutMS = 'socketTimeoutMS';

// https://docs.mongodb.com/manual/reference/connection-string/#compression-options
export const compressors = 'compressors';
export const zlibCompressionLevel = 'zlibCompressionLevel';

export enum Compressor {
  snappy = 'snappy',
  zlib = 'zlib',
  zstd = 'zstd'
}

// https://docs.mongodb.com/manual/reference/connection-string/#connection-pool-options
export const maxPoolSize = 'maxPoolSize';
export const minPoolSize = 'minPoolSize';
export const maxIdleTimeMS = 'maxIdleTimeMS';
export const waitQueueMultiple = 'waitQueueMultiple';
export const waitQueueTimeoutMS = 'waitQueueTimeoutMS';

// https://docs.mongodb.com/manual/reference/connection-string/#write-concern-options
export const w = 'w';
export const wtimeoutMS = 'wtimeoutMS';
export const journal = 'journal';

// https://docs.mongodb.com/manual/reference/write-concern/#j-option
export const j = 'j'

// https://docs.mongodb.com/manual/reference/connection-string/#readconcern-options
export const readConcernLevel = 'readConcernLevel';

export enum ReadConcernLevelOption {
  local = 'local',
  majority = 'majority',
  linearizable = 'linearizable',
  available = 'available'
};

// https://docs.mongodb.com/manual/reference/connection-string/#read-preference-options
export const readPreference = 'readPreference';
export const maxStalenessSeconds = 'maxStalenessSeconds';
export const readPreferenceTags = 'readPreferenceTags';

export enum ReadPreferenceMode {
  primary = 'primary',
  primaryPreferred = 'primaryPreferred',
  secondary = 'secondary',
  secondaryPreferred = 'secondaryPreferred',
  nearest = 'nearest'
};

// https://docs.mongodb.com/manual/reference/connection-string/#authentication-options
export const authSource = 'authSource';
export const authMechanism = 'authMechanism';
export const authMechanismProperties = 'authMechanismProperties';
export const gssapiServiceName = 'gssapiServiceName';

export enum AuthMechanism {
  'GSSAPI' = 'GSSAPI',
  'MONGODB-AWS' = 'MONGODB-AWS',
  'MONGODB-X509' = 'MONGODB-X509',
  'MONGODB-CR' = 'MONGODB-CR',
  'DEFAULT' = 'DEFAULT',
  'SCRAM-SHA-1' = 'SCRAM-SHA-1',
  'SCRAM-SHA-256' = 'SCRAM-SHA-256',
  'PLAIN' = 'PLAIN'
}

export enum UserRequiredAuthMechanism {
  'GSSAPI' = AuthMechanism['GSSAPI'],
  'MONGODB-CR' = AuthMechanism['MONGODB-CR'],
  'PLAIN' = AuthMechanism['PLAIN'],
  'SCRAM-SHA-1' = AuthMechanism['SCRAM-SHA-1'],
  'SCRAM-SHA-256' = AuthMechanism['SCRAM-SHA-256']
}

interface AuthMechanismProperties {
  SERVICE_NAME: string
  CANONICALIZE_HOST_NAME: string
  SERVICE_REALM: string
};

// https://docs.mongodb.com/manual/reference/connection-string/#server-selection-and-discovery-options
export const localThresholdMS = 'localThresholdMS'
export const serverSelectionTimeoutMS = 'serverSelectionTimeoutMS'
export const serverSelectionTryOnce = 'serverSelectionTryOnce'
export const heartbeatFrequencyMS = 'heartbeatFrequencyMS'

// https://docs.mongodb.com/manual/reference/connection-string/#miscellaneous-configuration

export const appName = 'appName'
export const retryWrites = 'retryWrites'
export const uuidRepresentation = 'uuidRepresentation'

export enum UuidRepresentationOption {
  standard = "standard",
  csharpLegacy = "csharpLegacy",
  javaLegacy = "javaLegacy",
  pythonLegacy = "pythonLegacy"
};

// reusable value types

export enum BooleanValue {
  true = "true",
  false = "false",
};

// URI Options for Server version 4.4

export const directConnection = 'directConnection'

// Client Options

export const poolSize = 'poolSize'
