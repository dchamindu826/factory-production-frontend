// src/services/dryProcessService.js

const API_BASE_URL = 'http://localhost:5001/api/dry-process';

// Helper function to get token and create headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  // --- This console.log is CRUCIAL for debugging ---
  console.log('[dryProcessService] getAuthHeaders - Token from localStorage:', token);
  // ---
  if (!token) {
    console.error("[dryProcessService] Auth token IS NULL or not found when creating headers.");
    // Even if token is null, we return the headers object.
    // The backend will respond with 401 if 'Bearer null' or no token.
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Add a new dry process entry
export const addDryProcessEntry = async (entryData) => {
  console.log("[dryProcessService] addDryProcessEntry called with data:", entryData); // For checking if data entry calls this
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: getAuthHeaders(), // Calling the helper
      body: JSON.stringify(entryData),
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("[dryProcessService] addDryProcessEntry - API Error Response:", data);
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error('Error adding dry process entry (service):', error);
    throw error;
  }
};

// Get all pending dry process entries
export const getPendingDryProcess = async () => {
  console.log("[dryProcessService] Attempting to fetch pending dry process entries...");
  try {
    const response = await fetch(`${API_BASE_URL}/pending`, {
      method: 'GET',
      headers: getAuthHeaders() // Calling the helper
    });
    const data = await response.json(); // Try to parse JSON even if response is not ok
    if (!response.ok) {
      console.error("[dryProcessService] API error response for getPendingDryProcess:", data);
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error('Error fetching pending dry process entries (service):', error);
    throw error;
  }
};

// Approve a specific dry process entry
export const approveDryProcess = async (id) => {
  console.log(`[dryProcessService] Attempting to approve dry process entry ID: ${id}`);
   try {
    const response = await fetch(`${API_BASE_URL}/approve/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders() // Calling the helper
    });
    const data = await response.json();
    if (!response.ok) {
      console.error(`[dryProcessService] API error response for approveDryProcess (ID: ${id}):`, data);
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error(`Error approving dry process entry ${id} (service):`, error);
    throw error;
  }
};

// Reject a specific dry process entry
export const rejectDryProcess = async (id) => {
  console.log(`[dryProcessService] Attempting to reject dry process entry ID: ${id}`);
   try {
    const response = await fetch(`${API_BASE_URL}/reject/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders() // Calling the helper
    });
    const data = await response.json();
    if (!response.ok) {
      console.error(`[dryProcessService] API error response for rejectDryProcess (ID: ${id}):`, data);
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return await data; // Changed from 'return await response.json();' to 'return data;' as it's already parsed
  } catch (error) {
    console.error(`Error rejecting dry process entry ${id} (service):`, error);
    throw error;
  }
};
