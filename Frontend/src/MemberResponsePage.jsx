import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import toast from "react-hot-toast"
import surveyServices from "../services/survey"
import responseServices from '../services/response'
import { useNavigate } from "react-router-dom"
import DashboardLayout from './DashboardLayout'

const MemberResponsePage = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [survey, setSurvey] = useState(null)
    const [selectedOption, setSelectedOption] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        const fetchData = async() => {
            try {
                const getSurvey = await surveyServices.getSurvey(id)
                setSurvey(getSurvey)
            } catch (error) {
                toast.error(error.response?.data?.error || 'Could not load survey')
            }
        }

        fetchData()
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (selectedOption === null) {
            toast.error('Please select an option before submitting.')
            return
        }
        try {
            if (!survey || !survey.questions || survey.questions.length === 0) {
                toast.error('Survey data is not available.')
                return
            }

            const surveyId = survey.id
            const questionId = survey.questions[0]._id 

            if (!surveyId || !questionId) {
                toast.error('Unable to determine survey or question id.')
                return
            }

            setSubmitting(true)
            await responseServices.submitResponse({ surveyId, questionId, selectedOption })
            navigate('/dashboard/thankyou')
        } catch (error) {
            if (error.response?.status === 409) {
                toast.error('You have already submitted a response for this survey.')
                navigate('/dashboard')
            } else {
                toast.error(error.response?.data?.error || 'Could not submit response')
            }
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <DashboardLayout>
            <div className="dashboard-content max-w-xl">
                {!survey ? (
                    <p className="text-sm text-zinc-500">Loading survey…</p>
                ) : (
                    <>
                        <h2 className="text-2xl font-semibold tracking-tight text-white">{survey.title}</h2>
                        {survey.description && (
                            <p className="mt-2 text-sm text-zinc-400">{survey.description}</p>
                        )}
                        <h3 className="mt-8 text-base font-medium text-white">
                            {survey.questions[0]?.prompt}
                        </h3>

                        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                            {survey.questions[0]?.options.map((option, index) => (
                                <label
                                    key={index}
                                    className={selectedOption === index ? 'option-card-selected' : 'option-card'}
                                >
                                    <input
                                        type="radio"
                                        name="option"
                                        value={index}
                                        className="h-4 w-4 border-zinc-600 bg-zinc-900 text-white focus:ring-zinc-500"
                                        checked={selectedOption === index}
                                        onChange={() => setSelectedOption(index)}
                                    />
                                    <span className="text-sm font-medium text-zinc-200">{option}</span>
                                </label>
                            ))}
                            <button type="submit" className="btn-primary mt-6 w-full sm:w-auto" disabled={submitting}>
                                {submitting ? 'Submitting…' : 'Submit response'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </DashboardLayout>
    )
    
}

export default MemberResponsePage;
