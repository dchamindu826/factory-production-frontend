// src/pages/admin/PendingGatePassPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { getPendingGatePasses, approveGatePass, rejectGatePass } from '../../services/gatePassService';
import './PendingBulkInputsPage.css'; // Reuse common CSS

const PendingGatePassPage = () => {
  const [pendingEntries, setPendingEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchPendingEntries = useCallback(async () => {
    setIsLoading(true); /* Reset states */ setError(null); setActionError(null); setActionSuccess('');
    try {
      const data = await getPendingGatePasses();
      setPendingEntries(data);
    } catch (err) { setError(err.message || 'Failed to fetch pending gate pass entries.'); setPendingEntries([]); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchPendingEntries(); }, [fetchPendingEntries]);

  const handleApprove = async (id) => {
    setActionError(null); setActionSuccess('');
    if (!window.confirm(`Approve Gate Pass ID: ${id}? (Remember to check stock implications)`)) return; // Added stock warning
    try {
      const result = await approveGatePass(id);
      setActionSuccess(result.message || 'Entry approved!');
      setPendingEntries(prev => prev.filter(e => e.id !== id));
    } catch (err) { setActionError(err.message || `Failed to approve ID: ${id}.`); }
  };

  const handleReject = async (id) => {
    setActionError(null); setActionSuccess('');
    if (!window.confirm(`Reject Gate Pass ID: ${id}?`)) return;
    try {
      const result = await rejectGatePass(id);
      setActionSuccess(result.message || 'Entry rejected!');
      setPendingEntries(prev => prev.filter(e => e.id !== id));
    } catch (err) { setActionError(err.message || `Failed to reject ID: ${id}.`); }
  };

  if (isLoading) return <div className="loading-message">Loading pending gate pass entries...</div>;
  if (error) return <div className="error-message main-error">{error} <button onClick={fetchPendingEntries}>Try Again</button></div>;

  return (
    <div className="pending-approvals-page">
      <h2 className="page-header">Pending Gate Pass Approvals</h2>
      {actionSuccess && <div className="alert alert-success">{actionSuccess}</div>}
      {actionError && <div className="alert alert-danger">{actionError}</div>}
      {pendingEntries.length === 0 ? (
        <p className="no-data-message">No pending gate pass entries found.</p>
      ) : (
        <div className="table-responsive-container">
          <table className="data-table approvals-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Style No.</th>
                <th>Destination</th>
                <th>Quantity</th>
                <th>Entered By</th>
                <th>Entered At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingEntries.map(entry => (
                <tr key={entry.id}>
                  <td>{entry.id}</td>
                  <td>{new Date(entry.entry_date).toLocaleDateString()}</td>
                  <td>{entry.style_number}</td>
                  <td>{entry.destination.replace(/_/g, ' ')}</td>
                  <td>{entry.quantity}</td>
                  <td>{entry.entered_by_username || entry.entered_by_user_id}</td>
                  <td>{new Date(entry.entry_timestamp).toLocaleString()}</td>
                  <td>
                    <button className="action-button approve-btn" onClick={() => handleApprove(entry.id)}>Approve</button>
                    <button className="action-button reject-btn" onClick={() => handleReject(entry.id)}>Reject</button>
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

export default PendingGatePassPage;