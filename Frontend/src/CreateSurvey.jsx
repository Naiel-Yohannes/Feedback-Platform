import { useState } from "react"
import surveyServices from '../services/survey'

const CreateSurvey = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState('')
    const [prompt, setPrompt] = useState('')
    const [options, setOptions] = useState([])
    const [option, setOption] = useState('')

    const VALID_STATUSES = ['open', 'closed', 'draft']

    const surveyForm = async(e) => {
        e.preventDefault()
        try{
            const survey = {
                title,
                description,
                prompt,
                status,
                options
            }
            await surveyServices.createSurvey(survey)
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
            setOptions([...options, option])
            setOption('')
        }catch(error){
            console.log(error)
        }
    }
    return(
        <div>
            <h1>Create Survey</h1>
            <form onSubmit={surveyForm}>
                <label>
                    Title: <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
                </label>
                <label>
                    Description: <input type="text" value={description} onChange={e => setDescription(e.target.value)} />
                </label>
                <label>
                    Question: <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} />
                </label>
                {VALID_STATUSES.map(s => (
                    <button type="button" key={s} onClick={() => setStatus(s)}>${s}</button>
                ))
                }
                <label>
                    Option: <input type="text" value={option} onChange={e => setOption(e.target.value)} />
                </label>
                <button onClick={() => addOption()}>Add option</button>
                <button type="submit">Send</button>
            </form>
        </div>
    )
}

export default CreateSurvey