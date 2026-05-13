import { useState } from "react"
import surveyServices from '../services/survey'

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
            console.log('Title must be at least 10 characters.')
            return
        }
        if (!status) {
            console.log('Choose a status (draft, open, or closed).')
            return
        }
        if (trimmedPrompt.length < 5) {
            console.log('Question must be at least 5 characters.')
            return
        }
        if (trimmedOptions.length === 0) {
            console.log('Add at least one non-empty option.')
            return
        }
        if (trimmedDescription.length > 0 && trimmedDescription.length < 10) {
            console.log('Description must be at least 10 characters, or leave it empty.')
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
        }catch(error){
            console.log(error)
        }
    }
    const addOption = () => {
        try{
            if(option.trim() === '') return
            setOptions([...options, option])
            setOption('')
        }catch(error){
            console.log(error)
        }
    }

    const removeOption = (indexToRemove) => {
        setOptions(options.filter((_, i) => i !== indexToRemove)) 
    }

    return(
        <div>
            <div className="topbar">
                <div>
                    <h2>Create Survey</h2>
                </div>
                <div>
                    {status && (
                        <button onClick={() => surveyForm()}>
                            {status === 'draft' ? 'Save Draft' : status === 'closed' ? 'Archive' : 'Publish'}
                        </button>
                    )}
                </div>
            </div>
            <div className="leftbar">
                <form>
                    <label>
                        Title <br /> <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
                    </label>

                    <label>
                        Description <br /> <input type="text" value={description} onChange={e => setDescription(e.target.value)} />
                    </label>

                    <label>
                        Status <br />
                        {VALID_STATUSES.map(s => (
                            <button type="button" key={s} onClick={() => setStatus(s)}>{s}</button>
                        ))
                        }
                    </label>
                    
                    <label>
                        Question <br /> <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} />
                    </label>
                    
                    {options.map((o, i) => (
                        <div key={i}>
                            <span>{o}</span>
                            <button type="button" onClick={() => removeOption(i)}>Remove</button>
                        </div>
                    ))}

                    <label>
                        Option <br /> <input type="text" value={option} onChange={e => setOption(e.target.value)} />
                    </label>
                    <button type="button" onClick={addOption}>+ Add option</button>
                </form>
            </div>
                <div className="rightbar">
                    <p>Preview</p>
                    <div>
                        <h2>{title}</h2>
                        <p>{description}</p>
                        <p>{status}</p>
                        <p>{prompt}</p>
                        <ul>
                            {options.map((o, i) => (
                                <div key={i}>
                                    <i className="fa-regular fa-circle mr-2"></i> {o}
                                </div>
                            ))}
                        </ul>
                    </div>
                </div>
        </div>
    )
}

export default CreateSurvey