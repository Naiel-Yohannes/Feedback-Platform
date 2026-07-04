const {Pool} = require('pg')
const {postgres_uri} = require('./utils/config')
const {info} = require('./utils/logger')

const pool = new Pool({
  connectionString: postgres_uri,
  ...(process.env.NODE_ENV === 'production' ? {
    ssl: {
      rejectUnauthorized: false
    }
  } : {})
})

pool.on('connect', () => {
  info('Connected to PostgreSQL database')
})

pool.on('error', (err) => {
  info('Error connecting to PostgreSQL database')
  info(err)
})

module.exports = pool
