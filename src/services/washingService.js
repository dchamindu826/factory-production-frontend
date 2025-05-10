// src/services/washingService.js

const API_BASE_URL = 'http://localhost:5001/api/washing'; // Backend API base URL for washing

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
// Add a new washing entry
export const addWashingEntry = async (entryData) => {
  // entryData should be an object like: { date, styleNumber, washCategory, quantity }
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
    console.error('Error adding washing entry:', error);
    throw error;
  }
};
// ---

// --- Admin functions (අපි අදාළ Admin page එක හදද්දී මේවාට functions දාමු) ---
export const getPendingWashing = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/pending`, { method: 'GET', headers: getAuthHeaders() });
    if (!response.ok) { throw new Error((await response.json()).message || 'Failed to fetch'); }
    return await response.json();
  } catch (error) { console.error('Error fetching pending washing:', error); throw error; }
};

export const approveWashing = async (id) => {
   try {
    const response = await fetch(`${API_BASE_URL}/approve/${id}`, { method: 'PUT', headers: getAuthHeaders() });
    if (!response.ok) { throw new Error((await response.json()).message || 'Failed to approve'); }
    return await response.json();
  } catch (error) { console.error(`Error approving washing ${id}:`, error); throw error; }
};

export const rejectWashing = async (id) => {
   try {
    const response = await fetch(`${API_BASE_URL}/reject/${id}`, { method: 'PUT', headers: getAuthHeaders() });
    if (!response.ok) { throw new Error((await response.json()).message || 'Failed to reject'); }
    return await response.json();
  } catch (error) { console.error(`Error rejecting washing ${id}:`, error); throw error; }
};