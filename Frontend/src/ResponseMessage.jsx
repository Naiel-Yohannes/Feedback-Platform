import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import DashboardLayout from './DashboardLayout'

const ResponseMessage = () => {
    const navigate = useNavigate()
    
    useEffect(() => {

        const timer = setTimeout(() => {
            navigate('/dashboard')
        }, 3000)
        return () => clearTimeout(timer)
    }, [navigate])
    
    return (
        <DashboardLayout>
            <div className="dashboard-content flex min-h-[50vh] items-center justify-center">
                <div className="card max-w-md p-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30">
                        <i className="fa-solid fa-check text-xl text-emerald-400" aria-hidden="true"></i>
                    </div>
                    <h1 className="mt-5 text-xl font-semibold text-white">Response submitted</h1>
                    <h2 className="mt-2 text-sm text-zinc-400">Thank you for your feedback.</h2>
                    <p className="mt-4 text-xs text-zinc-600">Redirecting to your dashboard…</p>
                    <Link to="/dashboard" className="btn-secondary mt-6 inline-flex">
                        Go to dashboard now
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    )
    
}

export default ResponseMessage;
