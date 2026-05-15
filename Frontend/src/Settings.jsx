import { setToken } from '../services/interceptor'
import { useNavigate } from 'react-router-dom'

const Settings = ({user, setUser}) => {
    const navigate = useNavigate()
    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
        setToken(null)
        navigate('/')
    }
    return (
        <div>
            <h2>Settings</h2>
            <div>
                <h3>Profile</h3>
                <p>Name: {user.name}</p>
                <p>Username: {user.username}</p>
                <p>Role: {user.role}</p>
            </div>
            <div>
                <h3>Session</h3>
                <button onClick={logout}>Logout</button>
            </div>
        </div>
    )
}

export default Settings