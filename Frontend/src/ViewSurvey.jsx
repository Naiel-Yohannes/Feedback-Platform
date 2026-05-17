import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import toast from "react-hot-toast"
import surveyServices from '../services/survey'
import { useNavigate } from "react-router-dom"
import DashboardLayout from './DashboardLayout'

const ViewSurvey = ({setAllSurveys}) => {
    const { id } = useParams()
    const [survey, setSurvey] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                const fetchedSurvey = await surveyServices.getSurvey(id)
                setSurvey(fetchedSurvey)
            } catch (error) {
                toast.error(error.response?.data?.error || 'Failed to load survey')
            }
        }

        fetchSurvey()
    }, [id])

    const closeSurvey = async () => {
        try {
            await surveyServices.updateSurvey(id, { status: 'closed' })
            setSurvey(prev => ({ ...prev, status: 'closed' }))
            setAllSurveys(prev => prev.map(s => s.id === id ? {...s, status: 'closed'} : s))
            toast.success('Survey closed')
            navigate(`/dashboard/responses/survey/${id}`)
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to close survey')
        }
    }

    return (
        <DashboardLayout
            headerRight={
                survey && (
                    <div>
                        <button
                            type="button"
                            className="btn-secondary m-2"
                            onClick={() => navigate(`/dashboard/responses/survey/${survey.id}`)}
                        >
                            View results
                        </button>
                        {survey.status === 'open' && (
                            <button
                                type="button"
                                className="btn-secondary m-2"
                                onClick={() => closeSurvey()}
                            >
                                Close survey
                            </button>
                        )}
                    </div>
                )
            }
        >
            <div className="dashboard-content max-w-3xl">
                {survey ? (
                    <div className="card p-6 sm:p-8">
                        <h2 className="text-2xl font-semibold text-white">{survey.title}</h2>
                        {survey.description && (
                            <p className="mt-2 text-sm text-zinc-400">{survey.description}</p>
                        )}
                        <p className="mt-5 text-sm text-zinc-400">
                            Status:{' '}
                            <span className={survey.status === 'open' ? 'badge-open' : survey.status === 'closed' ? 'badge-closed' : 'badge-draft'}>
                                {survey.status}
                            </span>
                        </p>
                        <h3 className="mt-8 text-base font-semibold text-white">
                            Question: <span className="font-normal text-zinc-300">{survey.questions[0]?.prompt}</span>
                        </h3>
                        <h3 className="mt-5 text-sm font-semibold text-zinc-400">Options</h3>
                        <ul className="mt-3 space-y-2">
                            {survey.questions[0]?.options.map((option, index) => (
                                <li key={index} className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200">
                                    {option}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p className="text-sm text-zinc-500">Loading survey…</p>
                )}
            </div>
        </DashboardLayout>
    )
}

export default ViewSurvey
