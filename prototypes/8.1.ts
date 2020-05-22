/**
 *
 * 8 is going to have an emphasis on reduction
 * that was a pun,
 * it's going to really consider, not looping to much
 *
 * all the previous iterations loop over the entire options object
 * for each .find, for each property, 30x times!
 *
 *
 */

const options = {
    journal: true,
    joUrnal: true,
    ssl: true,
    ssL: true,
    SSL: true
}

const mapping = {
    'journal': ['journal', 'j'],
    'ssl': ['ssl', 'tls'],
    'tls': ['tls', 'ssl'],
}


const store = Object.assign({}, mapping)
Object.keys(options).reduce((acq, key) => {
    const value = options[key]

    Object.keys(store).reduce((aaa, opts) => {
        const iValue = store[opts]

    })
})







