import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import surveyServices from '../services/survey'

const ViewSurvey = () => {
    const { id } = useParams()
    const [survey, setSurvey] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                const fetchedSurvey = await surveyServices.getSurvey(id)
                setSurvey(fetchedSurvey)
            } catch (error) {
                console.error("Failed to fetch survey:", error)
            }
        }

        fetchSurvey()
    }, [id])

    return (
        <div>
            {survey ? (
                <div>
                    <h2>{survey.title}</h2>
                    <h3>Status: <span>{survey.status}</span></h3>
                    <h3>Question: <span>{survey.questions[0]?.prompt}</span></h3>
                    <h3>Options: <br />
                        <ul>
                            {survey.questions[0]?.options.map((option, index) => (
                                <li key={index}>{option}</li>
                            ))}
                        </ul>
                    </h3>
                    <button>View Results</button>
                </div>
        
            ) : (
                <p>Loading survey...</p>
            )}
        </div>
    )
}

export default ViewSurvey