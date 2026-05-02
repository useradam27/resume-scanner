import { useState, useRef } from 'react';

const ALLOWED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export default function FileUpload({file, onFileSelect, onFileClear}) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef(null);

    function validateFile(f) {
        if (!ALLOWED_TYPES.includes(f.type)) {
            setError('Only PDF and DOCX files are accepted.');
            return false;
        }
        if (f.size > MAX_FILE_SIZE) {
            setError('File size must be under 10 MB.');
            return false;
        }
        setError('');
        return true;
    }

    function handleDrop(e) {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && validateFile(droppedFile)) {
            onFileSelect(droppedFile);
        }
    }

    function handleChange(e) {
        const selectedFile = e.target.files[0];
        if (selectedFile && validateFile(selectedFile)) {
            onFileSelect(selectedFile);
        }
    }

    function formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    if (file) {
        return (
            <div className="border-2 border-green-300 bg-green-50 rounded-lg p-4 flex items-center justify-between">
                <div>
                    <p className="font-medium text-green-800">{file.name}</p>
                    <p className="text-sm text-gray-500">{formatSize(file.size)}</p>
                </div>
                <button
                    onClick={() => {
                        onFileClear();
                        if(inputRef.current) inputRef.current.value = '';
                    }}
                    className="text-red-500 hover:text-red-700 font-medium text-sm"
                    >
                    Remove
                    </button>
            </div>
        );
    }

    return (
        <div>
            <div
                onDragOver={(e) => {e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
            >
                <p className="text-gray-600 text-lg">Drag and drop your resume here</p>
                <p className="text-gray-400 text-sm mt-2">or click to browse (PDF or DOCX, max 10MB)</p>
        </div>
        <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={handleChange}
        />
        {error && (<p className="text-red-500 text-sm mt-2">{error}</p>
        )}
        </div>
    );


}