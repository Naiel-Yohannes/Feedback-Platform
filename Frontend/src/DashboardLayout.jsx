import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '@fortawesome/fontawesome-free/css/all.min.css'

const DashboardLayout = ({ children, headerRight }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const location = useLocation()

    const isSurveysActive = location.pathname.startsWith('/dashboard')
    const isSettingsActive = location.pathname === '/settings'

    const closeSidebar = () => setSidebarOpen(false)

    return (
        <div className="page-shell">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
                    onClick={closeSidebar}
                    aria-hidden="true"
                />
            )}

            <aside className={`dashboard-sidebar ${sidebarOpen ? 'dashboard-sidebar-open' : ''}`}>
                <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3 lg:hidden">
                    <span className="text-sm font-medium text-zinc-400">Menu</span>
                    <button
                        type="button"
                        className="btn-icon border-0 p-2"
                        onClick={closeSidebar}
                        aria-label="Close navigation menu"
                    >
                        <i className="fa-solid fa-xmark" aria-hidden="true"></i>
                    </button>
                </div>
                <nav className="flex flex-col gap-1 p-4">
                    <Link
                        to="/dashboard"
                        onClick={closeSidebar}
                        className={isSurveysActive ? 'nav-link-active' : 'nav-link'}
                    >
                        <i className="fa-solid fa-clipboard-list w-4 text-center" aria-hidden="true"></i>
                        Surveys
                    </Link>
                    <Link
                        to="/settings"
                        onClick={closeSidebar}
                        className={isSettingsActive ? 'nav-link-active' : 'nav-link'}
                    >
                        <i className="fa-solid fa-gear w-4 text-center" aria-hidden="true"></i>
                        Settings
                    </Link>
                </nav>
            </aside>

            <header className="dashboard-topbar">
                <div className="flex min-w-0 items-center gap-3">
                    <button
                        type="button"
                        className="btn-icon shrink-0 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Open navigation menu"
                    >
                        <i className="fa-solid fa-bars" aria-hidden="true"></i>
                    </button>
                    <h2 className="truncate text-base font-semibold text-white sm:text-lg">Feedback Platform</h2>
                </div>
                {headerRight && (
                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                        {headerRight}
                    </div>
                )}
            </header>

            <main className="dashboard-main">
                {children}
            </main>
        </div>
    )
}

export default DashboardLayout
