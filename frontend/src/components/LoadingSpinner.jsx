export default function LoadingSpinner({message = "Analyzing your resume..."}) {
    return (
        <div className="flex flex-col items-center justifiy-center py-16">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="mt-4 text-gray-600 text-lg">{message}</p>
            <p className="mt-2 text-gray-400 text-sm">This may take a moment...</p>
        </div>
    )
}