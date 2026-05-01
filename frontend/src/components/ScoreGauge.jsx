export default function ScoreGauge({score}) {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const progress = (score / 100) * circumference;

    function getColor() {
        if (score >= 71) return '#22c55e'; // Green
        if (score >= 41) return '#eab308'; // Yellow
        return '#ef4444'; // Red 
    }

    return (
        <div className="flex flex-col items-center">
            <svg width="160" height="160" className="-rotate-90">
                <circle cx="80" cy="80" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="12" />
                <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="none"
                    stroke={getColor()}
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - progress}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                    />
            </svg>
            <div className="-mt-24 text-center">
                <p className="text-4xl font-bold" style={{color: getColor()}}>{score}%</p>
                <p className="text-gray-500">Match Score</p>
            </div>
        </div>
    );
}