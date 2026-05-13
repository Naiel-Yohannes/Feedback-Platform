import CoordinatorDasboard from "./CoordinatorDashboard"
import MemberDashboard from "./MemberDashboard"               

const Dashboard = ({user, allSurveys}) => {

    return (
        <div>
            {user.role === 'coordinator' ? <CoordinatorDasboard allSurveys={allSurveys}/> : <MemberDashboard />}
        </div>
    )
}

export default Dashboard