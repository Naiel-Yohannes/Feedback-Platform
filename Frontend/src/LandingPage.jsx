import { useNavigate } from "react-router-dom"

const LandingPage = () => {
    const navigate = useNavigate()

    return (
        <div>
            <h1>Welcome to Feedback Platform</h1>
            <p>Collect feedback from your users with ease.</p>

            <button onClick={() => navigate('/register')}>Register</button>
            <button onClick={() => navigate('/login')}>Login</button>
        </div>

    )
}

export default LandingPage