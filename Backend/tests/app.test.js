jest.setTimeout(30000)
const Response = require('../modules/response')
const Survey = require('../modules/survey')
const User = require('../modules/user')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')

const api = supertest(app)

const DEFAULT_PASSWORD = 'Tester?test1234'
const DEFAULT_RESPONSE_PASSWORD = 'Response?test1234'

const buildUser = ({ role = 'coordinator', name = 'Test User', password = DEFAULT_PASSWORD, username } = {}) => ({
    name,
    username: username || `tester-${Date.now()}-${Math.random()}`,
    password,
    role
})

const buildSurvey = (overrides = {}) => ({
    title: 'Test Survey',
    description: 'This is a test survey',
    status: 'open',
    prompt: 'What is your favorite color?',
    options: ['Red', 'Blue', 'Green'],
    ...overrides
})

const buildResponsePayload = ({ surveyId, questionId, selectedOption = 0 } = {}) => ({
    surveyId,
    questionId,
    selectedOption
})

const createUser = async (role = 'coordinator', status = 201, password = DEFAULT_PASSWORD, name = 'Test User') => {
    const user = buildUser({ role, name, password })

    const newUser = await api.post('/api/users')
        .send(user)
        .expect(status)

    return { ...newUser.body, password }
}

const loginUser = async (user, status = 201) => {
    const loginResponse = await api.post('/api/login')
        .send({ username: user.username, password: user.password })
        .expect(status)

    return loginResponse.body.token
}

const createSurvey = async (token, status = 201, overrides = {}) => {
    const survey = buildSurvey(overrides)

    const createdSurvey = await api.post('/api/survey')
        .set('Authorization', `Bearer ${token}`)
        .send(survey)
        .expect(status)

    return createdSurvey.body
}

beforeEach(async () => {
    await User.deleteMany({})
    await Survey.deleteMany({})
    await Response.deleteMany({})
})

describe('Full backend test', () => {
    describe('User credentials', () => {
        test('pass with correct credentials', async() => {
            const user = buildUser()
            const response = await api.post('/api/users')
                .send(user)
                .expect(201)
                .expect('Content-Type', /application\/json/)
            
            expect(response.body).toBeDefined()
            expect(response.body.username).toBe(user.username.toLocaleLowerCase())
        })
        test('fails with incorrect credentials', async() => {
            const user = {
                password: 'Tester?test1234',
                role: 'admin'
            }
            const response = await api.post('/api/users')
                .send(user)
                .expect(400)
                .expect('Content-Type', /application\/json/)
            
            expect(response.body.error).toBeDefined()
            expect(response.body.error).toBe('Missing credentials')
        })
    })

    describe('login credentials', () => {
        let username
        beforeEach(async() => {
            const user = buildUser()
            username = user.username
            await api.post('/api/users')
            .send(user)
            .expect(201)
        })

        test('pass with correct credentials', async() => {
            const user = {
                username,
                password: 'Tester?test1234'
            }

            const response = await api.post('/api/login')
                .send(user)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            expect(response.body.token).toBeDefined()
            expect(response.body.username).toBe(user.username.toLocaleLowerCase())
        })
        test('fails with incorrect credentials', async() => {
            const user = {
                username,
                password: 'Tester!4321'
            }

            const response = await api.post('/api/login')
                .send(user)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            expect(response.body.error).toBe('Invalid username or password')
        })
    })
    describe('creating a survey', () => {
        let token = null
        beforeEach(async() => {
            const coordinator = await createUser('coordinator', 201)
            token = await loginUser(coordinator, 201)
        })

        test('succeeds with valid data and token', async() => {
            await createSurvey(token, 201)

            const response = await api.get('/api/survey')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)

            expect(response.body).toHaveLength(1)
            expect(response.body[0].title).toBe('Test Survey')
        })

        test('fails with invalid data', async() => {
            const survey = buildSurvey({ description: undefined, status: undefined })
            const response = await api.post('/api/survey')
                .set('Authorization', `Bearer ${token}`)
                .send(survey)
                .expect(400)

            expect(response.body.error).toBe('Missing content')
        })
        test('fails without token', async() => {  
            const survey = buildSurvey()
            const response = await api.post('/api/survey')
                .set('Authorization', `Bearer invalidtoken`)
                .send(survey)
                .expect(401)

            expect(response.body.error).toBe('Invalid token')
        })

        test('updating a survey', async() => {
            const survey = buildSurvey({ status: 'draft' })

            const response = await api.post('/api/survey')
                .set('Authorization', `Bearer ${token}`)
                .send(survey)
                .expect(201)

            const updateResponse = await api.put(`/api/survey/${response.body.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({title: 'Updated Test Survey'})
                .expect(200)

            expect(updateResponse.body.title).toBe('Updated Test Survey')
        })

        test('a draft survey can be opened', async() => {
            const survey = buildSurvey({ status: 'draft' })

            const response = await api.post('/api/survey')
                .set('Authorization', `Bearer ${token}`)
                .send(survey)
                .expect(201)

            const updateResponse = await api.put(`/api/survey/${response.body.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({status: 'open'})
                .expect(200)

            expect(updateResponse.body.status).toBe('open')
        })

        test('deleting a survey', async() => {
            const survey = buildSurvey({ status: 'draft' })
            const response = await api.post('/api/survey')
                .set('Authorization', `Bearer ${token}`)
                .send(survey)
                .expect(201)

            await api.delete(`/api/survey/${response.body.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(204)

            const getResponse = await api.get(`/api/survey/${response.body.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(404)

            expect(getResponse.body.error).toBe('survey not found')
        })

        test('cant update a survey that is another coordinators', async() => {
            const survey = buildSurvey({ status: 'draft' })

            const response = await api.post('/api/survey')
                .set('Authorization', `Bearer ${token}`)
                .send(survey)
                .expect(201)

            const otherUser = buildUser({ name: 'Other User' })

            await api.post('/api/users')
                .send(otherUser)
                .expect(201)
            const loginResponse = await api.post('/api/login')
                .send({username: otherUser.username, password: otherUser.password})
                .expect(201)
            const otherToken = loginResponse.body.token

            const updateResponse = await api.put(`/api/survey/${response.body.id}`)
                .set('Authorization', `Bearer ${otherToken}`)
                .send({title: 'Updated Test Survey'})
                .expect(403)

            expect(updateResponse.body.error).toBe('You are forbidden from updating this survey')
        })
    })

    describe('creating a response', () => {
        let surveyResponse = null
        let token = null
        beforeEach(async() => {
            const coordinator = await createUser('coordinator', 201)
            token = await loginUser(coordinator, 201)
            await createSurvey(token, 201)

            surveyResponse = await api.get('/api/survey')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
        })

        test('succeeds with valid data and token', async() => {
            const member = await createUser('member', 201, DEFAULT_RESPONSE_PASSWORD, 'Response User')
            const responseToken = await loginUser(member, 201)

            const response = buildResponsePayload({
                surveyId: surveyResponse.body[0].id,
                questionId: surveyResponse.body[0].questions[0]._id
            })

            await api.post('/api/responses')
                .set('Authorization', `Bearer ${responseToken}`)
                .send(response)
                .expect(201)

            const getResponse = await api.get(`/api/responses/survey/${surveyResponse.body[0].id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                
            expect(getResponse.body[0].surveyId).toBe(surveyResponse.body[0].id)
            expect(getResponse.body).toHaveLength(1)
        })
        test('fails with invalid data', async() => {
            const member = await createUser('member', 201, DEFAULT_RESPONSE_PASSWORD, 'Response User')
            const responseToken = await loginUser(member, 201)

            const response = buildResponsePayload({
                questionId: surveyResponse.body[0].questions[0]._id
            })

            const newResponse = await api.post('/api/responses')
                .set('Authorization', `Bearer ${responseToken}`)
                .send(response)
                .expect(400)
                
            expect(newResponse.body.error).toBe('Missing content')
        })
         test('fails without token', async() => {
            await createUser('member', 201, DEFAULT_RESPONSE_PASSWORD, 'Response User')

            const response = buildResponsePayload({
                surveyId: surveyResponse.body[0].id,
                questionId: surveyResponse.body[0].questions[0]._id
            })

            const newResponse = await api.post('/api/responses')
                .set('Authorization', `Bearer invalidtoken`)
                .send(response)
                .expect(401)
                
            expect(newResponse.body.error).toBe('Invalid token')
        })

        test('cant submit response more than once', async() => {
            const member = await createUser('member', 201, DEFAULT_RESPONSE_PASSWORD, 'Response User')
            const responseToken = await loginUser(member, 201)

            const response = buildResponsePayload({
                surveyId: surveyResponse.body[0].id,
                questionId: surveyResponse.body[0].questions[0]._id
            })

            await api.post('/api/responses')
                .set('Authorization', `Bearer ${responseToken}`)
                .send(response)
                .expect(201)

           const secondResponse = buildResponsePayload({
                surveyId: surveyResponse.body[0].id,
                questionId: surveyResponse.body[0].questions[0]._id,
                selectedOption: 1
           })

            const newResponse = await api.post('/api/responses')
                .set('Authorization', `Bearer ${responseToken}`)
                .send(secondResponse)
                .expect(409)

            expect(newResponse.body.error).toBe('You cant take one survey more than once')
        })

        test('cant submit response to closed survey', async() => {
            const member = await createUser('member', 201, DEFAULT_RESPONSE_PASSWORD, 'Response User')
            const responseToken = await loginUser(member, 201)

            const closedSurvey = buildSurvey({
                title: 'Closed Survey',
                description: 'This is a closed survey',
                status: 'closed'
            })

            await api.post('/api/survey')
                .set('Authorization', `Bearer ${token}`)
                .send(closedSurvey)
                .expect(201)

            const urveyResponse2 = await api.get('/api/survey')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)

            const response = buildResponsePayload({
                surveyId: urveyResponse2.body[1].id,
                questionId: urveyResponse2.body[1].questions[0]._id
            })

            const newResponse = await api.post('/api/responses')
                .set('Authorization', `Bearer ${responseToken}`)
                .send(response)
                .expect(400)

            expect(newResponse.body.error).toBe('This survey is not open')
        })
        test('Invalid option index', async() => {
            const member = await createUser('member', 201, DEFAULT_RESPONSE_PASSWORD, 'Response User')
            const responseToken = await loginUser(member, 201)

            const response = buildResponsePayload({
                surveyId: surveyResponse.body[0].id,
                questionId: surveyResponse.body[0].questions[0]._id,
                selectedOption: -1
            })

            const newResponse = await api.post('/api/responses')
                .set('Authorization', `Bearer ${responseToken}`)
                .send(response)
                .expect(400)
                
            expect(newResponse.body.error).toBe('Invalid option index')
        })

        test('a coordinator cant send a response', async() => {
            const response = buildResponsePayload({
                surveyId: surveyResponse.body[0].id,
                questionId: surveyResponse.body[0].questions[0]._id
            })

            const newResponse = await api.post('/api/responses')
                .set('Authorization', `Bearer ${token}`)
                .send(response)
                .expect(403)

            expect(newResponse.body.error).toBe('Forbidden')
        })

        test('cannot see draft surveys', async() => {
            const draftSurvey = buildSurvey({
                title: 'Draft Survey',
                description: 'This is a draft survey',
                status: 'draft'
            })

            await api.post('/api/survey')
                .set('Authorization', `Bearer ${token}`)
                .send(draftSurvey)
                .expect(201)

            const survey = await api.get('/api/survey')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                
            const draftSurveys = survey.body.filter(survey => survey.status === 'draft')

            const member = await createUser('member', 201, DEFAULT_RESPONSE_PASSWORD, 'Response User')
            const responseToken = await loginUser(member, 201)

            const response = buildResponsePayload({
                surveyId: draftSurveys[0].id,
                questionId: draftSurveys[0].questions[0]._id
            })

            const newResponse = await api.post('/api/responses')
                .set('Authorization', `Bearer ${responseToken}`)
                .send(response)
                .expect(400)

            expect(newResponse.body.error).toBe('This survey is not open')
        })
    })
})

afterAll(async() => {
    await mongoose.connection.close()
})