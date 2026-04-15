require('dotenv').config()

const mongodb_uri = process.env.MONGODB_URI
const port = process.env.PORT || 5001

module.exports = {mongodb_uri, port}