import { setToken } from '../services/interceptor'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import DashboardLayout from './DashboardLayout'

const Settings = ({user, setUser}) => {
    const navigate = useNavigate()
    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
        setToken(null)
        toast.success('Signed out')
        navigate('/')
    }

    return (
        <DashboardLayout>
            <div className="dashboard-content max-w-2xl">
                <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Settings</h1>
                <p className="mt-1 text-sm text-zinc-500">Your account details and session.</p>

                <div className="card mt-8 p-6">
                    <h3 className="text-sm font-semibold text-white">Profile</h3>
                    <dl className="mt-5 space-y-4 text-sm">
                        <div>
                            <dt className="text-zinc-500">Name</dt>
                            <dd className="mt-0.5 font-medium text-white">{user.name}</dd>
                        </div>
                        <div>
                            <dt className="text-zinc-500">Username</dt>
                            <dd className="mt-0.5 font-medium text-white">{user.username}</dd>
                        </div>
                        <div>
                            <dt className="text-zinc-500">Role</dt>
                            <dd className="mt-0.5 font-medium capitalize text-white">{user.role}</dd>
                        </div>
                    </dl>
                </div>

                <div className="card mt-4 p-6">
                    <h3 className="text-sm font-semibold text-white">Session</h3>
                    <p className="mt-1 text-sm text-zinc-500">Sign out on this device.</p>
                    <button type="button" className="btn-danger mt-5" onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default Settings
