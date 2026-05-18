import useAuth from "../hooks/useAuth";
import { getLoginUrl } from "../services/authService";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner message="Checking authentication..." />;
    }

    if (!isAuthenticated) {
        window.location.href = getLoginUrl();
        return null;
    }

    return children;

}