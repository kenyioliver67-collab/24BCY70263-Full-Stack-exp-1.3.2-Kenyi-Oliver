import { Navigate } from "react-router-dom";

function ProtectedRoute({ token, user, allowedRoles, children }) {
    if (!token || !user) {
        return <Navigate to = "/login"
        replace / > ;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to = "/unauthorized"
        replace / > ;
    }

    return children;
}

export default ProtectedRoute;