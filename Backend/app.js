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

app.use(express.json())
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://feedback-platform-pearl.vercel.app"
  ]
}))
app.use(morgan('dev'))

app.use(tokenExtractor)

const pool = require('./db')

app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as time')
    res.json({ status: 'ok', database: 'connected', time: result.rows[0].time })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
})

app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/survey', surveyRouter)
app.use('/api/responses', responseRouter)

if(process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}

app.use(errorHandler)

module.exports = app