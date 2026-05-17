import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import toast from "react-hot-toast"
import loginServices from '../services/login'
import { setToken } from "../services/interceptor"

const LoginForm = ({setUser}) => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const formHandler = async(e) => {
        e.preventDefault()
        if (!username.trim() || !password) {
            toast.error('Enter your username and password')
            return
        }
        try{
            const loggingUser = await loginServices.login({username, password})
            await setToken(loggingUser.token)
            localStorage.setItem('token', JSON.stringify(loggingUser))
            setUser(loggingUser)
            setUsername('')
            setPassword('')
            toast.success('Welcome back')
            navigate('/dashboard')
        }catch(error){
            toast.error(error.response?.data?.error || 'Login failed. Check your credentials.')
            setUsername('')
            setPassword('')
        }
    }

    return (
        <div className="page-shell flex min-h-screen items-center justify-center px-4 py-12">
            <div className="auth-card">
                <h1 className="text-2xl font-semibold text-white">Sign in to your account</h1>
                <p className="mt-1 text-sm text-zinc-500">Use the credentials you registered with.</p>

                <form onSubmit={formHandler} className="mt-6 space-y-4">
                    <label className="label-text">
                        Username
                        <input
                            type="text"
                            className="input-field"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            autoComplete="username"
                        />
                    </label>
                    <label className="label-text">
                        Password
                        <input
                            type="password"
                            className="input-field"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </label>
                    <button type="submit" className="btn-primary w-full">Sign in</button>
                </form>

                <p className="mt-6 text-center text-sm text-zinc-500">
                    No account yet?{' '}
                    <Link to="/register" className="link-accent">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default LoginForm
