const testingRoute = require('express').Router()
const Users = require('../modules/user')
const Responses = require('../modules/response')
const Surveys = require('../modules/survey')

testingRoute.post('/reset', async (req, res) => {
    try {
        await Users.deleteMany({})
        await Responses.deleteMany({})
        await Surveys.deleteMany({})
        res.status(204).end()
    } catch (error) {
        res.status(500).json({error: 'Failed to reset database'})
    }
})

module.exports = testingRoute