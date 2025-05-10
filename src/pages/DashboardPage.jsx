// src/pages/DashboardPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SummaryCard from '../components/dashboard/SummaryCard';
import ProductionChart from '../components/dashboard/ProductionChart'; // Assuming this component is created
import FormField from '../components/common/FormField';
import {
  getSpecialNotes,
  addSpecialNote,
  deactivateSpecialNote,
  getDashboardSummaryData
} from '../services/dashboardService'; // Ensure dashboardService.js has these
import './DashboardPage.css'; // Styles for Dashboard
import './SpecialNotes.css'; // Styles for Special Notes section

const PlaceholderIcon = ({ text }) => <span style={{ fontSize: '20px' }}>{text}</span>;

const DashboardPage = () => {
  const navigate = useNavigate();

  // --- Summary Data State ---
  const [summaryData, setSummaryData] = useState({
    bulkInputsToday: 0,
    unitsCompletedToday: 0,
    finishedGoodsAwaitingGatePass: 0,
    shippedViaGatePassToday: 0,
  });
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState(null);

  // --- Special Notes State ---
  const [notes, setNotes] = useState([]);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteDate, setNewNoteDate] = useState(new Date().toISOString().slice(0, 10));
  const [noteError, setNoteError] = useState('');
  const [noteSuccess, setNoteSuccess] = useState('');
  const [isNoteLoading, setIsNoteLoading] = useState(false);

  // Fetch special notes
  const fetchNotes = useCallback(async () => {
    setIsNoteLoading(true); // Indicate loading for notes as well
    try {
      const fetchedNotes = await getSpecialNotes();
      setNotes(fetchedNotes || []); // Ensure notes is always an array
    } catch (error) {
      setNoteError(error.message || 'Failed to load notes.');
      setNotes([]); // Set to empty array on error
    } finally {
      setIsNoteLoading(false);
    }
  }, []);

  // Fetch Dashboard Summary Data
  const fetchDashboardSummary = useCallback(async () => {
    console.log("DashboardPage: Attempting to fetch summary data...");
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      const data = await getDashboardSummaryData();
      console.log("DashboardPage: Summary data received:", data);
      setSummaryData({
        bulkInputsToday: data.bulkInputsToday || 0,
        unitsCompletedToday: data.unitsCompletedToday || 0,
        finishedGoodsAwaitingGatePass: data.finishedGoodsAwaitingGatePass || 0,
        shippedViaGatePassToday: data.shippedViaGatePassToday || 0,
      });
    } catch (error) {
      console.error("DashboardPage: Error fetching summary data:", error);
      setSummaryError(error.message || 'Failed to load dashboard summary.');
      // Set summaryData to default zeros on error to prevent issues with SummaryCard
      setSummaryData({
        bulkInputsToday: 0,
        unitsCompletedToday: 0,
        finishedGoodsAwaitingGatePass: 0,
        shippedViaGatePassToday: 0,
      });
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
    fetchDashboardSummary();
    // TODO: Fetch real chart data in a later phase
  }, [fetchNotes, fetchDashboardSummary]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNoteContent.trim()) {
      setNoteError('Note content cannot be empty.');
      return;
    }
    setIsNoteLoading(true);
    setNoteError('');
    setNoteSuccess('');
    try {
      const noteData = { note_content: newNoteContent, note_date: newNoteDate };
      await addSpecialNote(noteData);
      setNewNoteContent('');
      // setNewNoteDate(new Date().toISOString().slice(0,10)); // Optionally reset date
      setNoteSuccess('Note added successfully!');
      fetchNotes(); // Refresh notes list
    } catch (error) {
      setNoteError(error.message || 'Failed to add note.');
    } finally {
      setIsNoteLoading(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm(`Are you sure you want to deactivate note ID: ${noteId}?`)) return;
    setIsNoteLoading(true);
    setNoteError('');
    setNoteSuccess('');
    try {
      await deactivateSpecialNote(noteId);
      setNoteSuccess('Note deactivated successfully!');
      fetchNotes(); // Refresh notes list
    } catch (error) {
      setNoteError(error.message || `Failed to deactivate note ID: ${noteId}.`);
    } finally {
      setIsNoteLoading(false);
    }
  };

  // Mock data for charts - will be replaced in a later phase
  const mockChartData = {
    daily: [
      { name: 'Style A', processed: 40, target: 60 },
      { name: 'Style B', processed: 60, target: 70 },
      { name: 'Style C', processed: 30, target: 50 },
    ],
    weekly: [
      { name: 'Style A', processed: 250, target: 300 },
      { name: 'Style B', processed: 350, target: 400 },
    ],
    monthly: [
      { name: 'Style A', processed: 1000, target: 1200 },
      { name: 'Style B', processed: 1500, target: 1800 },
    ],
  };

  return (
    <div>
      <h1 className="page-header">Dashboard Overview</h1>

      {summaryLoading && <p className="loading-message">Loading summary data...</p>}
      {summaryError && <div className="alert alert-danger">{summaryError}</div>}

      {/* Summary Cards Section */}
      {!summaryLoading && !summaryError && (
        <div className="summary-cards-grid">
          <SummaryCard title="Bulk Inputs Today" value={summaryData.bulkInputsToday} unit="entries" icon={<PlaceholderIcon text="📦" />} />
          <SummaryCard title="Units Completed Today" value={summaryData.unitsCompletedToday} unit="units" icon={<PlaceholderIcon text="✅" />} />
          <SummaryCard title="Awaiting GatePass" value={summaryData.finishedGoodsAwaitingGatePass} unit="units" icon={<PlaceholderIcon text="⏳" />} />
          <SummaryCard title="Shipped Today" value={summaryData.shippedViaGatePassToday} unit="units" icon={<PlaceholderIcon text="🚚" />} />
        </div>
      )}

      {/* Charts Section (Uses mock data for now) */}
      <div className="dashboard-charts-section">
        <ProductionChart title="Dry Process Summary (Mock)" initialData={mockChartData} />
        <ProductionChart title="Washing Process Summary (Mock)" initialData={mockChartData} />
      </div>

      {/* Special Notes Section */}
      <div className="special-notes-section card">
        <h3>Special Notes</h3>
        <form onSubmit={handleAddNote} className="add-note-form">
          <FormField
            label="Note Date"
            name="newNoteDate"
            type="date"
            value={newNoteDate}
            onChange={(e) => setNewNoteDate(e.target.value)}
            required
            disabled={isNoteLoading}
          />
          <div className="form-group">
            <label htmlFor="newNoteContent">Note Content</label>
            <textarea
              id="newNoteContent"
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              rows="3"
              placeholder="Enter your note here..."
              required
              disabled={isNoteLoading}
            ></textarea>
          </div>
          {noteError && <p className="error-message alert alert-danger">{noteError}</p>}
          {noteSuccess && <p className="success-message alert alert-success">{noteSuccess}</p>}
          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={isNoteLoading}>
              {isNoteLoading ? 'Adding Note...' : 'Add Note'}
            </button>
          </div>
        </form>

        <div className="notes-list">
          <h4>Recent Notes:</h4>
          {isNoteLoading && notes.length === 0 && <p>Loading notes...</p>}
          {!isNoteLoading && notes.length === 0 && !noteError && <p>No special notes found.</p>}
          {/* Display note fetch error if it occurred and no notes are loaded */}
          {!isNoteLoading && notes.length === 0 && noteError && <p className="error-message">{noteError}</p>}
          <ul>
            {notes.map(note => (
              <li key={note.id} className="note-item">
                <div className="note-header">
                  <strong>{new Date(note.note_date).toLocaleDateString()}</strong>
                  {note.entered_by_username && <span> - By: {note.entered_by_username}</span>}
                  <button onClick={() => handleDeleteNote(note.id)} className="delete-note-btn" title="Deactivate Note" disabled={isNoteLoading}>🗑️</button>
                </div>
                <p className="note-content-display">{note.note_content}</p>
                <small className="note-timestamp">Added: {new Date(note.created_at).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* End of Special Notes Section */}

      <div className="dashboard-actions card">
        <h3>Quick Actions</h3>
        <button className="action-button" onClick={() => navigate('/bulk-input')}>Add New Bulk Input</button>
        <button className="action-button" onClick={() => navigate('/dry-process')}>Update Dry Process</button>
        <button className="action-button" onClick={() => navigate('/washing')}>Update Washing</button>
        <button className="action-button" onClick={() => navigate('/sub-contracts')}>Log Sub Contract</button>
        <button className="action-button" onClick={() => navigate('/gate-pass')}>Issue Gate Pass</button>
      </div>
    </div>
  );
};

export default DashboardPage;
