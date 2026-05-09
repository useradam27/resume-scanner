import {Link, useLocation} from "react-router-dom";

export default function Navbar() {
    const location = useLocation();

    function linkClass(path) {
        return location.pathname === path
            ? "text-blue-600 font-medium"
            : "text-gray-600 hover:text-gray-900";
    }

    return (
        <nav className="bg-white border-b">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link to="/" className="text-xl font-bold text-blue-600">Resume Scanner</Link>
                <div className="flex gap-4">
                    <Link to="/" className={linkClass("/")}>Analyze</Link>
                    <Link to="/history" className={linkClass("/history")}>History</Link>
                </div>
            </div>
        </nav>
    );
}