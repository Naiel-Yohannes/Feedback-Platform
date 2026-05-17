import ShowMemberSurvey from "./ShowMemberSurvey"
import DashboardLayout from './DashboardLayout'

const MemberDashboard = ({allSurveys}) => {
    const openCount = allSurveys.filter(s => s.status === 'open').length

    return (
        <DashboardLayout>
            <div className="dashboard-content">
                <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Member Dashboard</h1>
                <p className="mt-2 max-w-2xl text-sm text-zinc-500">
                    View surveys shared by coordinators and submit your feedback.
                </p>

                <div className="mt-8 stat-card inline-block min-w-[11rem]">
                    <p className="text-sm text-zinc-500">Open surveys</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-white">{openCount}</p>
                </div>

                <h2 className="mt-10 text-lg font-semibold text-white">Available surveys</h2>
                <p className="mt-1 text-sm text-zinc-500">Start an open survey or view closed ones.</p>

                <div className="card mt-5 overflow-hidden">
                    <ShowMemberSurvey allSurveys={allSurveys} />
                </div>
            </div>
        </DashboardLayout>
    )
}

export default MemberDashboard
