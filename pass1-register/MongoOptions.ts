



export class MongoOptions<T> {
  options: T
  constructor (options: T) {
    this.options = options
  }
  static create <T>(t: T) {
    return new MongoOptions<T>(t)
  }
  parse (raw: any) {
    console.log(this.options)
  }
}


// export class OptionsParser {
//   static find (details: {
//     options,
//     key,
//     aliases,
//     deprecatedAliases
//   }) {
//     const { options } = details
//     const keyIsString = typeof details.key === 'string'
//     // perfect match
//     if (options && options[details.key]) return options[details.key]

//     const recursive = (opt) => {
//       Object.keys(opt).reduce((acq, key) => {
//         const value = details[key]
//         if (Utility.isPlainObject(value)) {
//           const recursiveValue = recursive(value)
//           if (recursiveValue.length) acq.push(recursiveValue)
//           return acq
//         }
//         if (key.match(new RegExp(details.key, 'i'))) {
//           acq.push({
//             type: 'key',
//             priority: details.key === key ? 1: -1,
//             matchKey: details.key,
//             actualKey: key,
//             value: value
//           })
//         }
//         details.aliases.forEach(aliases)
//       }, [])
//       return recursive(details.options)
//     }


//     ((acq, key) => {
//       key
//     })

//     const viable = keys.reduce((acq, key) => {
//         if (options && options[key]) {
//             acq.push([key, options[key]])
//         }
//         if (options && options[key.toLowerCase()]) {
//             const k = key.toLowerCase()
//             acq.push([k, options[k]])
//         }
//         return acq
//     }, [])
//     if (viable.length === 0) return undefined
//     const key = viable[0]
//     const value = viable[1]
//     viable.shift().forEach(opt => {
//         Utils.warn(`ignoring alias option ${opt} in favor of ${key}`)
//     })
//     return value
//   }

//   static parse (options: any) {
//     return mongoOptions.reduce((acq: any, mongoOption) => {
//       const { key, aliases, deprecatedAliases } = mongoOption
//       const value = this.find({ options, key, aliases, deprecatedAliases })
//       acq[value] = value
//     }, {})
//   }
// }
