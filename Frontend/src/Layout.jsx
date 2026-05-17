import { Outlet } from 'react-router-dom'

const Layout = () => {
    return (
        <div className="page-shell">
            <Outlet />
        </div>
    )
}

export default Layout
