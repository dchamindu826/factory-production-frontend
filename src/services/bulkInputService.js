// src/services/bulkInputService.js

const API_BASE_URL = 'http://localhost:5001/api/bulk-inputs';

// Helper function to get token and create headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  // --- Debug Log එක මෙතන තියෙන්න ඕන ---
  console.log('[bulkInputService] getAuthHeaders - Token being used for API call:', token);
  // ---
  if (!token) {
    console.error("[bulkInputService] Auth token IS NULL or not found in getAuthHeaders when creating headers.");
    // It's better to still return the headers object,
    // the backend will reject 'Bearer null' or missing token.
  }
  return {
    'Authorization': `Bearer ${token}`, // Token null උනොත් මෙතන 'Bearer null' කියලා යයි
    'Content-Type': 'application/json'
  };
};

// Add a new bulk input entry
export const addBulkInput = async (bulkInputData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: getAuthHeaders(), // <<<--- getAuthHeaders() call එක මෙතන තියෙනවා
      body: JSON.stringify(bulkInputData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error('Error adding bulk input (service):', error);
    throw error;
  }
};

// Get all pending bulk inputs
export const getPendingBulkInputs = async () => {
  try {
    console.log("[bulkInputService] Attempting to fetch pending bulk inputs...");
    const response = await fetch(`${API_BASE_URL}/pending`, {
      method: 'GET',
      headers: getAuthHeaders() // <<<--- getAuthHeaders() call එක මෙතනත් දාන්න ඕන
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response as JSON' }));
      console.error("[bulkInputService] API error response for pending bulk inputs:", errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching pending bulk inputs (service):', error);
    throw error;
  }
};

// Approve a specific bulk input
export const approveBulkInput = async (id) => {
   try {
    const response = await fetch(`${API_BASE_URL}/approve/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders() // <<<--- getAuthHeaders() call එක මෙතනත් දාන්න ඕන
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response as JSON' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error approving bulk input ${id} (service):`, error);
    throw error;
  }
};

// Reject a specific bulk input
export const rejectBulkInput = async (id) => {
   try {
    const response = await fetch(`${API_BASE_URL}/reject/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders() // <<<--- getAuthHeaders() call එක මෙතනත් දාන්න ඕන
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response as JSON' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error rejecting bulk input ${id} (service):`, error);
    throw error;
  }
};
