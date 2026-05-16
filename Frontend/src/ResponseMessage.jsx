import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ResponseMessage = () => {
    const navigate = useNavigate()
    
    useEffect(() => {

        const timer = setTimeout(() => {
            navigate('/dashboard')
        }, 3000)
        return () => clearTimeout(timer)
    }, [navigate])
    
    return (
        <div>
            <h1>Response submitted</h1>
            <h2>Thank you for your feedback!</h2>
        </div>
    )
    
}

export default ResponseMessage;