export default function StrengthsTab({strengths}) {
    if (!strengths || strengths.length === 0) return null;

    return (
        <div>
            <h3 className ="font-semibold text-gray-800 mb-2">Strengths</h3>
            <div className="flex flex-wrap gap-2">
                {strengths.map((s,i) => (
                    <span key={i} className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                        {s}
                    </span>
                ))}
            </div>
        </div>
    );
}