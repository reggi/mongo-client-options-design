'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.MAJORITY = exports.ReadPreference = exports.ReadPreferenceMode = exports.UuidRepresentation = exports.ReadConcernLevel = exports.Compressor = exports.UserRequiredAuthMechanism = exports.AuthMechanism = void 0;
var AuthMechanism;
(function (AuthMechanism) {
  AuthMechanism['GSSAPI'] = 'GSSAPI';
  AuthMechanism['MONGODB-AWS'] = 'MONGODB-AWS';
  AuthMechanism['MONGODB-X509'] = 'MONGODB-X509';
  AuthMechanism['MONGODB-CR'] = 'MONGODB-CR';
  AuthMechanism['DEFAULT'] = 'DEFAULT';
  AuthMechanism['SCRAM-SHA-1'] = 'SCRAM-SHA-1';
  AuthMechanism['SCRAM-SHA-256'] = 'SCRAM-SHA-256';
  AuthMechanism['PLAIN'] = 'PLAIN';
})((AuthMechanism = exports.AuthMechanism || (exports.AuthMechanism = {})));

var UserRequiredAuthMechanism;
(function (UserRequiredAuthMechanism) {
  UserRequiredAuthMechanism['GSSAPI'] = 'GSSAPI';
  UserRequiredAuthMechanism['MONGODB-CR'] = 'MONGODB-CR';
  UserRequiredAuthMechanism['PLAIN'] = 'PLAIN';
  UserRequiredAuthMechanism['SCRAM-SHA-1'] = 'SCRAM-SHA-1';
  UserRequiredAuthMechanism['SCRAM-SHA-256'] = 'SCRAM-SHA-256';
})(
  (UserRequiredAuthMechanism =
    exports.UserRequiredAuthMechanism || (exports.UserRequiredAuthMechanism = {}))
);

var Compressor;
(function (Compressor) {
  Compressor['snappy'] = 'snappy';
  Compressor['zlib'] = 'zlib';
  Compressor['zstd'] = 'zstd';
})((Compressor = exports.Compressor || (exports.Compressor = {})));

var ReadConcernLevel;
(function (ReadConcernLevel) {
  ReadConcernLevel['local'] = 'local';
  ReadConcernLevel['majority'] = 'majority';
  ReadConcernLevel['linearizable'] = 'linearizable';
  ReadConcernLevel['available'] = 'available';
})((ReadConcernLevel = exports.ReadConcernLevel || (exports.ReadConcernLevel = {})));
var UuidRepresentation;
(function (UuidRepresentation) {
  UuidRepresentation['standard'] = 'standard';
  UuidRepresentation['csharpLegacy'] = 'csharpLegacy';
  UuidRepresentation['javaLegacy'] = 'javaLegacy';
  UuidRepresentation['pythonLegacy'] = 'pythonLegacy';
})((UuidRepresentation = exports.UuidRepresentation || (exports.UuidRepresentation = {})));
var ReadPreferenceMode;
(function (ReadPreferenceMode) {
  ReadPreferenceMode['primary'] = 'primary';
  ReadPreferenceMode['primaryPreferred'] = 'primaryPreferred';
  ReadPreferenceMode['secondary'] = 'secondary';
  ReadPreferenceMode['secondaryPreferred'] = 'secondaryPreferred';
  ReadPreferenceMode['nearest'] = 'nearest';
})((ReadPreferenceMode = exports.ReadPreferenceMode || (exports.ReadPreferenceMode = {})));
class ReadPreference {}
exports.ReadPreference = ReadPreference;

exports.MAJORITY = 'majority';
