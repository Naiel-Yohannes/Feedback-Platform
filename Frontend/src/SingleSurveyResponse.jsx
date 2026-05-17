import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import '@fortawesome/fontawesome-free/css/all.min.css';
import responseServices from '../services/response'
import surveyServices from '../services/survey'
import { useEffect, useState } from 'react'
import DashboardLayout from './DashboardLayout'

const SingleSurveyResponse = () => {
    const { id } = useParams()
    const [survey, setSurvey] = useState([])
    const [response, setResponse] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDatas = async() => {
            try {
                const fetchedResponse = await responseServices.getResponse(id)
                setResponse(fetchedResponse)
                const fetchedSurvey = await surveyServices.getSurvey(id)
                setSurvey(fetchedSurvey)
            } catch (error) {
                toast.error(error.response?.data?.error || 'Could not load results')
            } finally {
                setLoading(false)
            }
        } 

        fetchDatas()
        
    }, [id])

    const total = response?.length || 0
    const statusClass = survey?.status === 'open' ? 'badge-open' : survey?.status === 'closed' ? 'badge-closed' : 'badge-draft'

    return (
        <DashboardLayout>
            <div className="dashboard-content max-w-3xl">
                {loading ? (
                    <p className="text-sm text-zinc-500">Loading results…</p>
                ) : (
                    <>
                        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{survey?.title}</h2>
                        {survey?.description && (
                            <p className="mt-2 text-sm text-zinc-400">{survey.description}</p>
                        )}

                        <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-zinc-400">
                            <span className="inline-flex items-center gap-2">
                                <i className="fa-solid fa-users text-zinc-500" aria-hidden="true"></i>
                                <span className="text-zinc-200">{total}</span> {total === 1 ? 'response' : 'responses'}
                            </span>
                            <span className="inline-flex items-center gap-2">
                                <i className="fa-solid fa-circle-check text-zinc-500" aria-hidden="true"></i>
                                Status: <span className={statusClass}>{survey?.status}</span>
                            </span>
                        </div>

                        {survey?.questions?.map(q => (
                            <div key={q._id || q.prompt} className="card mt-8 p-6 sm:p-7">
                                <h3 className="text-lg font-semibold text-white">{q.prompt}</h3>
                                <div className="mt-7 space-y-5">
                                    {q.options.map((option, index) => {
                                        const count = total > 0
                                            ? response.filter(r => r.answers[0].selectedOption === index).length
                                            : 0
                                        const pct = total > 0 ? ((count / total) * 100) : 0
                                        return (
                                            <div key={index}>
                                                <div className="mb-2 flex items-center justify-between gap-2 text-sm">
                                                    <span className="font-medium text-zinc-200">{option}</span>
                                                    <span className="shrink-0 tabular-nums text-zinc-500">
                                                        {count} · {pct.toFixed(0)}%
                                                    </span>
                                                </div>
                                                <div className="progress-track">
                                                    <div
                                                        className="progress-fill"
                                                        style={{ width: `${pct}%` }}
                                                        role="progressbar"
                                                        aria-valuenow={pct}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}

                        {total === 0 && (
                            <p className="mt-6 text-sm text-zinc-500">No responses yet.</p>
                        )}
                    </>
                )}
            </div>
        </DashboardLayout>
    )
}

export default SingleSurveyResponse
