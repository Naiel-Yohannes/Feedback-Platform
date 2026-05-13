import { useEffect, useLayoutEffect, useState } from 'react'
import surveyServices from '../services/survey'
import { setToken } from '../services/interceptor'
import CreateSurvey from './CreateSurvey'
import RegistrationForm from './Registration'
import LoginForm from './Login'
import ProtectedRoute from './ProtectedRoute'
import Layout from './Layout'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './Dashboard'
import LandingPage from './LandingPage'

function App() {
  const [user, setUser] = useState(() => {
    try {
      const rawUser = localStorage.getItem('token')
      if (!rawUser) {
        return null
      }
      const parsedUser = JSON.parse(rawUser)
      return parsedUser?.token ? parsedUser : null
    } catch {
      return null
    }
  })
  
  const [allSurveys, setAllSurveys] = useState([])

  useLayoutEffect(() => {
    if (user?.token) {
      setToken(user.token)
    }
  }, [user])

  useEffect(() => {
    const fetchSurveys = async () => {
      if (user === null) {
        setAllSurveys([])
        return
      }
      try {
        const surveys = await surveyServices.getAllSurveys()
        setAllSurveys(surveys)
      } catch (error) {
        console.error("Failed to fetch surveys:", error)
      }
    }

    fetchSurveys()
  }, [user])

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm setUser={setUser} />} />
        <Route path="/register" element={<RegistrationForm setUser={setUser} />} />
        <Route element={<ProtectedRoute user={user} />}>
          <Route path='/dashboard' element={<Layout/>}>
            <Route index element={<Dashboard user={user} allSurveys={allSurveys} />} />
            <Route path='create' element={<CreateSurvey/>}/>
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
