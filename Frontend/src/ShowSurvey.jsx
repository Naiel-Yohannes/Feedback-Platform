const ShowSurvey = ({filteredSurveys}) => {
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
                                    <button>View</button>
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