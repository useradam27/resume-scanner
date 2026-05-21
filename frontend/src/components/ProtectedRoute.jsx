import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner message="Checking auth..." />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
}