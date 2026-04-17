import { Navigate, Outlet } from "react-router-dom";

function GuestRoute() {
    const token = sessionStorage.getItem('auth_token');
    if (token) {
        return <Navigate to="/conversations" replace />;
    }
    return <Outlet />;
}

export default GuestRoute;