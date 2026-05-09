export default function AnalysisCard({ analysis, onClick }) {

    const score = parseInt(analysis.overallScore, 10);

    function getScoreColor() {
        if (score >= 71) return 'text-green-600';
        if (score >= 41) return 'text-yellow-600';
        return 'text-red-600';
    }

    function formatDate(isoString) {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    return (
        <button
            onClick={onClick}
            className="w-full bg-white rounded-xl shadow-sm border p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
        >
            <div>
                <p className="font-medium text-gray-800">{analysis.jobTitle}</p>
                <p className="text-sm text-gray-400 mt-1">{formatDate(analysis.timestamp)}</p>
            </div>
            <div className={`text-lg font-bold ${getScoreColor()}`}>
                {score}
            </div>
        </button>
    );
}