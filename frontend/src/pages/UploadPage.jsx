import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import JobPostingInput from '../components/JobPostingInput';
import ResultsDisplay from '../components/ResultsDisplay';
import { analyzeResume } from '../services/resumeService';

export default function UploadPage() {
    const [file, setFile] = useState(null);
    const [jobPosting, setJobPosting] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit() {
        if (!file) {
            setError('Please select a resume file.');
            return;
        }
        if (jobPosting.trimEnd().length < 50) {
            setError('Please enter a more detailed job posting (at least 50 characters).');
            return;
        }

        setError('');
        setResult(null);
        setLoading(true);

        try {
            const data = await analyzeResume(file, jobPosting);
            setResult(data);
        } catch (err) {
            setError(err.message || 'Analysis failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    function handleReset() {
        setFile(null);
        setJobPosting('');
        setResult(null);
        setError('');
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    AI Resume Scanner
                </h1>
                <p className="text-gray-500 mt-2">
                    Upload your resume and paste a job posting to see how well you match.
                </p>
            </div>

            {!result && !loading  && (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <label className="block font-medium text-gray-700 mb-2">Resume</label>
                        <FileUpload 
                            file={file}
                            onFileChange={setFile}
                            onFileClear={() => setFile(null)} 
                        />
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <label className="block font-medium text-gray-700 mb-2">Job Posting</label>
                        <JobPostingInput 
                            value={jobPosting} 
                            onChange={setJobPosting} 
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Analyze Resume
                    </button>
                </div>
            )}

            {loading && (
                <LoadingSpinner message="Analyzing your resume..." />
            )}

            {result && (
                <div>
                    <ResultsDisplay result={result} />
                    <button
                        onClick={handleReset}
                        className = "mt-6 w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                        Analyze Another Resume
                    </button>
                </div>
            )}
        </div>
    );
}