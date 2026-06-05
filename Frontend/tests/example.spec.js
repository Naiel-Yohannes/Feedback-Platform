// @ts-check
import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:5173'
const API_URL = 'http://localhost:5002'

const resetDb = async (request) => {
  const response = await request.post(`${API_URL}/api/testing/reset`)
  expect(response.ok(), `reset failed with ${response.status()}: ${await response.text()}`).toBeTruthy()
}

const createUser = async (request, user) => {
  const response = await request.post(`${API_URL}/api/users`, { data: user })
  expect(response.ok(), `create user failed with ${response.status()}: ${await response.text()}`).toBeTruthy()
}

const loginUser = async (request, username, password) => {
  const response = await request.post(`${API_URL}/api/login`, {
    data: { username, password }
  })
  expect(response.ok(), `login failed with ${response.status()}: ${await response.text()}`).toBeTruthy()
  return response.json()
}

const createAndLoginCoordinator = async (request) => {
  await createUser(request, {
    name: 'Test Coordinator',
    username: 'testcoord',
    password: 'Test?1234',
    role: 'coordinator'
  })

  return loginUser(request, 'testcoord', 'Test?1234')
}

const createAndLoginMember = async (request) => {
  await createUser(request, {
    name: 'Test Member',
    username: 'testmember',
    password: 'Test?1234',
    role: 'member'
  })

  return loginUser(request, 'testmember', 'Test?1234')
}

const createSurvey = async (request, token, status = 'open') => {
  const response = await request.post(`${API_URL}/api/survey`, {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      title: 'Testing Survey',
      description: 'This is a testing survey',
      status,
      prompt: 'What is your favorite color?',
      options: ['Red', 'Blue']
    }
  })

  expect(response.ok(), `create survey failed with ${response.status()}: ${await response.text()}`).toBeTruthy()
  return response.json()
}

const loginViaUi = async (page, username, password, dashboardHeading) => {
  await page.goto(`${BASE_URL}/login`)
  await page.getByLabel('Username').fill(username)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page).toHaveURL(`${BASE_URL}/dashboard`)
  await expect(page.getByText(dashboardHeading)).toBeVisible()
}

test.describe('Login and registration', () => {
  test.beforeEach(async ({ request }) => {
    await resetDb(request)
  })

  test('register with correct credentials', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`)
    await page.getByLabel('Username').fill('tester')
    await page.getByLabel('Name', { exact: true }).fill('Testing')
    await page.getByLabel('Password').fill('Testerpassword!1234')
    await page.getByRole('button', { name: 'member' }).click()
    await page.getByRole('button', { name: 'Register' }).click()

    await expect(page).toHaveURL(`${BASE_URL}/dashboard`)
    await expect(page.getByText('Member Dashboard')).toBeVisible()
  })

  test('login with correct credentials', async ({ page, request }) => {
    await createUser(request, {
      name: 'Test User',
      username: 'testuser',
      password: 'Testerpassword!1234',
      role: 'member'
    })

    await page.goto(`${BASE_URL}/login`)
    await page.getByLabel('Username').fill('testuser')
    await page.getByLabel('Password').fill('Testerpassword!1234')
    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(page).toHaveURL(`${BASE_URL}/dashboard`)
    await expect(page.getByText('Member Dashboard')).toBeVisible()
  })

  test('cannot login with wrong credentials', async ({ page, request }) => {
    await createUser(request, {
      name: 'Test User',
      username: 'testuser',
      password: 'Testerpassword!1234',
      role: 'member'
    })

    await page.goto(`${BASE_URL}/login`)
    await page.getByLabel('Username').fill('testuser')
    await page.getByLabel('Password').fill('Wrongpassword!1234')
    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(page.getByText('Invalid username or password')).toBeVisible()
    await expect(page).toHaveURL(`${BASE_URL}/login`)
  })
})

test.describe('Coordinator', () => {
  let coordinator = null

  test.beforeEach(async ({ page, request }) => {
    await resetDb(request)
    coordinator = await createAndLoginCoordinator(request)
    await loginViaUi(page, 'testcoord', 'Test?1234', 'Coordinator Dashboard')
  })

  test('coordinator can access the dashboard', async ({ page }) => {
    await expect(page.getByText('Coordinator Dashboard')).toBeVisible()
  })

  test('can create a survey', async ({ page }) => {
    await page.getByRole('link', { name: 'New Survey' }).click()
    await page.getByLabel('Title').fill('Testing Survey')
    await page.getByLabel('Description').fill('This is a testing survey')
    await page.getByRole('button', { name: 'draft' }).click()
    await page.getByLabel('Question').fill('What is your favorite color?')
    await page.getByLabel('Option').fill('Testing for option')
    await page.getByRole('button', { name: /add option/i }).click()
    await page.getByRole('button', { name: 'Save draft' }).click()

    await expect(page).toHaveURL(`${BASE_URL}/dashboard`)
    await expect(page.getByText('Testing Survey')).toBeVisible()
  })

  test('can edit a survey', async ({ page, request }) => {
    const survey = await createSurvey(request, coordinator.token, 'draft')
    await page.goto(`${BASE_URL}/dashboard/survey/edit/${survey.id}`)

    await page.getByLabel('Title').fill('Updated Testing Survey')
    await page.getByLabel('Description').fill('This is an updated testing survey')
    await page.getByRole('button', { name: 'Save changes' }).click()

    await expect(page).toHaveURL(`${BASE_URL}/dashboard`)
    await expect(page.getByText('Updated Testing Survey')).toBeVisible()
  })
})

test.describe('Member', () => {
  let coordinator = null
  test.beforeEach(async ({ page, request }) => {
    await resetDb(request)
    coordinator = await createAndLoginCoordinator(request)
    await createAndLoginMember(request)
    await loginViaUi(page, 'testmember', 'Test?1234', 'Member Dashboard')
  })

  test('member can access the dashboard', async ({ page }) => {
    await expect(page.getByText('Member Dashboard')).toBeVisible()
  })

  test('member can see available surveys', async ({ page, request }) => {
    await createSurvey(request, coordinator.token, 'open')
    await page.goto(`${BASE_URL}/dashboard`)

    await expect(page.getByText('Testing Survey')).toBeVisible()
  })

  test('member can submit a response', async ({ page, request }) => {
    const survey = await createSurvey(request, coordinator.token, 'open')
    await page.goto(`${BASE_URL}/dashboard/survey/response/${survey.id}`)

    await page.getByLabel('Red').check()
    await page.getByRole('button', { name: 'Submit response' }).click()

    await expect(page).toHaveURL(`${BASE_URL}/dashboard/thankyou`)
    await expect(page.getByText('Response submitted')).toBeVisible()
  })

  test('member cannot submit multiple responses', async ({ page, request }) => {
    const survey = await createSurvey(request, coordinator.token, 'open')
    await page.goto(`${BASE_URL}/dashboard/survey/response/${survey.id}`)
    await page.getByLabel('Red').check()
    await page.getByRole('button', { name: 'Submit response' }).click()
    await expect(page).toHaveURL(`${BASE_URL}/dashboard/thankyou`)

    await page.goto(`${BASE_URL}/dashboard/survey/response/${survey.id}`)
    await page.getByLabel('Blue').check()
    await page.getByRole('button', { name: 'Submit response' }).click()

    await expect(page.getByText('You have already submitted a response for this survey.')).toBeVisible()
  })
})