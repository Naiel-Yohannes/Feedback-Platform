const testingRoute = require('express').Router()
const pool = require('../db')

testingRoute.post('/reset', async (req, res) => {
    try {
        await pool.query('TRUNCATE TABLE responses, options, questions, surveys, users RESTART IDENTITY CASCADE')
        return res.status(204).end()
    } catch (error) {
        console.error('error:', error.message || error)
        return res.status(204).end()
    }
})

module.exports = testingRoute