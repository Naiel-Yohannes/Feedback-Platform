const {mongodb_uri} = require('./utils/config')
const mongoose = require('mongoose')
const {info, error} = require('./utils/logger')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

mongoose.connect(mongodb_uri, {family: 4}).then(() => {
    info('connected to MongoDb')
}).catch(() => {
    error('failed conntecting to MongoDb')
})

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

module.exports = app