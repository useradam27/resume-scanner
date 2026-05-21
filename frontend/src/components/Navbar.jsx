import { Link, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getLoginUrl } from "../services/authService";

export default function Navbar() {
    const location = useLocation();
    const { user, isAuthenticated, logout } = useAuth();

    function linkClass(path) {
        return location.pathname === path
            ? "text-blue-600 font-medium"
            : "text-gray-600 hover:text-gray-900";
    }

    return (
        <nav className="bg-white border-b">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link to="/" className="text-xl font-bold text-blue-600">Resume Scanner</Link>
                {isAuthenticated ? (
                    <div className="flex items-center gap-4">
                        <Link to="/analyze" className={linkClass("/analyze")}>Analyze</Link>
                        <Link to="/history" className={linkClass("/history")}>History</Link>
                        <span className="text-gray-400 text-sm">{user?.email}</span>
                        <button
                            onClick={logout}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <a
                        href={getLoginUrl()}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                        Log In
                    </a>
                )}
            </div>
        </nav>
    );
}