import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import surveyServices from '../services/survey'
import { useNavigate } from "react-router-dom"

const EditSurvey = ({setAllSurveys}) => {
    const navigate = useNavigate()
    const {id} = useParams()
    
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState('')
    const [prompt, setPrompt] = useState('')
    const [options, setOptions] = useState([])
    const [option, setOption] = useState('')

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
                console.error(error)
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
                questions: [
                    {
                        prompt,
                        options
                    }
                ]
            }

            const newSurvey = await surveyServices.updateSurvey(id, updatedSurvey)
            setAllSurveys(prev => prev.map(s => s.id === id ? newSurvey : s))
            navigate('/dashboard')
        } catch (error) {
            console.error(error)
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

    return(
        <form onSubmit={handleUpdate}>
            <h1>Edit Draft Survey</h1>
            <label>
                Title: <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
            </label>
            <label>
                Description: <input type="text" value={description} onChange={e => setDescription(e.target.value)} />
            </label>
            <label>
                Status: 
                <select value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="">Select status</option>
                    <option value="draft">Draft</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                </select>
            </label>
            <label>
                Question: <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} />
            </label>
            <label>
                Options:
                <ul>
                    {options.map((opt, index) => (
                        <li key={index}>
                            {opt} <button type="button" onClick={() => removeOption(index)}>Remove</button>
                        </li>
                    ))}
                </ul>
                <input type="text" value={option} onChange={e => setOption(e.target.value)} placeholder="Add option" />
                <button type="button" onClick={() => addOption()}>Add Option</button>
            </label>
            <button type="button" onClick={() => navigate(`/dashboard/survey/${id}`)}>Cancel</button>
            <button type="submit">Save Changes</button>
        </form>
    )
}

export default EditSurvey