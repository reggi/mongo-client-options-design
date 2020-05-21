import { WriteConcern, AuthMechanismProperties, Auth, ReadPreferenceOption } from './types';
import { Warning } from './Warning';

/**
 * This is an abstract class that guarantees that additions made
 * to a Coerce lib, should be the same in the other. It can also be used
 * to house methods that both classes can use like incorrectType and validateKeys
 */

export abstract class CoerceLib <T> {
  abstract warn(message: string): Warning
  abstract boolean(value: T, key: string): boolean | undefined
  abstract string(value: T, key: string): string | undefined
  abstract number(value: T, key: string): number | undefined
  abstract number(value: T, key: string): number | undefined
  abstract enum <E> (e: E, enumName: string): (value: T, key: string) => E | keyof E | undefined
  abstract arrayOfEnum <E>(e: E, enumName: string): (value: T, key: string) => (E | keyof E)[]
  abstract writeConcern(value: T, key: string): WriteConcern | undefined
  abstract authMechanismProperties(value: T, key: string): Partial<AuthMechanismProperties>
  abstract auth(value: T, key: string): Partial<Auth>
  abstract readPreference(value: T, key: string): ReadPreferenceOption | undefined

  incorrectType (key: string, value: any, type: string) {
    this.warn(`"${key}" with the value of \`${JSON.stringify(value)}\` is not of correct type "${type}"`)
  }

  invalidOption (key: string, value: any, type: string) {
    this.warn(`"${key}" with the type of "${type}" is not a valid option`)
  }

  validateKeys (key: string, value: any, type: string, keys: string[]) {
    Object.keys(value).forEach((k) => {
      if (!keys.includes(k)) {
        this.warn(`"${key} within the object type "${type}" has an unrecognized property \`${JSON.stringify(k)}\``)
      }
    })
  }
}