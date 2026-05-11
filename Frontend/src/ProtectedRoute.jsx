import { Navigate, Outlet } from "react-router-dom"

const ProtectedRoute = ({user}) => {
    if(user === null){
        return <Navigate to="/" />
    }
    return <Outlet />
}

export default ProtectedRoute