import {useState, useEffect, use} from 'react';
import AnalysisCard from '../components/AnalysisCard';
import ResultsDisplay from '../components/ResultsDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import { getHistory, getAnalysis } from '../services/historyService';

export default function HistoryPage() {
    const [history, setHistory] = useState([]);
    const [selectedResult, setSelectedResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadHistory();
    }, []);

    async function loadHistory() {
        try {
            const data = await getHistory();
            setHistory(data);
        } catch (err) {
            setError(err.message || 'Failed to load history.');
        } finally {
            setLoading(false);
        }
    }

    async function handleCardClick(analysisId) {
        setDetailLoading(true);
        setError('');
        try {
            const data = await getAnalysis(analysisId);
            setSelectedResult(data);
        } catch (err) {
            setError(err.message || 'Failed to load analysis details.');
        } finally {
            setDetailLoading(false);
        }
    }

    if (loading) {
        return <LoadingSpinner message="Loading history..." />;
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Analysis History</h1>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm mb-4">
                    {error}
                </div>
            )}

            {selectedResult ? (
                <div>
                    <button
                        onClick={() => setSelectedResult(null)}
                        className="text-blue-600 hover:text-blue-800 mb-4 text-sm font-medium"
                    >
                        &larr; Back to History
                    </button>

                    <ResultsDisplay result={selectedResult} />
                </div>
            ) : detailLoading ? (
                <LoadingSpinner message="Loading analysis..." />
            ) : history.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-gray-500 text-lg">No analysis history found.</p>
                    <p className="text-gray-400 text-sm mt-2">Go to the Analyze page to scan your first resume.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {history.map((item) => (
                        <AnalysisCard
                            key={item.analysisId}
                            analysis={item}
                            onClick={() => handleCardClick(item.analysisId)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}