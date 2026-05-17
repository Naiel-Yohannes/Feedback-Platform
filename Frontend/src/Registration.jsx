import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"
import toast from "react-hot-toast"
import userServices from '../services/user'
import loginServices from '../services/login'
import { setToken } from "../services/interceptor"

const RegistrationForm = ({setUser}) => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('')
    const rolesToChoose = ['coordinator', 'member']

    const RegisterationHandler = async(e) => {
        e.preventDefault()
        if (!username.trim() || !name.trim() || !password || !role) {
            toast.error('Fill in all fields and choose a role')
            return
        }
        try{
            const newUser = await userServices.createUser({username, name, password, role})
            const loggingUser = await loginServices.login({username: newUser.username, password})
            await setToken(loggingUser.token)
            localStorage.setItem('token', JSON.stringify(loggingUser))
            setUser(loggingUser)
            setUsername('')
            setName('')
            setPassword('')
            setRole('')
            toast.success('Account created')
            navigate('/dashboard')
        }catch(error){
            toast.error(error.response?.data?.error || 'Registration failed')
            setUsername('')
            setName('')
            setPassword('')
            setRole('')
        }
    }

    return (
        <div className="page-shell flex min-h-screen items-center justify-center px-4 py-12">
            <div className="auth-card">
                <h1 className="text-2xl font-semibold text-white">Create an account</h1>
                <p className="mt-1 text-sm text-zinc-500">Join as a coordinator or member.</p>

                <form onSubmit={RegisterationHandler} className="mt-6 space-y-4">
                    <label className="label-text">
                        Username
                        <input type="text" className="input-field" value={username} onChange={e => setUsername(e.target.value)} />
                    </label>
                    <label className="label-text">
                        Name
                        <input type="text" className="input-field" value={name} onChange={e => setName(e.target.value)} />
                    </label>
                    <label className="label-text">
                        Password
                        <input type="password" className="input-field" value={password} onChange={e => setPassword(e.target.value)} />
                    </label>
                    <div>
                        <span className="label-text">Role</span>
                        <div className="filter-group mt-2">
                            {rolesToChoose.map(r => (
                                <button
                                    type="button"
                                    key={r}
                                    className={role === r ? 'filter-pill-active capitalize' : 'filter-pill capitalize'}
                                    onClick={() => setRole(r)}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button type="submit" className="btn-primary w-full">Register</button>
                </form>

                <p className="mt-6 text-center text-sm text-zinc-500">
                    Already have an account?{' '}
                    <Link to="/login" className="link-accent">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default RegistrationForm
