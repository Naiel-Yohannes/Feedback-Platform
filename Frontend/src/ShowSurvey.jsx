import { useNavigate } from "react-router-dom"

const statusBadge = (status) => {
    if (status === 'open') return 'badge-open'
    if (status === 'closed') return 'badge-closed'
    return 'badge-draft'
}

const ShowSurvey = ({filteredSurveys, allSurveys, responses}) => {
    const navigate = useNavigate()
    if(filteredSurveys.length === 0){
        return (
            <p className="px-6 py-14 text-center text-sm text-zinc-500">
                No surveys match your search or filter.
            </p>
        )
    }

    const surveyResponseCounts = (survey) => {
        if(responses.length === 0) {
            return 0
        }
        const i = allSurveys.indexOf(survey)
        if(i !== -1){
            const responseCount = responses[i]?.length || 0
            return responseCount
        }
        return 0
    }
    
    return(
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Responses</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSurveys.map(s => (
                        <tr key={s.id}>
                            <td className="font-medium text-white">{s.title}</td>
                            <td>
                                <span className={statusBadge(s.status)}>{s.status}</span>
                            </td>
                            <td className="text-zinc-500">
                                {surveyResponseCounts(s)}
                            </td>
                            <td className="space-x-1">
                                {s.status === 'draft' ? (    
                                    <button type="button" className="btn-ghost" onClick={() => navigate(`/dashboard/survey/edit/${s.id}`)}>Edit</button>
                                ) : s.status === 'open' ? (
                                    <button type="button" className="btn-ghost" onClick={() => navigate(`/dashboard/survey/${s.id}`)}>View</button>
                                ) : (
                                    <button type="button" className="btn-ghost" onClick={() => navigate(`/dashboard/responses/survey/${s.id}`)}>Results</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
    )
}

export default ShowSurvey