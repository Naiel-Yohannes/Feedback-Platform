const {mongodb_uri} = require('./utils/config')
const mongoose = require('mongoose')
const {info, error} = require('./utils/logger')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const userRouter = require('./controllers/userRoute')
const surveyRouter = require('./controllers/surveyRoute')
const loginRouter = require('./controllers/loginRoute')
const responseRouter = require('./controllers/responseRoute')
const {tokenExtractor} = require('./middleware/auth')
const {errorHandler} = require('./middleware/errorHandler')

const app = express()

mongoose.connect(mongodb_uri, {family: 4}).then(() => {
    info('connected to MongoDb')
}).catch(() => {
    error('failed conntecting to MongoDb')
})

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

app.use(tokenExtractor)

app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/survey', surveyRouter)
app.use('/api/responses', responseRouter)

app.use(errorHandler)

module.exports = app