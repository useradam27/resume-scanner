import ScoreGauge from "./ScoreGauge";
import StrengthsTab from "./StrengthsTag";
import MissingKeywords from "./MissingKeywords";
import SuggestionsList from "./SuggestionsList";
import { downloadResume } from "../services/resumeService";

function MatchBadge({label, value }) {
    const colors = {
        strong: 'bg-green-100 text-green-800',
        moderate: 'bg-yellow-100 text-yellow-800',
        weak: 'bg-red-100 text-red-800',
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm">{label}:</span>
            <span className={`text-sm px-2 py-0.5 rounded-full font-medium ${colors[value] || 'bg-gray-100'}`}>
                {value}
            </span>
        </div>
    );
}

export default function ResultsDisplay({result, resumeS3Key, resumeFileName}) {
    async function handleDownload() {
        try {
            await downloadResume(resumeS3Key, resumeFileName);
        } catch (err) {
            alert("Failed to download resume. Please try again.");
        }
    }
    return (
        <div className="space-y-6">

            {/* Score and summary */}
            <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
                <ScoreGauge score={result.overallScore} />
                <p className="text-gray-600 mt-4">{result.summary}</p>
                <div className = "flex justify-center gap-6 mt-4">
                    <MatchBadge label="Experience" value={result.experienceMatch} />
                    <MatchBadge label="Skills" value={result.skillsMatch} />
                </div>
            </div>

            {resumeS3Key && (
                <div className="bg-white rounded-xl shadow-sm border
                                p-4 flex items-center justify-between">
                <div>
                    <p className="font-medium text-gray-800">
                    {resumeFileName || 'Resume'}
                    </p>
                    <p className="text-sm text-gray-400">
                    Download the resume used for this analysis
                    </p>
                </div>
                <button
                    onClick={handleDownload}
                    className="bg-blue-600 text-white px-4 py-2
                            rounded-lg text-sm font-medium
                            hover:bg-blue-700 transition-colors"
                >
                    Download
                </button>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl shadow-sm border p-5">
                    <StrengthsTab strengths={result.strengths} />
                </div>
                <div className="bg-white rounded-xl shadow-sm border p-5">
                    <MissingKeywords keywords={result.missingKeywords} />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-5">
                <SuggestionsList suggestions={result.suggestions} />
            </div>

        </div>
    );
}