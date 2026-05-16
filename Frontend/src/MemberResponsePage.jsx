import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import surveyServices from "../services/survey"
import responseServices from '../services/response'
import { useNavigate } from "react-router-dom"

const MemberResponsePage = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [survey, setSurvey] = useState(null)
    const [selectedOption, setSelectedOption] = useState(null)

    useEffect(() => {
        const fetchData = async() => {
            try {
                const getSurvey = await surveyServices.getSurvey(id)
                setSurvey(getSurvey)
            } catch (error) {
                console.error(error)
            }
        }

        fetchData()
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (selectedOption === null) {
            alert('Please select an option before submitting.')
            return
        }
        try {
            if (!survey || !survey.questions || survey.questions.length === 0) {
                alert('Survey data is not available.');
                return
            }

            const surveyId = survey.id
            const questionId = survey.questions[0]._id 

            if (!surveyId || !questionId) {
                alert('Unable to determine survey or question id.');
                return
            }

            await responseServices.submitResponse({ surveyId, questionId, selectedOption })
            navigate('/dashboard/thankyou')
        } catch (error) {
            if (error.response?.status === 409) {
                alert('You have already submitted a response for this survey.')
                navigate('/dashboard')
            }
        }
    }

    return (
        <div>
            <h2>Member Response Page</h2>

            <h3>{survey?.title}</h3>
            <h3>Question: {survey?.questions[0]?.prompt}</h3>

            <form onSubmit={handleSubmit}>
                {survey?.questions[0]?.options.map((option, index) => (
                    <label key={index}>
                        <input
                        type="radio"
                        name="option"
                        value={index}
                        checked={selectedOption === index}
                        onChange={() => setSelectedOption(index)}
                        />
                        {option}
                    </label>
                ))}
                <button type="submit">Submit Response</button>
            </form>
        </div>
    )
    
}

export default MemberResponsePage;