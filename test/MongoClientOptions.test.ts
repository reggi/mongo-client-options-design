import { ReadConcernLevel } from './../src/types';
import { MongoClientOptions } from '../src/MongoClientOptions'
import { expect } from 'chai'

describe('MongoClientOptions', () => {
  it('should demo string with replicaSet', () => {
    [
      // should use value in URI
      new MongoClientOptions('localhost/?rEpLiCaSeT=helloWorld'),
      // should the value in option should overwrite the URI
      new MongoClientOptions('localhost/?rEpLiCaSeT=abc', { replicaSet: 'helloWorld'}),
      // should ignore last option invalid casing
      new MongoClientOptions('localhost/', { replicaSet: 'helloWorld', replicaset: 'abc'})
    ].map(e => {
      expect(e.replicaSet).to.equal('helloWorld')
    })
  });

  it('should demo replicaSet undefined', () => {
    [
      // no replicaSet defined
      new MongoClientOptions('localhost/'),
      // should ignore invalid casing in option
      new MongoClientOptions('localhost/', { rEpLiCaSeT: 'helloWorld'}),
    ].map(e => {
      expect(e.replicaSet).to.equal(undefined)
    })
  });

  it('should demo ssl, tls ', () => {
    // This demos that the last value either SSL or TLS will override the both:
    [
      new MongoClientOptions('localhost/?ssl=true'),
      new MongoClientOptions('localhost/?tls=true'),
      new MongoClientOptions('localhost/', { ssl: true }),
      new MongoClientOptions('localhost/', { tls: true }),
      new MongoClientOptions('localhost/?tls=false&ssl=true'),
      new MongoClientOptions('localhost/?ssl=false&tls=true'),
      new MongoClientOptions('localhost/?ssl=false', { ssl: true }),
      new MongoClientOptions('localhost/?tls=false', { tls: true }),
      new MongoClientOptions('localhost/', { ssl: false, tls: true }),
      new MongoClientOptions('localhost/', { tls: false, ssl: true }),
    ].map(e => {
      expect(e.tls).to.equal(true)
      expect(e.ssl).to.equal(true)
    })
  })

  it('should demo default readConcernLevel', () => {
    [
      new MongoClientOptions('localhost/'),
      new MongoClientOptions('localhost/?READCONCERNLEVEL=local'),
      new MongoClientOptions('localhost/', {readConcernLevel: 'local'}),
      new MongoClientOptions('localhost/', {readConcern: { level: 'local' }}),
    ].map(e => {
      expect(e.readConcernLevel).to.equal(ReadConcernLevel.local)
      expect(e.readConcern.level).to.equal(ReadConcernLevel.local)
    })
  })

  it('should demo non-default readConcernLevel', () => {
    [
      new MongoClientOptions('localhost/?READCONCERNLEVEL=majority'),
      new MongoClientOptions('localhost/?READCONCERNLEVEL=local', {readConcernLevel: 'majority'}),
      new MongoClientOptions('localhost/?READCONCERNLEVEL=INVALID', {readConcernLevel: 'majority'}),
      new MongoClientOptions('localhost/', {readConcernLevel: 'majority'}),
      new MongoClientOptions('localhost/', {readConcernLevel: 'available', readConcern: { level: 'majority' }}),
      // @ts-ignore ------------------------------------------------------------------------------\/
      new MongoClientOptions('localhost/', {readConcernLevel: 'majority', readConcern: { level: 'INVALID' }}),
      new MongoClientOptions('localhost/', {readConcern: { level: 'majority' }}),
    ].map(e => {
      expect(e.readConcernLevel).to.equal(ReadConcernLevel.majority)
      expect(e.readConcern.level).to.equal(ReadConcernLevel.majority)
    })
  })

  it('should demo compression', () => {
    [
      new MongoClientOptions('localhost/?compressors=snappy,zlib'),
      new MongoClientOptions('localhost/?compressors=snappy', {compression: 'zlib'}),
      new MongoClientOptions('localhost/', {compressors: ['snappy'], compression: 'zlib'}),
      new MongoClientOptions('localhost/', {compressors: ['snappy', 'zlib']}),
    ].map(e => {
      expect(e.compressors).to.deep.equal(['snappy', 'zlib'])
    })
  })

  it('should authMechanismProperties', () => {
    [
      new MongoClientOptions('localhost/?authMechanismProperties=SERVICE_NAME:helloWorld'),
      new MongoClientOptions('localhost/', {
        authMechanismProperties: {
          SERVICE_NAME: 'helloWorld',
        }
      }),
      new MongoClientOptions('localhost/?authMechanismProperties=SERVICE_NAME:OVERWRITE', {
        authMechanismProperties: {
          SERVICE_NAME: 'helloWorld'
        }
      }),
    ].map(e => {
      expect(e.authMechanismProperties.SERVICE_NAME).to.equal('helloWorld')
    })
  })

  it('should poolSize', () => {
    [
      new MongoClientOptions('localhost', { poolSize: 100 }),
      new MongoClientOptions('localhost', { maxPoolSize: 100 }),
    ].map(e => {
      expect(e.poolSize).equal(100)
      expect(e.maxPoolSize).equal(100)
    })
  })

  it('should readPreference', () => {
    [
      new MongoClientOptions('localhost/?readpreference=primary'),
      new MongoClientOptions('localhost/', { readPreference: 'primary' }),
      // option read pref not spelled correctly, ignored --------------\/
      new MongoClientOptions('localhost/?readpreference=primary', { readpreference: 'primaryPreferred' }),
    ].map(e => {
      expect(e.readPreference).to.equal('primary')
    })
  })

})