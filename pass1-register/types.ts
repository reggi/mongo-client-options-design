export type PlainObjectOfStrings = { [name: string]: string | PlainObjectOfStrings }
export type PlainObjectOfArrayStrings = { [name: string]: string | string[] | PlainObjectOfStrings | PlainObjectOfArrayStrings }
export type OptionKey = string
export type AliasKeys = string[]
export type Tags = string | PlainObjectOfStrings | (string | PlainObjectOfStrings)[]


