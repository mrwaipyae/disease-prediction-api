import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    try {
        const persistedAuth = JSON.parse(localStorage.getItem("persist:auth"));
        if (!persistedAuth) return <Navigate to="/login" />;

        // Parse inner JSON strings to get actual values
        const isAuthenticated = JSON.parse(persistedAuth.isAuthenticated);
        const token = JSON.parse(persistedAuth.token);

        // Check if user is authenticated and token exists
        if (isAuthenticated === true && token) {
            return children;
        } else {
            return <Navigate to="/login" />;
        }
    } catch (error) {
        return <Navigate to="/login" />;
    }
}
