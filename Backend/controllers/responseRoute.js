const responseRouter = require('express').Router()
const {userExtractor, requireRole} = require('../middleware/auth')
const pool = require('../db')

responseRouter.get('/survey/:id', userExtractor, requireRole('coordinator'), async(req, res, next) => {
    try{
        const surveyId = req.params.id

        const survey = await pool.query(
            `
            SELECT * FROM surveys WHERE id = $1 AND creator_id = $2
            `, [surveyId, req.user.id]
        )

        if(survey.rows.length === 0){
            return res.status(404).json({error: 'Survey not found'})
        }

        const response = await pool.query(
            `
            SELECT responses.id, responses.survey_id, responses.option_id, responses.user_id,
                   options.order_index, options.option_text
            FROM responses
            JOIN options ON responses.option_id = options.id
            JOIN surveys ON responses.survey_id = surveys.id
            WHERE surveys.creator_id = $2
            AND surveys.id = $1
            ORDER BY options.order_index
            `, [surveyId, req.user.id]
        )

        

        res.status(200).json({
            no_of_responses: response.rows.length,
            responses: response.rows
        })
    }catch(err){
        next(err)
    }
})

responseRouter.get('/surveys/total', userExtractor, requireRole('coordinator'), async(req, res, next) => {
    try{
        const totalSurveys = await pool.query(
            `
            SELECT surveys.id AS survey_id, COUNT(responses.id) AS count
            FROM surveys
            LEFT JOIN responses ON responses.survey_id = surveys.id
            WHERE surveys.creator_id = $1
            GROUP BY surveys.id
            `, [req.user.id]
        )
        res.status(200).json(totalSurveys.rows)
    }catch(err){
        next(err)
    }
})

responseRouter.post('/', userExtractor, requireRole('member'), async(req, res, next) => {
    const client = await pool.connect()
    try{
        const {surveyId, option_id} = req.body

        if (!surveyId  || option_id === undefined) {
            return res.status(400).json({ error: 'Missing content' })
        }

        const survey = await client.query(
            `
            SELECT * FROM surveys WHERE id = $1
            `, [surveyId]
        )

        if(survey.rows.length === 0){
            await client.query('ROLLBACK')
            return res.status(404).json({error: 'Survey not found'})
        }

        if(survey.rows[0].status !== 'open'){
            await client.query('ROLLBACK')
            return res.status(400).json({error: 'This survey is not open'})
        }

        const question = await client.query(
            `
            SELECT * FROM questions WHERE survey_id = $1
            `, [surveyId]
        )

        if(question.rows.length === 0){
            await client.query('ROLLBACK')
            return res.status(400).json({error: 'Question not found in this survey'})
        }

        if(typeof option_id !== 'number'){
            await client.query('ROLLBACK')
            return res.status(400).json({error: 'Selected option must send a number'})
        }


        const options = await client.query(
            `
            SELECT * FROM options WHERE question_id = $1
            `, [question.rows[0].id]
        )

        const selectedOption = options.rows.find(opt => opt.id === option_id)
        if (!selectedOption) {
            await client.query('ROLLBACK')
            return res.status(400).json({error: 'Invalid option selected'})
        }

        const exists = await client.query(
            `
            SELECT * FROM responses WHERE survey_id = $1 AND user_id = $2
            `, [surveyId, req.user.id]
        )

        if(exists.rows.length !== 0){
            await client.query('ROLLBACK')
            return res.status(409).json({error: 'You cant take one survey more than once'})
        }

        const response = await client.query(
            `
            INSERT INTO responses (survey_id, option_id, user_id)
            VALUES ($1, $2, $3)
            RETURNING *
            `, [surveyId, option_id, req.user.id]
        )
        await client.query('COMMIT')

        res.status(201).json(response.rows[0])
    }catch(err){
        await client.query('ROLLBACK')
        next(err)
    } finally {
        client.release()
    }
})

module.exports = responseRouter