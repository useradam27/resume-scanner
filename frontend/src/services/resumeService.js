import api from './api';

export async function analyzeResume(file, jobPosting) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('jobPosting', jobPosting);

    const response = await api.post('/api/analyze', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}

export async function downloadResume(s3Key, fileName) {
    const response = await api.get('/api/download', {
        params: { s3Key },
        responseType: 'blob',
    });

    // Create a blob URL and trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName || 'resume.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
}