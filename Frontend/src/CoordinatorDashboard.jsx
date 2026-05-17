import '@fortawesome/fontawesome-free/css/all.min.css';
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import ShowSurvey from "./ShowSurvey";
import { Link } from "react-router-dom";
import responseServices from '../services/response';
import DashboardLayout from './DashboardLayout'

const CoordinatorDasboard = ({allSurveys}) => {
    const [responses, setResponses] = useState([])

    useEffect(() => {
        const fetchResponses = async () => {
            try {
                const fetchedResponses = await Promise.all(allSurveys.map(s => responseServices.getResponse(s.id)))
                setResponses(fetchedResponses)                
            } catch (error) {
                toast.error(error.response?.data?.error || 'Could not load response counts')
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
        <DashboardLayout
            headerRight={
                <Link to="/dashboard/create" className="btn-secondary">
                    <i className="fa-solid fa-plus mr-2 text-xs" aria-hidden="true"></i>
                    New Survey
                </Link>
            }
        >
            <div className="dashboard-content">
                <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Coordinator Dashboard</h1>
                <p className="mt-1 text-sm text-zinc-500">Manage surveys and review responses.</p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="stat-card">
                        <p className="text-sm text-zinc-500">Total surveys</p>
                        <h3 className="mt-2 text-3xl font-bold tracking-tight text-white">{allSurveys.length}</h3>
                    </div>
                    <div className="stat-card">
                        <p className="text-sm text-zinc-500">Open</p>
                        <h3 className="mt-2 text-3xl font-bold tracking-tight text-white">{openSurveys.length}</h3>
                    </div>
                    <div className="stat-card">
                        <p className="text-sm text-zinc-500">Responses</p>
                        <h3 className="mt-2 text-3xl font-bold tracking-tight text-white">{responses.flat().length}</h3>
                    </div>
                    <div className="stat-card">
                        <p className="text-sm text-zinc-500">Closed</p>
                        <h3 className="mt-2 text-3xl font-bold tracking-tight text-white">{closedSurveys.length}</h3>
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <label className="relative block w-full lg:max-w-md">
                        <span className="sr-only">Search surveys</span>
                        <i className="fa-solid fa-magnifying-glass pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-zinc-500" aria-hidden="true"></i>
                        <input
                            type="text"
                            className="input-field pl-10"
                            value={searchFilter}
                            onChange={e => setSearchFilter(e.target.value)}
                            placeholder="Search surveys..."
                        />
                    </label>
                    <div className="filter-group">
                        <button type="button" className={filter === 'all' ? 'filter-pill-active' : 'filter-pill'} onClick={() => setFilter('all')}>All</button>
                        <button type="button" className={filter === 'draft' ? 'filter-pill-active' : 'filter-pill'} onClick={() => setFilter('draft')}>Draft</button>
                        <button type="button" className={filter === 'open' ? 'filter-pill-active' : 'filter-pill'} onClick={() => setFilter('open')}>Open</button>
                        <button type="button" className={filter === 'closed' ? 'filter-pill-active' : 'filter-pill'} onClick={() => setFilter('closed')}>Closed</button>
                    </div>
                </div>

                <div className="survey-list card mt-6 overflow-hidden">
                    <ShowSurvey filteredSurveys={filteredSurveys} allSurveys={allSurveys} responses={responses} />
                </div>
            </div>
        </DashboardLayout>
    )
}

export default CoordinatorDasboard
