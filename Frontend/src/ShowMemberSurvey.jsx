import { useNavigate } from "react-router-dom";

const statusBadge = (status) => {
    if (status === 'open') return 'badge-open'
    if (status === 'closed') return 'badge-closed'
    return 'badge-draft'
}

const ShowMemberSurvey = ({allSurveys}) => {
    const navigate = useNavigate()

    if (allSurveys.length === 0) {
        return (
            <p className="px-6 py-14 text-center text-sm text-zinc-500">
                No surveys are available right now.
            </p>
        )
    }

    return (
        <table className="data-table">
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
                        <td className="font-medium text-white">{s.title}</td>
                        <td>
                            <span className={statusBadge(s.status)}>{s.status}</span>
                        </td>
                        <td>
                            {s.status === 'open' ? (
                                <button type="button" className="btn-primary" onClick={() => navigate(`/dashboard/survey/response/${s.id}`)}>
                                    Start Survey
                                </button>
                            ) : (
                                <button type="button" className="btn-secondary" disabled>
                                    Closed
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default ShowMemberSurvey;
