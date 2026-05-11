const ShowSurvey = ({allSurveys}) => {
    return(
        allSurveys.map(s => (
            <div key={s.id}>
                <h1>{s.title}</h1>
                <p>{s.description}</p>
                <p>Status: {s.status}</p>
                <ul>
                    {s.questions.map(
                        q => (
                            <div key={q.id}>
                                <p>{q.prompt}</p>
                                <ul>{q.options.map(o => <li key={o}>{o}</li>)}</ul>
                            </div>
                        )
                    )}
                </ul>
            </div>
        ))
    )
}

export default ShowSurvey