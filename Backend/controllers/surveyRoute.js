const surveyRouter = require('express').Router()
const Survey = require('../modules/survey')
const { userExtractor, requireRole } = require('../middleware/auth')
const Response = require('../modules/response')

const VALID_STATUSES = ['closed', 'open', 'draft']

surveyRouter.get('/', userExtractor, async (req, res, next) => {
  try {
    if (req.user.role === 'coordinator') {
      const surveys = await Survey.find({ owner: req.user._id })
      return res.status(200).json(surveys)
    }

    if (req.user.role === 'member') {
      const surveys = await Survey.find({ status: { $ne: 'draft' } })
      return res.status(200).json(surveys)
    }

    return res.status(403).json({ error: 'Forbidden' })
  } catch (error) {
    next(error)
  }
})

surveyRouter.get('/:id', userExtractor, async (req, res, next) => {
  try {
    const id = req.params.id
    const survey = await Survey.findById(id)
    if (!survey) return res.status(404).json({ error: 'survey not found' })

    if (req.user.role === 'coordinator') {
      if (survey.owner.toString() === req.user._id.toString()) {
        return res.status(200).json(survey)
      }
      return res.status(403).json({ error: 'Forbidden' })
    }

    if (req.user.role === 'member') {
      if (survey.status !== 'draft') {
        return res.status(200).json(survey)
      }
      return res.status(403).json({ error: 'Forbidden' })
    }

    return res.status(403).json({ error: 'Forbidden' })
  } catch (error) {
    next(error)
  }
})

surveyRouter.post('/', userExtractor, requireRole('coordinator'), async (req, res, next) => {
  try {
    const { title, description, status, prompt, options } = req.body

    if (!title || !status || !prompt || !options) {
      return res.status(400).json({ error: 'Missing content' })
    }

    if (typeof prompt !== 'string' || !Array.isArray(options) || typeof status !== 'string' || typeof title !== 'string') {
      return res.status(400).json({ error: 'Wrong format' })
    }

    if (title.length < 10) {
      return res.status(400).json({ error: 'title should have at least 10 chars' })
    }

    if (description !== undefined && typeof description !== 'string') {
      return res.status(400).json({ error: 'Wrong format' })
    }

    if (description !== undefined && description.length < 10) {
      return res.status(400).json({ error: 'description should have at least 10 chars' })
    }

    if (prompt.length < 5) {
      return res.status(400).json({ error: 'prompt should have at least 5 chars' })
    }

    if (prompt.trim() === '') {
      return res.status(400).json({ error: 'Prompt should have content inside it' })
    }

    if (!VALID_STATUSES.includes(status.toLowerCase())) {
      return res.status(400).json({ error: 'Wrong status entered' })
    }

    if (!options.every(opt => typeof opt === 'string' && opt.trim().length > 0)) {
      return res.status(400).json({ error: 'Options must be non-empty strings' })
    }

    const survey = new Survey({
      title,
      description,
      status,
      owner: req.user._id,
      questions: [{ prompt, options }]
    })

    const newSurvey = await survey.save()
    res.status(201).json(newSurvey)
  } catch (error) {
    next(error)
  }
})

surveyRouter.put('/:id', userExtractor, requireRole('coordinator'), async (req, res, next) => {
  try {
    const { title, description, status, prompt, options } = req.body
    const id = req.params.id
    const survey = await Survey.findById(id)
    if (!survey) return res.status(404).json({ error: 'survey not found' })
    
    if (req.user._id.toString() !== survey.owner.toString()) {
      return res.status(403).json({ error: 'You are forbidden from updating this survey' })
    }

    const response = await Response.findOne({surveyId: survey._id})

    if((prompt !== undefined || options !== undefined) && (survey.status !== 'draft' || response)){
        return res.status(403).json({error: 'Survey can only be edited while in draft and with no responses'})
    }

    const updatedSurvey = {}

    if (title !== undefined) {
      if (typeof title !== 'string' || title.length < 10) {
        return res.status(400).json({ error: 'title should have at least 10 chars' })
      }
      updatedSurvey.title = title
    }

    if (description !== undefined) {
      if (typeof description !== 'string' || description.length < 10) {
        return res.status(400).json({ error: 'description should have at least 10 chars' })
      }
      updatedSurvey.description = description
    }

    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status.toLowerCase())) {
        return res.status(400).json({ error: 'Wrong status entered' })
      }
      updatedSurvey.status = status
    }

    let surveyQuestion = survey.questions && survey.questions.length > 0 ? { ...survey.questions[0] } : null
    if (surveyQuestion) {
      if (prompt !== undefined) {
        if (typeof prompt !== 'string' || prompt.trim().length < 5) {
          return res.status(400).json({ error: 'prompt should have at least 5 chars' })
        }
        surveyQuestion.prompt = prompt
      }
      if (options !== undefined) {
        if (!Array.isArray(options) || !options.every(opt => typeof opt === 'string' && opt.trim().length > 0)) {
          return res.status(400).json({ error: 'Options must be non-empty strings' })
        }
        surveyQuestion.options = options
      }
      updatedSurvey.questions = [surveyQuestion]
    }

    const changedSurvey = await Survey.findByIdAndUpdate(id, { $set: updatedSurvey }, { new: true, runValidators: true })
    res.status(200).json(changedSurvey)
  } catch (error) {
    next(error)
  }
})

surveyRouter.delete('/:id', userExtractor, requireRole('coordinator'), async (req, res, next) => {
  try {
    const id = req.params.id
    const survey = await Survey.findById(id)

    if (!survey){
        return res.status(404).json({ error: 'survey not found' })
    }

    if (req.user._id.toString() !== survey.owner.toString()) {
        return res.status(403).json({ error: 'You are forbidden from deleting this survey' })
    }
    
    await Response.deleteMany({ surveyId: survey._id })
    await Survey.findByIdAndDelete(id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = surveyRouter