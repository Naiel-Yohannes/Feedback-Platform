import { useState } from "react"
import toast from "react-hot-toast"
import '@fortawesome/fontawesome-free/css/all.min.css';
import surveyServices from '../services/survey'
import DashboardLayout from './DashboardLayout'

const CreateSurvey = ({setAllSurveys}) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState('')
    const [prompt, setPrompt] = useState('')
    const [options, setOptions] = useState([])
    const [option, setOption] = useState('')

    const VALID_STATUSES = ['open', 'closed', 'draft']

    const surveyForm = async() => {
        const trimmedTitle = title.trim()
        const trimmedPrompt = prompt.trim()
        const trimmedOptions = options.map(o => o.trim()).filter(o => o.length > 0)
        const trimmedDescription = description.trim()

        if (trimmedTitle.length < 10) {
            toast.error('Title must be at least 10 characters.')
            return
        }
        if (!status) {
            toast.error('Choose a status (draft, open, or closed).')
            return
        }
        if (trimmedPrompt.length < 5) {
            toast.error('Question must be at least 5 characters.')
            return
        }
        if (trimmedOptions.length === 0) {
            toast.error('Add at least one non-empty option.')
            return
        }
        if (trimmedDescription.length > 0 && trimmedDescription.length < 10) {
            toast.error('Description must be at least 10 characters, or leave it empty.')
            return
        }

        try{
            const survey = {
                title: trimmedTitle,
                prompt: trimmedPrompt,
                status,
                options: trimmedOptions
            }
            if (trimmedDescription.length >= 10) {
                survey.description = trimmedDescription
            }
            const newSurvey = await surveyServices.createSurvey(survey)
            setAllSurveys(prev => [...prev, newSurvey])
            setTitle('')
            setDescription('')
            setStatus('')
            setPrompt('')
            setOptions([])
            toast.success(status === 'draft' ? 'Draft saved' : status === 'open' ? 'Survey published' : 'Survey archived')
        }catch(error){
            toast.error(error.response?.data?.error || 'Could not create survey')
        }
    }
    const addOption = () => {
        try{
            if(option.trim() === '') return
            setOptions([...options, option])
            setOption('')
        }catch{
            toast.error('Could not add option')
        }
    }

    const removeOption = (indexToRemove) => {
        setOptions(options.filter((_, i) => i !== indexToRemove)) 
    }

    return(
        <DashboardLayout
            headerRight={
                status ? (
                    <button type="button" className="btn-secondary" onClick={() => surveyForm()}>
                        {status === 'draft' ? 'Save draft' : status === 'closed' ? 'Archive' : 'Publish'}
                    </button>
                ) : null
            }
        >
            <div className="dashboard-content">
                <h1 className="text-2xl font-semibold tracking-tight text-white">Create Survey</h1>

                <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:gap-8">
                    <div className="leftbar card p-6 sm:p-7">
                        <form className="space-y-5">
                            <label className="label-text block">
                                Title
                                <input type="text" className="input-field" value={title} onChange={e => setTitle(e.target.value)} placeholder="Course feedback" />
                            </label>

                            <label className="label-text block">
                                Description
                                <input type="text" className="input-field" value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional short description" />
                            </label>

                            <div>
                                <span className="label-text">Status</span>
                                <div className="filter-group mt-2">
                                    {VALID_STATUSES.map(s => (
                                        <button
                                            type="button"
                                            key={s}
                                            className={status === s ? 'filter-pill-active capitalize' : 'filter-pill capitalize'}
                                            onClick={() => setStatus(s)}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <label className="label-text block">
                                Question
                                <input type="text" className="input-field" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="What was clearest today?" />
                            </label>

                            {options.map((o, i) => (
                                <div key={i} className="flex items-center justify-between gap-2 rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5">
                                    <span className="text-sm text-zinc-200">{o}</span>
                                    <button type="button" className="cursor-pointer text-sm font-medium text-rose-400 hover:text-rose-300" onClick={() => removeOption(i)}>Remove</button>
                                </div>
                            ))}

                            <label className="label-text block">
                                Option
                                <input type="text" className="input-field" value={option} onChange={e => setOption(e.target.value)} placeholder="Add a choice" />
                            </label>
                            <button type="button" className="btn-ghost px-0 text-zinc-400 hover:text-white" onClick={addOption}>+ Add option</button>
                        </form>
                    </div>

                    <div className="rightbar">
                        <p className="mb-3 text-xs font-semibold tracking-wider text-zinc-500 uppercase">Live preview</p>
                        <div className="card p-6 sm:p-7">
                            <h2 className="text-xl font-semibold text-white">{title || 'Survey title'}</h2>
                            <p className="mt-2 text-sm text-zinc-400">{description || 'Description will appear here.'}</p>
                            {status && (
                                <span className={`mt-4 inline-flex ${status === 'open' ? 'badge-open' : status === 'closed' ? 'badge-closed' : 'badge-draft'}`}>
                                    {status}
                                </span>
                            )}
                            <p className="mt-5 font-medium text-white">{prompt || 'Your question'}</p>
                            <ul className="mt-4 space-y-3">
                                {options.map((o, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-zinc-600"></span>
                                        {o}
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

export default CreateSurvey
