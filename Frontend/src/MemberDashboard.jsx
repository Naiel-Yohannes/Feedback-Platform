import { Link } from "react-router-dom"
import ShowMemberSurvey from "./ShowMemberSurvey"

const MemberDashboard = ({allSurveys}) => {
    return (
        <div>
            <div className="topbar">
                <h2>Feedback Platform</h2>
            </div>
            <div className="sidebar">
                <Link to="/settings"><i className="fa-solid fa-gear"></i>Settings</Link>
            </div>
            <div className="mainbar">
                <h2>Member Dashboard</h2>
                <p>Welcome to the Feedback Platform! Here you can view and respond to surveys created by coordinators.</p>
                <h3>Available Surveys</h3>
                <p>Browse through the list of surveys and share your valuable feedback with coordinators.</p>
                <ShowMemberSurvey allSurveys={allSurveys} />
            </div>
        </div>
    )
}

export default MemberDashboard