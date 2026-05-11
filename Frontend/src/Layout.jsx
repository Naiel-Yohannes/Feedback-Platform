import { Link ,Outlet } from 'react-router-dom'

const Layout = () => {
    return (
        <div>
            <nav>
                <Link to="/dashboard"></Link>
            </nav>
            <Outlet />
        </div>
    )
}

export default Layout