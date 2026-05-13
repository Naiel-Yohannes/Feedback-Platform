import { useNavigate } from "react-router-dom"

const ShowSurvey = ({filteredSurveys}) => {
    const navigate = useNavigate()
    if(filteredSurveys.length === 0){
        return <p>No surveys found</p>
    }
    return(
            <table >
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
                            <td>{s.title}</td>
                            <td>{s.status}</td>
                            <td></td>
                            <td>
                                {s.status === 'draft' ? (
                                    <button>Edit</button>
                                ) : s.status === 'open' ? (
                                    <button onClick={() => navigate(`/dashboard/survey/${s.id}`)}>View</button>
                                ) : (
                                    <button>Results</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
    )
}

export default ShowSurvey