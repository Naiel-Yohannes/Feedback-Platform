import { useNavigate } from "react-router-dom";

const ShowMemberSurvey = ({allSurveys}) => {
    const navigate = useNavigate()
    return (
        <table>
            <thead>
                <tr>
                    <th>Survey Title</th>
                    <th>Actions</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {allSurveys.map(s => (
                    <tr key={s.id}>
                        <td>{s.title}</td>
                        <td>{s.status}</td>
                        <td>{s.status === 'open' ? <button onClick={() => navigate(`/dashboard/survey/response/${s.id}`)}>Start Survey</button> : <button>Closed</button>}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default ShowMemberSurvey;