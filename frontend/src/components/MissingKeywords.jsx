export default function MissingKeywords({keywords}) {
    if (!keywords || keywords.length === 0) return null;

    return (
        <div>
            <h3 className="font-semibold text-gray-800 mb-2">Missing Keywords</h3>
            <div className="flex flex-wrap gap-2">
                {keywords.map((k,i) => (
                    <span key={i} className="bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full">
                        {k}
                    </span>
                ))}
            </div>
        </div>
    );
}