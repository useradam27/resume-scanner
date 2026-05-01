export default function SuggestionsList({suggestions}) {
    if (!suggestions || suggestions.length === 0) return null;

    return (
        <div>
            <h3 className="font-semibold text-gray-800 mb-2">Suggestions for Improvement</h3>
            <div className="space-y-3">
                {suggestions.map((s,i) => (
                    <div key={i} className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                        <p className="text-sm text-gray-700">{s}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}