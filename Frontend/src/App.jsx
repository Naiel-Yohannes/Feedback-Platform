import { useEffect, useState } from 'react'
import surveyServices from '../services/survey'
import ShowSurvey from "./ShowSurvey"
import { setToken } from '../services/interceptor'
import CreateSurvey from './CreateSurvey'
import RegistrationForm from './Registration'
import LoginForm from './Login'
import ProtectedRoute from './ProtectedRoute'
import Layout from './Layout'
import { Routes, Route } from 'react-router-dom'

function App() {
  const [user, setUser] = useState(null)
  const [allSurveys, setAllSurveys] = useState([])

  useEffect(() => {
    const getUser = async() => {
      const loggedUserJSON = window.localStorage.getItem('token')
      if(loggedUserJSON){
        const user = JSON.parse(loggedUserJSON)
        await setToken(user.token)
        setUser(user)
      }
    }

    getUser()
  }, [])

  useEffect(() => {
  const fetchSurveys = async () => {
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
        <Route path="/login" element={<LoginForm/>} />
        <Route path="/register" element={<RegistrationForm setUser={setUser} />} />
        <Route element={<ProtectedRoute user={user} />}>
          <Route path='/dashboard' element={<Layout/>}>
            <Route path='create' element={<CreateSurvey/>}/>
            <Route path='surveys' element={<ShowSurvey allSurveys={allSurveys} />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
