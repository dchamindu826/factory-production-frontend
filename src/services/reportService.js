// src/services/reportService.js

const API_BASE_URL = 'http://localhost:5001/api';

// Helper function to get token and create headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  console.log('[reportService] getAuthHeaders - Token from localStorage:', token);
  if (!token) {
    console.error("[reportService] Auth token IS NULL or not found when creating headers.");
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Fetch Approved Bulk Inputs for Report
export const getApprovedBulkInputsReport = async (startDate, endDate) => {
  console.log("[reportService] Attempting to fetch APPROVED BULK INPUTS report...");
  try {
    const response = await fetch(`${API_BASE_URL}/bulk-inputs/report?startDate=${startDate}&endDate=${endDate}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("[reportService] API error response for approved bulk inputs:", data);
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error('Error fetching approved bulk inputs report (service):', error);
    throw error;
  }
};

// Fetch Approved Dry Process Entries for Report
export const getApprovedDryProcessReport = async (startDate, endDate) => {
  console.log("[reportService] Attempting to fetch APPROVED DRY PROCESS report...");
  try {
    const response = await fetch(`${API_BASE_URL}/dry-process/report?startDate=${startDate}&endDate=${endDate}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("[reportService] API error response for approved dry process:", data);
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error('Error fetching approved dry process report (service):', error);
    throw error;
  }
};

// Fetch Approved Washing Entries for Report
export const getApprovedWashingReport = async (startDate, endDate) => {
  console.log("[reportService] Attempting to fetch APPROVED WASHING report...");
  try {
    const response = await fetch(`${API_BASE_URL}/washing/report?startDate=${startDate}&endDate=${endDate}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("[reportService] API error response for approved washing:", data);
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error('Error fetching approved washing report (service):', error);
    throw error;
  }
};

// Fetch Approved Sub Contract Entries for Report
export const getApprovedSCEntriesReport = async (startDate, endDate) => {
  console.log("[reportService] Attempting to fetch APPROVED SUB CONTRACT report...");
  try {
    const response = await fetch(`${API_BASE_URL}/sub-contracts/report?startDate=${startDate}&endDate=${endDate}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("[reportService] API error response for approved SC entries:", data);
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error('Error fetching approved sub-contract report (service):', error);
    throw error;
  }
};

// Fetch Approved Gate Pass Entries for Report
export const getApprovedGatePassesReport = async (startDate, endDate) => {
  console.log("[reportService] Attempting to fetch APPROVED GATE PASS report...");
  try {
    const response = await fetch(`${API_BASE_URL}/gate-pass/report?startDate=${startDate}&endDate=${endDate}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("[reportService] API error response for approved Gate Pass entries:", data);
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error('Error fetching approved gate pass report (service):', error);
    throw error;
  }
};

