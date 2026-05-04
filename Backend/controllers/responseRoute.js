const responseRouter = require('express').Router()
const {userExtractor, requireRole} = require('../middleware/auth')
const Survey = require('../modules/survey')
const Response = require('../modules/response')

responseRouter.get('/survey/:id', userExtractor, requireRole('coordinator'), async(req, res, next) => {
    try{
        const surveyId = req.params.id

        const survey = await Survey.findOne({_id: surveyId, owner: req.user._id})

        if(!survey){
            return res.status(404).json({error: 'This survey does not exist'})
        }

        const responses = await Response.find({surveyId: survey._id})

        res.status(200).json(responses)
    }catch(err){
        next(err)
    }
})

responseRouter.post('/', userExtractor, requireRole('member'), async(req, res, next) => {
    try{
        const {surveyId, questionId, selectedOption} = req.body

        if (!surveyId || !questionId || selectedOption === undefined) {
            return res.status(400).json({ error: 'Missing content' })
        }

        const survey = await Survey.findOne({_id: surveyId})

        if(!survey){
            return res.status(404).json({error: 'Survey not found'})
        }

        if(survey.status !== 'open'){
            return res.status(400).json({error: 'This survey is not open'})
        }

        const question = survey.questions.find(q => q._id.toString() === questionId.toString())

        if(!question){
            return res.status(400).json({error: 'Question not found in this survey'})
        }

        if(typeof selectedOption !== 'number'){
            return res.status(400).json({error: 'Selected option must send a number'})
        }

        if(!Number.isInteger(selectedOption) || selectedOption < 0 || selectedOption >= question.options.length){
            return res.status(400).json({error: 'Invalid option index'})
        }

        const exists = await Response.findOne({surveyId, submittedBy: req.user._id})

        if(exists){
            return res.status(409).json({error: 'You cant take one survey more than once'})
        }

        const response = new Response({
            surveyId,
            submittedBy: req.user._id,
            answers: [{questionId, selectedOption}]
        })

        const newResponse = await response.save()
        res.status(201).json(newResponse)
    }catch(err){
        next(err)
    }
})

module.exports = responseRouter