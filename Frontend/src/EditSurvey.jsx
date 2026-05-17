import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import toast from "react-hot-toast"
import '@fortawesome/fontawesome-free/css/all.min.css';
import surveyServices from '../services/survey'
import { useNavigate } from "react-router-dom"
import DashboardLayout from './DashboardLayout'

const EditSurvey = ({setAllSurveys}) => {
    const navigate = useNavigate()
    const {id} = useParams()
    
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState('')
    const [prompt, setPrompt] = useState('')
    const [options, setOptions] = useState([])
    const [option, setOption] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                const fetchedSurvey = await surveyServices.getSurvey(id)
                setTitle(fetchedSurvey.title)
                setDescription(fetchedSurvey.description)
                setStatus(fetchedSurvey.status)
                setPrompt(fetchedSurvey.questions[0]?.prompt)
                setOptions(fetchedSurvey.questions[0]?.options || [])
            } catch (error) {
                toast.error(error.response?.data?.error || 'Could not load survey')
            } finally {
                setLoading(false)
            }
        }
    
        fetchSurvey()
    }, [id])

    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            const updatedSurvey = {
                title,
                description,
                status,
                prompt,
                options
            }

            const newSurvey = await surveyServices.updateSurvey(id, updatedSurvey)
            setAllSurveys(prev => prev.map(s => s.id === id ? newSurvey : s))
            toast.success('Survey updated')
            navigate('/dashboard')
        } catch (error) {
            toast.error(error.response?.data?.error || 'Could not update survey')
        }
    }

    const removeOption = (indexToRemove) => {
        setOptions(options.filter((_, i) => i !== indexToRemove)) 
    }

    const addOption = () => {
        if(option.trim() === '') return
        setOptions([...options, option])
        setOption('')
    }

    if (loading) {
        return (
            <DashboardLayout>
                <div className="dashboard-content">
                    <p className="text-sm text-zinc-500">Loading survey…</p>
                </div>
            </DashboardLayout>
        )
    }

    return(
        <DashboardLayout
            headerRight={
                <>
                    <button type="button" className="btn-secondary hidden sm:inline-flex" onClick={() => navigate(`/dashboard/survey/${id}`)}>Cancel</button>
                    <button type="submit" form="edit-survey-form" className="btn-primary">Save changes</button>
                </>
            }
        >
            <div className="dashboard-content">
                <h1 className="text-2xl font-semibold tracking-tight text-white">Edit draft survey</h1>

                <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:gap-8">
                    <form id="edit-survey-form" onSubmit={handleUpdate} className="card space-y-5 p-6 sm:p-7">
                        <label className="label-text block">
                            Title
                            <input type="text" className="input-field" value={title} onChange={e => setTitle(e.target.value)} />
                        </label>
                        <label className="label-text block">
                            Description
                            <input type="text" className="input-field" value={description} onChange={e => setDescription(e.target.value)} />
                        </label>
                        <label className="label-text block">
                            Status
                            <select className="input-field" value={status} onChange={e => setStatus(e.target.value)}>
                                <option value="">Select status</option>
                                <option value="draft">Draft</option>
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                            </select>
                        </label>
                        <label className="label-text block">
                            Question
                            <input type="text" className="input-field" value={prompt} onChange={e => setPrompt(e.target.value)} />
                        </label>
                        <label className="label-text block">
                            Options
                            <ul className="mt-2 space-y-2">
                                {options.map((opt, index) => (
                                    <li key={index} className="flex items-center justify-between gap-2 rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5">
                                        <span className="text-sm text-zinc-200">{opt}</span>
                                        <button type="button" className="cursor-pointer text-sm font-medium text-rose-400 hover:text-rose-300" onClick={() => removeOption(index)}>Remove</button>
                                    </li>
                                ))}
                            </ul>
                            <input type="text" className="input-field mt-2" value={option} onChange={e => setOption(e.target.value)} placeholder="Add option" />
                            <button type="button" className="btn-ghost mt-2 px-0 text-zinc-400 hover:text-white" onClick={() => addOption()}>Add option</button>
                        </label>
                    </form>

                    <div>
                        <p className="mb-3 text-xs font-semibold tracking-wider text-zinc-500 uppercase">Preview</p>
                        <div className="card p-6 sm:p-7">
                            <h2 className="text-xl font-semibold text-white">{title || 'Survey title'}</h2>
                            <p className="mt-2 text-sm text-zinc-400">{description || 'Description'}</p>
                            {status && (
                                <span className={`mt-4 inline-flex ${status === 'open' ? 'badge-open' : status === 'closed' ? 'badge-closed' : 'badge-draft'}`}>
                                    {status}
                                </span>
                            )}
                            <p className="mt-5 font-medium text-white">{prompt || 'Question'}</p>
                            <ul className="mt-4 space-y-3">
                                {options.map((opt, index) => (
                                    <div key={index} className="flex items-center gap-3 text-sm text-zinc-300">
                                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-zinc-600"></span>
                                        {opt}
                                    </div>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default EditSurvey
