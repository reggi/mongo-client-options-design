
export class TypeWarning {
  message: string
  constructor (message: string) {
    this.message = message
    console.warn(`Mongo Options Warning: ${this.message}`)
  }
}