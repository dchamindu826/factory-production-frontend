// src/pages/admin/PendingDryProcessPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { getPendingDryProcess, approveDryProcess, rejectDryProcess } from '../../services/dryProcessService';
import './PendingBulkInputsPage.css'; // Reuse common CSS

const PendingDryProcessPage = () => {
  const [pendingEntries, setPendingEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchPendingEntries = useCallback(async () => {
    console.log("PendingDryProcessPage: Attempting to fetch pending entries...");
    setIsLoading(true);
    setError(null);
    setActionError(null);
    setActionSuccess('');
    try {
      const data = await getPendingDryProcess();
      console.log("PendingDryProcessPage: Data received from service:", data);
      if (Array.isArray(data)) {
        setPendingEntries(data);
      } else {
        console.error("PendingDryProcessPage: Data received is not an array!", data);
        setPendingEntries([]);
        setError(data.message || 'Received invalid data format from server.');
      }
    } catch (err) {
      console.error("PendingDryProcessPage: Error caught in fetchPendingEntries:", err);
      setError(err.message || 'Failed to fetch pending dry process entries.');
      setPendingEntries([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("PendingDryProcessPage: useEffect triggered to call fetchPendingEntries.");
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.warn("PendingDryProcessPage: No auth token found. Redirecting to login might be needed or handled by ProtectedRoute.");
        setError("Authorization token not found. Please log in again.");
        setIsLoading(false);
        setPendingEntries([]);
        return;
    }
    fetchPendingEntries();
  }, [fetchPendingEntries]);

  const handleApprove = async (id) => {
    setActionError(null); setActionSuccess('');
    if (!window.confirm(`Are you sure you want to approve Dry Process ID: ${id}?`)) return;
    setIsLoading(true);
    try {
      const result = await approveDryProcess(id);
      setActionSuccess(result.message || 'Entry approved successfully!');
      setPendingEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
    } catch (err) {
      setActionError(err.message || `Failed to approve entry ID: ${id}.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (id) => {
    setActionError(null); setActionSuccess('');
    if (!window.confirm(`Are you sure you want to reject Dry Process ID: ${id}?`)) return;
    setIsLoading(true);
    try {
      const result = await rejectDryProcess(id);
      setActionSuccess(result.message || 'Entry rejected successfully!');
      setPendingEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
    } catch (err) {
      setActionError(err.message || `Failed to reject entry ID: ${id}.`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && pendingEntries.length === 0 && !error && !actionError && !actionSuccess) {
    return <div className="loading-message">Loading pending dry process entries...</div>;
  }

  if (error && pendingEntries.length === 0) {
    return <div className="error-message main-error">{error} <button onClick={fetchPendingEntries} disabled={isLoading}>{isLoading ? "Retrying..." : "Try Again"}</button></div>;
  }

  return (
    <div className="pending-approvals-page">
      <h2 className="page-header">Pending Dry Process Approvals</h2>

      {actionSuccess && <div className="alert alert-success">{actionSuccess}</div>}
      {actionError && <div className="alert alert-danger">{actionError}</div>}
      {error && !actionError && <div className="alert alert-danger">{error} <button onClick={fetchPendingEntries} disabled={isLoading}>{isLoading ? "Retrying..." : "Try Again"}</button></div>}

      {pendingEntries.length === 0 && !isLoading && !error && (
        <p className="no-data-message">No pending dry process entries found.</p>
      )}

      {pendingEntries.length > 0 && (
        <div className="table-responsive-container">
          <table className="data-table approvals-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Entry Date</th>
                <th>Style No.</th>
                <th>Process Name</th>
                <th>Quantity</th>
                <th>Entered By</th>
                <th>Entered At</th>
                <th>Actions</th>
              </tr>
            </thead>
            {/* Ensure no whitespace or direct text nodes between <tbody> and <tr> or between <tr> and <td> */}
            <tbody>
              {Array.isArray(pendingEntries) && pendingEntries.map(entry => (
                <tr key={entry.id}>
                  <td>{entry.id}</td>
                  <td>{new Date(entry.entry_date).toLocaleDateString()}</td>
                  <td>{entry.style_number}</td>
                  <td>{entry.process_name ? entry.process_name.replace(/_/g, ' ') : 'N/A'}</td>
                  <td>{entry.quantity}</td>
                  <td>{entry.entered_by_username || entry.entered_by_user_id}</td>
                  <td>{new Date(entry.entry_timestamp).toLocaleString()}</td>
                  <td>
                    <button
                      className="action-button approve-btn"
                      onClick={() => handleApprove(entry.id)}
                      disabled={isLoading}
                    >
                      Approve
                    </button>
                    <button
                      className="action-button reject-btn"
                      onClick={() => handleReject(entry.id)}
                      disabled={isLoading}
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

export default PendingDryProcessPage;
