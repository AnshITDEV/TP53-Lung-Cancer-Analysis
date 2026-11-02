// Centralized API client for TP53 Lung Cancer Analysis System
const API_BASE = '/api';

export const fetchHealth = async () => {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Backend offline');
    return await res.json();
  } catch (err) {
    console.warn('[API] Health check failed, falling back:', err.message);
    return { status: 'offline', error: err.message };
  }
};

export const fetchStats = async () => {
  try {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.success && json.data) return json.data;
    throw new Error('Invalid stats response');
  } catch (err) {
    console.warn('[API] fetchStats error:', err.message);
    throw err;
  }
};

export const fetchPatients = async ({ q = '', limit = 50, subtype = 'ALL', mutation = 'ALL' } = {}) => {
  try {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (limit) params.set('limit', limit);
    if (subtype) params.set('subtype', subtype);
    if (mutation) params.set('mutation', mutation);

    const res = await fetch(`${API_BASE}/patients?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || { patients: [], total_matches: 0 };
  } catch (err) {
    console.warn('[API] fetchPatients error:', err.message);
    throw err;
  }
};

export const fetchPatientDetail = async (patientId) => {
  try {
    const res = await fetch(`${API_BASE}/patients/${encodeURIComponent(patientId)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}: Patient not found`);
    const json = await res.json();
    return json;
  } catch (err) {
    console.warn('[API] fetchPatientDetail error:', err.message);
    throw err;
  }
};

export const postPrediction = async (features) => {
  try {
    const res = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(features),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${res.status}`);
    }
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('[API] postPrediction error:', err.message);
    throw err;
  }
};

export const fetchGeneInfo = async () => {
  try {
    const res = await fetch(`${API_BASE}/gene-info`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('[API] fetchGeneInfo error:', err.message);
    throw err;
  }
};

export const fetchModelInfo = async () => {
  try {
    const res = await fetch(`${API_BASE}/model/info`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json;
  } catch (err) {
    console.warn('[API] fetchModelInfo error:', err.message);
    return null;
  }
};

