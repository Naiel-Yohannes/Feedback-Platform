const surveyRouter = require('express').Router()
const { userExtractor, requireRole } = require('../middleware/auth')
const pool = require('../db')

const VALID_STATUSES = ['closed', 'open', 'draft']

surveyRouter.get('/', userExtractor, async (req, res, next) => {
  try {
    if (req.user.role === 'coordinator') {
      const surveys = await pool.query(
        `
        SELECT surveys.id AS survey_id, surveys.title AS title, surveys.description, surveys.status AS status, surveys.creator_id AS creator_id, questions.id AS question_id, questions.question AS question, options.id AS option_id, options.option_text AS option
        FROM users
        JOIN surveys ON surveys.creator_id = users.id
        JOIN questions ON questions.survey_id = surveys.id
        JOIN options ON options.question_id = questions.id
        WHERE users.id = $1
        ORDER BY surveys.id, questions.order_index, options.order_index
        `, [req.user.id]
      )
      if(surveys.rows.length === 0) return res.status(200).json({error: 'you dont have any surveys'})

      const surveyRow = {}

      for (const row of surveys.rows) {
        if (!surveyRow[row.survey_id]) {
          surveyRow[row.survey_id] = {
            id: row.survey_id,
            title: row.title,
            description: row.description,
            status: row.status,
            creator_id: row.creator_id,
            questions: {}
          }
        }

        if (!surveyRow[row.survey_id].questions[row.question_id]) {
          surveyRow[row.survey_id].questions[row.question_id] = {
            id: row.question_id,
            prompt: row.question,
            options: []
          }
        }

        surveyRow[row.survey_id].questions[row.question_id].options.push({
          id: row.option_id,
          option_text: row.option
        })
      }

      const result = Object.values(surveyRow).map(survey => ({
        ...survey,
        questions: Object.values(survey.questions)
      }))

      return res.status(200).json(result)
    }

    if (req.user.role === 'member') {
      const surveys = await pool.query(
        `
        SELECT surveys.id AS survey_id, surveys.title AS title, surveys.description, surveys.creator_id, questions.id AS question_id, questions.question AS question, options.id AS option_id, options.option_text AS option
        FROM surveys
        JOIN questions ON questions.survey_id = surveys.id
        JOIN options ON options.question_id = questions.id
        WHERE surveys.status != 'draft'
        ORDER BY surveys.id, questions.order_index, options.order_index
        `
      )
      if(surveys.rows.length === 0) return res.status(200).json({error: 'there arent any surveys to respond to'})
        const surveyRow = {}

        for (const row of surveys.rows) {
          if (!surveyRow[row.survey_id]) {
            surveyRow[row.survey_id] = {
              id: row.survey_id,
              title: row.title,
              description: row.description,
              creator_id: row.creator_id,
              questions: {}
            }
          }

          if (!surveyRow[row.survey_id].questions[row.question_id]) {
            surveyRow[row.survey_id].questions[row.question_id] = {
              id: row.question_id,
              prompt: row.question,
              options: []
            }
          }

          surveyRow[row.survey_id].questions[row.question_id].options.push({
            id: row.option_id,
            option_text: row.option
          })
        }

        const result = Object.values(surveyRow).map(survey => ({
          ...survey,
          questions: Object.values(survey.questions)
        }))

        return res.status(200).json(result)
      }

    return res.status(403).json({ error: 'Forbidden' })
  } catch (error) {
    next(error)
  }
})

surveyRouter.get('/:id', userExtractor, async (req, res, next) => {
  try {
    const id = req.params.id
    const survey = await pool.query(
      `
      SELECT surveys.id AS survey_id, surveys.title AS title, surveys.description, surveys.creator_id, surveys.status, questions.id AS question_id, questions.question AS question, options.id AS option_id, options.option_text AS option
      FROM surveys  
      JOIN questions ON questions.survey_id = surveys.id
      JOIN options ON options.question_id = questions.id
      WHERE surveys.id = $1
      ORDER BY surveys.id, questions.order_index, options.order_index
      `, [id]
    )
    if (survey.rows.length === 0) return res.status(404).json({ error: 'survey not found' })

    if (req.user.role === 'coordinator') {
      if (survey.rows[0].creator_id == req.user.id) {
        const surveyRow = {}

        for (const row of survey.rows) {
          if (!surveyRow[row.survey_id]) {
            surveyRow[row.survey_id] = {
              id: row.survey_id,
              title: row.title,
              description: row.description,
              creator_id: row.creator_id,
              questions: {}
            }
          }

          if (!surveyRow[row.survey_id].questions[row.question_id]) {
            surveyRow[row.survey_id].questions[row.question_id] = {
              id: row.question_id,
              prompt: row.question,
              options: []
            }
          }

          surveyRow[row.survey_id].questions[row.question_id].options.push({
            id: row.option_id,
            option_text: row.option
          })
        }

        const result = Object.values(surveyRow)[0]
        result.questions = Object.values(result.questions)
        return res.status(200).json(result)
      }
      return res.status(403).json({ error: 'Forbidden' })
    }

    if (req.user.role === 'member') {
      if (survey.rows[0].status !== 'draft') {
        const surveyRow = {}

        for (const row of survey.rows) {
          if (!surveyRow[row.survey_id]) {
            surveyRow[row.survey_id] = {
              id: row.survey_id,
              title: row.title,
              description: row.description,
              creator_id: row.creator_id,
              questions: {}
            }
          }

          if (!surveyRow[row.survey_id].questions[row.question_id]) {
            surveyRow[row.survey_id].questions[row.question_id] = {
              id: row.question_id,
              prompt: row.question,
              options: []
            }
          }

          surveyRow[row.survey_id].questions[row.question_id].options.push({
            id: row.option_id,
            option_text: row.option
          })
        }

        const result = Object.values(surveyRow)[0]
        result.questions = Object.values(result.questions)
        return res.status(200).json(result)
      }
      return res.status(403).json({ error: 'Forbidden' })
    }

    return res.status(403).json({ error: 'Forbidden' })
  } catch (error) {
    next(error)
  }
})

surveyRouter.post('/', userExtractor, requireRole('coordinator'), async (req, res, next) => {
  const client = await pool.connect()
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
    await client.query(
      `
      BEGIN
      `
    )

    const survey = await client.query(
      `
      INSERT INTO surveys (title, description, status, creator_id) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
      `, [title, description, status, req.user.id]
    )

    if(survey.rows.length === 0){
      await client.query(`ROLLBACK`)
      return res.status(404).json({error: 'survey not found'})
    }

    const question = await client.query(
      `
      INSERT INTO questions (survey_id, question, order_index)
      VALUES ($1, $2, $3)
      RETURNING *
      `, [survey.rows[0].id, prompt, 0]
    )

    if(question.rows.length === 0) {
      await client.query(`ROLLBACK`)
      return res.status(404).json({error: 'question not found'})
    }

    const optionsToSend = await client.query(
      `
      INSERT INTO options (question_id, option_text, order_index)
      SELECT $1, opt, row_number() OVER () - 1
      FROM unnest($2::text[]) AS opt
      RETURNING *
      `, [question.rows[0].id, options]
    )

    if(optionsToSend.rows.length === 0) {
      await client.query(`ROLLBACK`)
      return res.status(404).json({error: 'options not found'})
    }

    await client.query(`COMMIT`)
    res.status(201).json({
      id: survey.rows[0].id,
      title: survey.rows[0].title,
      description: survey.rows[0].description,
      status: survey.rows[0].status,
      question: question.rows[0].question,
      options: optionsToSend.rows.map(e => ({ id: e.id, option_text: e.option_text }))
    })
  } catch (error) {
    await client.query(`ROLLBACK`)
    next(error)
  } finally {
    client.release()
  }
})

surveyRouter.put('/:id', userExtractor, requireRole('coordinator'), async (req, res, next) => {
  const client = await pool.connect()
  try {
    await client.query(`BEGIN`)
    const { title, description, status, prompt, options } = req.body
    const id = req.params.id
    const survey = await client.query(
      `
      SELECT id, title, description, status, creator_id FROM surveys WHERE id = $1
      `, [id]
    )
    if (survey.rows.length === 0){
      await client.query(`ROLLBACK`)
      return res.status(404).json({ error: 'survey not found' })
    }

    if (req.user.id != survey.rows[0].creator_id) {
      await client.query(`ROLLBACK`)
      return res.status(403).json({ error: 'You are forbidden from updating this survey' })
    }

    const response = await client.query(
      `
      SELECT * FROM responses WHERE survey_id = $1
      `, [id]
    )

    if((prompt !== undefined || options !== undefined) && (survey.rows[0].status !== 'draft' || response.rows.length !== 0)){
      await client.query(`ROLLBACK`)
      return res.status(403).json({error: 'Survey can only be edited while in draft and with no responses'})
    }

    if (title !== undefined) {
      if (typeof title !== 'string' || title.length < 10) {
        await client.query(`ROLLBACK`)
        return res.status(400).json({ error: 'title should have at least 10 chars' })
      }
      await client.query(
        `
        UPDATE surveys SET title = $1 WHERE id = $2
        `, [title, survey.rows[0].id]
      )
    }

    if (description !== undefined) {
      if (typeof description !== 'string' || description.length < 10) {
        await client.query(`ROLLBACK`)
        return res.status(400).json({ error: 'description should have at least 10 chars' })
      }
      await client.query(
        `
        UPDATE surveys SET description = $1 WHERE id = $2
        `, [description, survey.rows[0].id]
      )
    }

    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status.toLowerCase())) {
        await client.query(`ROLLBACK`)    
        return res.status(400).json({ error: 'Wrong status entered' })
      }
      await client.query(
        `
        UPDATE surveys SET status = $1 WHERE id = $2
        `, [status, survey.rows[0].id]
      )
    }

    const question = await client.query(
      `
      SELECT id, question, survey_id FROM questions WHERE survey_id = $1
      `, [survey.rows[0].id]
    )

    if(question.rows.length === 0){
      await client.query(`ROLLBACK`)
      return res.status(404).json({error: 'survey not found'})
    }

    if (prompt !== undefined) {
      if (typeof prompt !== 'string' || prompt.trim().length < 5) {
        await client.query(`ROLLBACK`)
        return res.status(400).json({ error: 'prompt should have at least 5 chars' })
      }
      await client.query(
        `
        UPDATE questions SET question = $1 WHERE id = $2
        `, [prompt, question.rows[0].id]
      )
    }

    const optionsToSend = await client.query(
      `
      SELECT id, option_text, question_id FROM options WHERE question_id = $1
      `, [question.rows[0].id]
    )

    if(optionsToSend.rows.length === 0){
      await client.query(`ROLLBACK`)
      return res.status(404).json({error: 'survey not found'})
    }

    if (options !== undefined) {
      if (!Array.isArray(options) || !options.every(opt => typeof opt === 'string' && opt.trim().length > 0)) {
        await client.query(`ROLLBACK`)
        return res.status(400).json({ error: 'Options must be non-empty strings' })
      }
      await client.query(
        `DELETE FROM options WHERE question_id = $1`, [question.rows[0].id]
      )
      await client.query(
        `INSERT INTO options (question_id, option_text, order_index)
        SELECT $1, opt, row_number() OVER () - 1
        FROM unnest($2::text[]) AS opt`,
        [question.rows[0].id, options]
      )
    }

    
    const fullSurvey = await client.query(
      `
      SELECT surveys.id AS survey_id, surveys.title AS title, surveys.description, surveys.creator_id, surveys.status, questions.id AS question_id, questions.question AS question, options.id AS option_id, options.option_text AS option
      FROM surveys
      JOIN questions ON questions.survey_id = surveys.id
      JOIN options ON options.question_id = questions.id
      WHERE surveys.id = $1
      ORDER BY surveys.id, questions.order_index, options.order_index
      `, [survey.rows[0].id]
    )

    if (fullSurvey.rows.length === 0) {
      await client.query(`ROLLBACK`)
      return res.status(404).json({ error: 'survey not found' })
    }

    const surveyRow = {}
    for (const row of fullSurvey.rows) {
      if (!surveyRow[row.survey_id]) {
        surveyRow[row.survey_id] = {
          id: row.survey_id,
          title: row.title,
          description: row.description,
          creator_id: row.creator_id,
          status: row.status,
          questions: {}
        }
      }

      if (!surveyRow[row.survey_id].questions[row.question_id]) {
        surveyRow[row.survey_id].questions[row.question_id] = {
          id: row.question_id,
          question: row.question,
          options: []
        }
      }

      surveyRow[row.survey_id].questions[row.question_id].options.push({
        id: row.option_id,
        option: row.option
      })
    }

    const changedSurvey = Object.values(surveyRow)[0]
    changedSurvey.questions = Object.values(changedSurvey.questions)

    await client.query(`COMMIT`)
    res.status(200).json(changedSurvey)
  } catch (error) {
    await client.query(`ROLLBACK`)
    next(error)
  } finally {
    client.release()
  }
})

surveyRouter.delete('/:id', userExtractor, requireRole('coordinator'), async (req, res, next) => {
  try {
    const id = req.params.id
    const survey = await pool.query(
      `
      SELECT * FROM surveys WHERE id = $1
      `, [id] 
    )

    if (survey.rows.length === 0){
        return res.status(404).json({ error: 'survey not found' })
    }

    if (req.user.id != survey.rows[0].creator_id) {
        return res.status(403).json({ error: 'You are forbidden from deleting this survey' })
    }
    
    await pool.query(
      `
      DELETE FROM surveys WHERE id = $1
      `, [id]
    )

    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = surveyRouter