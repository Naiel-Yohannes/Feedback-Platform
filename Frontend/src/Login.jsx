import { useState } from "react"
import loginServices from '../services/login'
import { setToken } from "../services/interceptor"

const LoginForm = ({setUser}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const formHandler = async(e) => {
        e.preventDefault()
        try{
            const loggingUser = await loginServices.login({username, password})
            await setToken(loggingUser.token)
            localStorage.setItem('token', JSON.stringify(loggingUser))
            setUser({username: loggingUser.username, name: loggingUser.name, role: loggingUser.role})
            setUsername('')
            setPassword('')
        }catch(error){
            console.log(error)
            setUsername('')
            setPassword('')
        }
    }

    return (
        <div>
            <form onSubmit={formHandler}>
                <h1>Login to you'r existing account</h1>
                <label>
                    Username: <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
                </label>
                <label>
                    Password: <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </label>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default LoginForm