import {Link} from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="bg-white shadow">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link to="/" className="text-xl font-bold text-blue-600">Resume Scanner</Link>
                <div className="text-gray-600 hover:text-gray-900">
                    <Link to="/" className="text-gray-600 hover:text-gray-900">Analyze</Link>
                </div>
            </div>
        </nav>
    );
}