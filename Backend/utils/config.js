require('dotenv').config()

const postgres_uri = process.env.NODE_ENV === 'test' ? process.env.POSTGRES_URI_TEST : process.env.POSTGRES_URI
const PORT = process.env.PORT || 5001
const secret = process.env.SECRET

module.exports = {PORT, secret, postgres_uri}