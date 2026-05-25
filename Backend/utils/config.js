require('dotenv').config()

const mongodb_uri = process.env.NODE_ENV==='test' ? process.env.MONGODB_URI_TEST : process.env.MONGODB_URI
const PORT = process.env.PORT || 5001
const secret = process.env.SECRET

module.exports = {mongodb_uri, PORT, secret}