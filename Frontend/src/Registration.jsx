import { useState } from "react";
import userServices from '../services/user'
import loginServices from '../services/login'
import { setToken } from "../services/interceptor"

const RegistrationForm = ({setUser}) => {
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('')
    const rolesToChoose = ['coordinator', 'member']

    const RegisterationHandler = async(e) => {
        e.preventDefault()
        try{
            const newUser = await userServices.createUser({username, name, password, role})
            const loggingUser = await loginServices.login({username: newUser.username, password})
            await setToken(loggingUser.token)
            localStorage.setItem('token', JSON.stringify(loggingUser))
            setUser({username: loggingUser.username, name: loggingUser.name})
            setUsername('')
            setName('')
            setPassword('')
            setRole('')
        }catch(error){
            console.log(error)
            setUsername('')
            setName('')
            setPassword('')
            setRole('')
        }
    }

    return (
        <div>
            <form onSubmit={RegisterationHandler}>
                <h1>Create an account</h1>
                <label>
                    Username: <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
                </label>
                <label>
                    Name: <input type="text" value={name} onChange={e => setName(e.target.value)} />
                </label>
                <label>
                    Password: <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </label>
                {rolesToChoose.map(r => (
                    <button type="button" key={r} onClick={() => setRole(r)}>${r}</button>
                ))}
                <button type="submit">Register</button>
            </form>
        </div>
    )
}

export default RegistrationForm