// src/services/subContractService.js

const API_BASE_URL = 'http://localhost:5001/api/sub-contracts'; // Backend API base URL

// Helper function (utils file එකකින් import කරගන්න)
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) { console.error("Auth token not found."); }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// --- අලුතින් එකතු කරන Function එක ---
// Add a new sub contract entry
export const addSCEntry = async (entryData) => {
  // entryData should be: { date, subContractorName, styleNumber, processName, quantity, unitPriceUsed, calculatedSalary }
  try {
    const response = await fetch(API_BASE_URL, { // POST to base URL ('/')
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(entryData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error('Error adding sub contract entry:', error);
    throw error;
  }
};
// ---

// --- Admin functions (අපි අදාළ Admin page එක හදද්දී මේවාට functions දාමු) ---
export const getPendingSCEntries = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/pending`, { method: 'GET', headers: getAuthHeaders() });
    if (!response.ok) { throw new Error((await response.json()).message || 'Failed to fetch'); }
    return await response.json();
  } catch (error) { console.error('Error fetching pending SC entries:', error); throw error; }
};

export const approveSCEntry = async (id) => {
   try {
    const response = await fetch(`${API_BASE_URL}/approve/${id}`, { method: 'PUT', headers: getAuthHeaders() });
     if (!response.ok) { throw new Error((await response.json()).message || 'Failed to approve'); }
    return await response.json();
  } catch (error) { console.error(`Error approving SC entry ${id}:`, error); throw error; }
};

export const rejectSCEntry = async (id) => {
   try {
    const response = await fetch(`${API_BASE_URL}/reject/${id}`, { method: 'PUT', headers: getAuthHeaders() });
     if (!response.ok) { throw new Error((await response.json()).message || 'Failed to reject'); }
    return await response.json();
  } catch (error) { console.error(`Error rejecting SC entry ${id}:`, error); throw error; }
};