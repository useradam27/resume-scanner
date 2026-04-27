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