const info = (...parms) => {
    if (process.env.NODE_ENV !== 'test') { 
        console.log(...parms)
    }
}

const error = (...parms) => {
    if (process.env.NODE_ENV !== 'test') { 
        console.error(...parms)
    }
}

module.exports = { info, error }