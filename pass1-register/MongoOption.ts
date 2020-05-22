
const example = ['hi', 'bye'] as const

type Values<A extends readonly string[]> = (A)[number]

type x = Values<typeof example>

import {
  OptionKey,
  AliasKeys
} from './types';

type TypeFn = (...any: any) => any

type DefaultArrayType = ['default']
type DefaultFnType = (key: ['default']) => 'default'

export class MongoOption<
  Key extends string,
  Type extends TypeFn,
  Default,
  Aliases extends readonly string[],
  DeprecatedAliases extends readonly string[] = DefaultArrayType,
  Resolve extends TypeFn = DefaultFnType,
  ResolveMany extends TypeFn = DefaultFnType,
  ResolveAsync extends TypeFn = DefaultFnType,
  ResolveManyAsync extends TypeFn = DefaultFnType
> {

    key?: Key
    type?: Type
    default?: Default
    aliases?: Aliases
    deprecatedAliases?: DeprecatedAliases
    resolve?: Resolve
    resolveMany?: ResolveMany
    resolveAsync?: ResolveAsync
    resolveManyAsync?: ResolveManyAsync

    constructor(details: {
      key?: Key,
      type?: Type,
      default?: Default,
      aliases?: Aliases,
      deprecatedAliases?: DeprecatedAliases,
      resolve?: Resolve,
      resolveMany?: ResolveMany,
      resolveAsync?: ResolveAsync,
      resolveManyAsync?: ResolveManyAsync
    }) {
      this.key = details.key
      this.type = details.type
      this.default = details.default
      this.aliases = details.aliases
      this.deprecatedAliases = details.deprecatedAliases
      this.resolve = details.resolve
      this.resolveMany = details.resolveMany
      this.resolveAsync = details.resolveAsync
      this.resolveManyAsync = details.resolveManyAsync
    }

    static register <
      Key extends string,
      Type extends TypeFn,
      Default,
      Aliases extends readonly string[],
      DeprecatedAliases extends readonly string[] = DefaultArrayType,
      Resolve extends TypeFn = DefaultFnType,
      ResolveMany extends TypeFn = DefaultFnType,
      ResolveAsync extends TypeFn = DefaultFnType,
      ResolveManyAsync extends TypeFn = DefaultFnType
    > (details: {
      key?: Key,
      type?: Type,
      default?: Default,
      aliases?: Aliases,
      deprecatedAliases?: DeprecatedAliases,
      resolve?: Resolve,
      resolveMany?: ResolveMany,
      resolveAsync?: ResolveAsync,
      resolveManyAsync?: ResolveManyAsync
    }) {
      return new MongoOption<
        Key,
        Type,
        Default,
        Aliases,
        DeprecatedAliases,
        Resolve,
        ResolveMany,
        ResolveAsync,
        ResolveManyAsync
      >(details)
    }

    fromValue (value: Parameters<Type>[0]) {
      return {
        value: {
          parse: (): ReturnType<Type> => {
            return this.type(value)
          }
        },
        option: {
          parse: (): { [key in Key]: ReturnType<Type> } => {
            return {
              [this.key]: this.type(value)
            } as { [key in Key]: ReturnType<Type> }
          }
        }
      }
    }

    fromOptions (value:
      // { [k in Key]: Parameters<Type>[0] } &
      // { [_ in Values<Aliases>]: Parameters<Type>[0] } &
      DeprecatedAliases extends DefaultArrayType ? undefined : { [_ in Values<DeprecatedAliases>]: Parameters<Type>[0] }
    ) {
      return {
        value: {
          parse: (): ReturnType<Type> => {
            return this.type(value)
          }
        },
        option: {
          parse: (): { [key in Key]: ReturnType<Type> } => {
            return {
              [this.key]: this.type(value)
            } as { [key in Key]: ReturnType<Type> }
          }
        }
      }
    }

    static create <T extends readonly any[]> (opts: T) {
      return opts
    }

    parseValue <T extends readonly any[]> (opts: T) {
      return opts
    }

    parseOptions <T extends readonly any[]> (opts: T) {
      return opts
    }
}