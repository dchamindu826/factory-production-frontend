// src/pages/admin/PendingBulkInputsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { getPendingBulkInputs, approveBulkInput, rejectBulkInput } from '../../services/bulkInputService';
import './PendingBulkInputsPage.css'; // Make sure this CSS file exists and is correctly styled

const PendingBulkInputsPage = () => {
  const [pendingInputs, setPendingInputs] = useState([]); // Initialize as an empty array
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchPendingInputs = useCallback(async () => {
    console.log("PendingBulkInputsPage: fetchPendingInputs called."); // Debug log
    setIsLoading(true);
    setError(null);
    setActionError(null);
    setActionSuccess('');
    try {
      const data = await getPendingBulkInputs(); // Service call
      console.log("PendingBulkInputsPage: Data received from getPendingBulkInputs service:", data); // Debug log

      // --- API එකෙන් එන data එක array එකක්ද කියලා තහවුරු කරගන්නවා ---
      if (Array.isArray(data)) {
        setPendingInputs(data);
      } else {
        // API එකෙන් array එකක් ආවේ නැත්නම් (උදා: error object එකක් ආවොත්)
        console.error("PendingBulkInputsPage: Data received from API is not an array!", data);
        setPendingInputs([]); // pendingInputs එක හිස් array එකක් කරනවා .map error එක නවත්තන්න
        setError('Failed to fetch pending inputs or received invalid data format.');
      }
    } catch (err) {
      console.error("PendingBulkInputsPage: Error caught in fetchPendingInputs:", err); // Debug log
      setError(err.message || 'Failed to fetch pending bulk inputs.');
      setPendingInputs([]); // Error එකක් ආවත් pendingInputs එක හිස් array එකක් කරනවා
    } finally {
      setIsLoading(false);
    }
  }, []); // useCallback dependency array is empty, so fetchPendingInputs is created once

  useEffect(() => {
    console.log("PendingBulkInputsPage: useEffect triggered to call fetchPendingInputs."); // Debug log
    // Check for token before fetching (optional, but good for early exit)
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.warn("PendingBulkInputsPage: No auth token found in localStorage. User might need to login.");
        setError("You are not authorized. Please log in.");
        setIsLoading(false);
        setPendingInputs([]); // Ensure it's an array
        return; // Don't attempt to fetch if no token
    }
    fetchPendingInputs();
  }, [fetchPendingInputs]); // This useEffect runs when fetchPendingInputs (itself stable due to useCallback) changes, effectively on mount

  const handleApprove = async (id) => {
    setActionError(null);
    setActionSuccess('');
    if (!window.confirm(`Are you sure you want to approve Bulk Input ID: ${id}?`)) return;
    setIsLoading(true); // Indicate loading for action
    try {
      const result = await approveBulkInput(id);
      setActionSuccess(result.message || 'Entry approved successfully!');
      // Re-fetch or filter locally
      // fetchPendingInputs(); // Option 1: Re-fetch all pending items
      setPendingInputs(prevInputs => prevInputs.filter(input => input.id !== id)); // Option 2: Filter locally
    } catch (err) {
      setActionError(err.message || `Failed to approve entry ID: ${id}.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (id) => {
    setActionError(null);
    setActionSuccess('');
    if (!window.confirm(`Are you sure you want to reject Bulk Input ID: ${id}?`)) return;
    setIsLoading(true); // Indicate loading for action
    try {
      const result = await rejectBulkInput(id);
      setActionSuccess(result.message || 'Entry rejected successfully!');
      // Re-fetch or filter locally
      // fetchPendingInputs(); // Option 1
      setPendingInputs(prevInputs => prevInputs.filter(input => input.id !== id)); // Option 2
    } catch (err) {
      setActionError(err.message || `Failed to reject entry ID: ${id}.`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && pendingInputs.length === 0 && !error) { // Show loading only if no data/error yet
    return <div className="loading-message">Loading pending bulk inputs...</div>;
  }

  // Display error first if it exists
  if (error) {
    return <div className="error-message main-error">{error} <button onClick={fetchPendingInputs} disabled={isLoading}>{isLoading ? "Retrying..." : "Try Again"}</button></div>;
  }

  return (
    <div className="pending-approvals-page">
      <h2 className="page-header">Pending Bulk Input Approvals</h2>

      {actionSuccess && <div className="alert alert-success">{actionSuccess}</div>}
      {actionError && <div className="alert alert-danger">{actionError}</div>}

      {pendingInputs.length === 0 ? (
        <p className="no-data-message">No pending bulk inputs found.</p>
      ) : (
        <div className="table-responsive-container">
          <table className="data-table approvals-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Entry Date</th>
                <th>Style No.</th>
                <th>Quantity</th>
                <th>Supplier</th>
                <th>Entered By</th>
                <th>Entered At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Ensure pendingInputs is an array before mapping */}
              {Array.isArray(pendingInputs) && pendingInputs.map(input => (
                <tr key={input.id}>
                  <td>{input.id}</td>
                  <td>{new Date(input.entry_date).toLocaleDateString()}</td>
                  <td>{input.style_number}</td>
                  <td>{input.quantity}</td>
                  <td>{input.supplier}</td>
                  <td>{input.entered_by_username || input.entered_by_user_id}</td>
                  <td>{new Date(input.entry_timestamp).toLocaleString()}</td>
                  <td>
                    <button
                      className="action-button approve-btn"
                      onClick={() => handleApprove(input.id)}
                      disabled={isLoading} // Disable buttons during any loading state
                    >
                      Approve
                    </button>
                    <button
                      className="action-button reject-btn"
                      onClick={() => handleReject(input.id)}
                      disabled={isLoading} // Disable buttons during any loading state
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingBulkInputsPage;
