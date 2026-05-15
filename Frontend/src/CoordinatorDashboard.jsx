import '@fortawesome/fontawesome-free/css/all.min.css';
import { useEffect, useState } from "react"
import ShowSurvey from "./ShowSurvey";
import { Link } from "react-router-dom";
import responseServices from '../services/response';

const CoordinatorDasboard = ({allSurveys}) => {
    const [responses, setResponses] = useState([])

    useEffect(() => {
        const fetchResponses = async () => {
            try {
                const fetchedResponses = await Promise.all(allSurveys.map(s => responseServices.getResponse(s.id)))
                setResponses(fetchedResponses)                
            } catch (error) {
                console.error(error)
            }
        }
        fetchResponses()
    }, [allSurveys])

    const [filter, setFilter] = useState('all')
    const [searchFilter, setSearchFilter] = useState('')
    const searchFilteredSurveys = allSurveys.filter(s => s.title.toLowerCase().includes(searchFilter.toLowerCase()))

    const openSurveys = allSurveys.filter(s => s.status === 'open')
    const closedSurveys = allSurveys.filter(s => s.status === 'closed')

    const filteredSurveys = filter === 'all' ? searchFilteredSurveys : searchFilteredSurveys.filter(s => s.status === filter)
    
    return (
        <div>
            <div className="topbar">
                <h2>Feedback Platform</h2>
                <Link to="/dashboard/create">+ New Survey</Link>
            </div>
            <div className="sidebar">
                <Link to="/dashboard"><i className="fa-solid fa-table-cells-large"></i>Surveys</Link>
                <Link to="/settings"><i className="fa-solid fa-gear"></i>Settings</Link>
            </div>
            <div className="mainbar">
                <h2>Coordinator Dashboard</h2>
                <div className="info">
                    <div>
                        <p>Total surveys</p>
                        <h3>{allSurveys.length}</h3>
                    </div>
                    <div>
                        <p>Open</p>
                        <h3>{openSurveys.length}</h3>
                    </div>
                    <div>
                        <p>Responses</p>
                        <h3>{responses.flat().length}</h3>
                    </div>
                    <div>
                        <p>Closed</p>
                        <h3>{closedSurveys.length}</h3>
                    </div>
                </div>
                <div className="filter">
                    <span><i className="fa-solid fa-magnifying-glass"></i><input type="text" value={searchFilter} onChange={e => setSearchFilter(e.target.value)} placeholder="Search surveys..." /></span>
                    <button onClick={() => setFilter('all')}>All</button>
                    <button onClick={() => setFilter('draft')}>Draft</button>
                    <button onClick={() => setFilter('open')}>Open</button>
                    <button onClick={() => setFilter('closed')}>Closed</button>
                </div>
                <div className="survey-list">
                    <ShowSurvey filteredSurveys={filteredSurveys} />
                </div>
            </div>
        </div>
    )
}

export default CoordinatorDasboard