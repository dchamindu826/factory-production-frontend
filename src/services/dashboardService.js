// src/services/dashboardService.js (or specialNotesService.js)

const API_BASE_URL = 'http://localhost:5001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) { console.error("[Service] Auth token not found."); }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// --- Special Notes Functions ---
export const getSpecialNotes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/special-notes`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch special notes.');
    }
    return data;
  } catch (error) {
    console.error('Error fetching special notes (service):', error);
    throw error;
  }
};

export const getDashboardSummaryData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/summary`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dashboard summary.');
      }
      return data; // Should return { bulkInputsToday, unitsCompletedToday, ... }
    } catch (error) {
      console.error('Error fetching dashboard summary data (service):', error);
      throw error;
    }
};

export const addSpecialNote = async (noteData) => {
  // noteData should be { note_date (optional), note_content }
  try {
    const response = await fetch(`${API_BASE_URL}/special-notes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(noteData)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to add special note.');
    }
    return data;
  } catch (error) {
    console.error('Error adding special note (service):', error);
    throw error;
  }
};

export const deactivateSpecialNote = async (noteId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/special-notes/${noteId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to deactivate special note.');
        }
        return data;
    } catch (error) {
        console.error(`Error deactivating special note ${noteId} (service):`, error);
        throw error;
    }
};

// --- Functions for Dashboard Summary Data (will be added in Phase 2) ---
// export const getDashboardSummary = async () => { ... };

// --- Functions for Dashboard Chart Data (will be added in Phase 3) ---
// export const getDryProcessChartData = async (timeframe) => { ... };
