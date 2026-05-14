import { useParams } from 'react-router-dom'
import responseServices from '../services/response'
import surveyServices from '../services/survey'
import { useEffect, useState } from 'react'

const SingleSurveyResponse = () => {
    const { id } = useParams()
    const [survey, setSurvey] = useState([])
    const [response, setResponse] = useState([])

    useEffect(() => {
        const fetchDatas = async() => {
            try {
                const fetchedResponse = await responseServices.getResponse(id)
                setResponse(fetchedResponse)
                const fetchedSurvey = await surveyServices.getSurvey(id)
                setSurvey(fetchedSurvey)
            } catch (error) {
                console.error(error)
            }
        } 

        fetchDatas()
        
    }, [id])

    return (
        <div>
            <h2>{survey?.title} Results</h2>
            <h2>Total responses: {response?.length}</h2>

            {survey?.questions?.map(q => (
                q.options.map((option, index) => (
                <div key={index}>
                    <h3>{option}</h3>
                    <p>
                        {response.length > 0
                        ? (
                            (response.filter(r => r.answers[0].selectedOption === index).length /
                            response.length) * 100
                        ).toFixed(2)
                        : 0}%
                    </p>
                </div>
                ))
            ))}
        </div>
    )
}

export default SingleSurveyResponse