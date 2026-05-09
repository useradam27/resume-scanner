import api from './api';

export async function getHistory() {
    const response = await api.get('/api/history');
    return response.data;
}

export async function getAnalysis(analysisID) {
    const response = await api.get(`/api/analysis/${analysisID}`);
    return response.data;
}