import { getLoginUrl } from '../services/authService';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  function handleGetStarted() {
    if (isAuthenticated) {
      navigate('/analyze');
    } else {
      window.location.href = getLoginUrl();
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          AI Resume Scanner
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Upload your resume, paste a job posting, and get an
          AI-powered analysis showing how well you match — with
          actionable suggestions to improve your chances.
        </p>
        <button
          onClick={handleGetStarted}
          className="mt-8 bg-blue-600 text-white px-8 py-3
                     rounded-lg text-lg font-medium
                     hover:bg-blue-700 transition-colors"
        >
          Get Started
        </button>
      </div>

      {/* How It Works */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600
                            rounded-full flex items-center
                            justify-center mx-auto mb-4 text-xl font-bold">
              1
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Upload Your Resume
            </h3>
            <p className="text-gray-500 text-sm">
              Drag and drop your PDF or DOCX resume.
              Your file is stored securely in AWS.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600
                            rounded-full flex items-center
                            justify-center mx-auto mb-4 text-xl font-bold">
              2
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Paste a Job Posting
            </h3>
            <p className="text-gray-500 text-sm">
              Copy the full job description from any
              job board and paste it in.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600
                            rounded-full flex items-center
                            justify-center mx-auto mb-4 text-xl font-bold">
              3
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Get AI Analysis
            </h3>
            <p className="text-gray-500 text-sm">
              Receive a match score, missing keywords,
              and specific suggestions to improve your resume.
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Features
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex gap-3">
            <span className="text-green-500 font-bold">&#10003;</span>
            <p className="text-gray-700">AI-powered resume analysis</p>
          </div>
          <div className="flex gap-3">
            <span className="text-green-500 font-bold">&#10003;</span>
            <p className="text-gray-700">Match score with detailed breakdown</p>
          </div>
          <div className="flex gap-3">
            <span className="text-green-500 font-bold">&#10003;</span>
            <p className="text-gray-700">Missing keywords identification</p>
          </div>
          <div className="flex gap-3">
            <span className="text-green-500 font-bold">&#10003;</span>
            <p className="text-gray-700">Actionable improvement suggestions</p>
          </div>
          <div className="flex gap-3">
            <span className="text-green-500 font-bold">&#10003;</span>
            <p className="text-gray-700">Analysis history to track your progress</p>
          </div>
          <div className="flex gap-3">
            <span className="text-green-500 font-bold">&#10003;</span>
            <p className="text-gray-700">Secure file storage with resume download</p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-12">
        <p className="text-gray-500 mb-4">
          Free to use. Create an account to get started.
        </p>
        <button
          onClick={handleGetStarted}
          className="bg-blue-600 text-white px-8 py-3
                     rounded-lg text-lg font-medium
                     hover:bg-blue-700 transition-colors"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
