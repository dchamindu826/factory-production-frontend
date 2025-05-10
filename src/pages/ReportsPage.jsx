// src/pages/ReportsPage.jsx
import React, { useState } from 'react';
import FormField from '../components/common/FormField';
import * as XLSX from 'xlsx';
import {
  getApprovedBulkInputsReport,
  getApprovedDryProcessReport,
  getApprovedWashingReport,
  getApprovedSCEntriesReport,
  getApprovedGatePassesReport
} from '../services/reportService';
import './ReportsPage.css'; // Ensure this CSS file exists and is imported

const reportConfigurations = {
  BULK_INPUT: {
    label: 'Approved Bulk Inputs',
    service: getApprovedBulkInputsReport,
    columns: ['id', 'entry_date', 'style_number', 'quantity', 'supplier', 'status', 'entered_by_username', 'entry_timestamp', 'approved_by_username', 'approval_timestamp'],
    columnHeaders: { id: "ID", entry_date: "Entry Date", style_number: "Style No.", quantity: "Quantity", supplier: "Supplier", status: "Status", entered_by_username: "Entered By", entry_timestamp: "Entered At", approved_by_username: "Approved By", approval_timestamp: "Approved At" }
  },
  DRY_PROCESS: {
    label: 'Approved Dry Process',
    service: getApprovedDryProcessReport,
    columns: ['id', 'entry_date', 'style_number', 'process_name', 'quantity', 'status', 'entered_by_username', 'entry_timestamp', 'approved_by_username', 'approval_timestamp'],
    columnHeaders: { id: "ID", entry_date: "Entry Date", style_number: "Style No.", process_name: "Process", quantity: "Quantity", status: "Status", entered_by_username: "Entered By", entry_timestamp: "Entered At", approved_by_username: "Approved By", approval_timestamp: "Approved At" }
  },
  WASHING: {
    label: 'Approved Washing',
    service: getApprovedWashingReport,
    columns: ['id', 'entry_date', 'style_number', 'wash_category', 'quantity', 'status', 'entered_by_username', 'entry_timestamp', 'approved_by_username', 'approval_timestamp'],
    columnHeaders: { id: "ID", entry_date: "Entry Date", style_number: "Style No.", wash_category: "Wash Category", quantity: "Quantity", status: "Status", entered_by_username: "Entered By", entry_timestamp: "Entered At", approved_by_username: "Approved By", approval_timestamp: "Approved At" }
  },
  SUB_CONTRACT: {
    label: 'Approved Sub Contracts',
    service: getApprovedSCEntriesReport,
    columns: ['id', 'entry_date', 'sub_contractor_name', 'style_number', 'process_name', 'quantity', 'unit_price_used', 'calculated_salary', 'status', 'entered_by_username', 'entry_timestamp', 'approved_by_username', 'approval_timestamp'],
    columnHeaders: {
        id: "ID", entry_date: "Entry Date", sub_contractor_name: "Sub Contractor", style_number: "Style No.", process_name: "Process", quantity: "Quantity",
        unit_price_used: "Unit Price (Rs.)", calculated_salary: "Salary (Rs.)", status: "Status", entered_by_username: "Entered By", entry_timestamp: "Entered At",
        approved_by_username: "Approved By", approval_timestamp: "Approved At"
    }
  },
  GATE_PASS: {
    label: 'Approved Gate Pass',
    service: getApprovedGatePassesReport,
    columns: ['id', 'entry_date', 'style_number', 'destination', 'quantity', 'status', 'entered_by_username', 'entry_timestamp', 'approved_by_username', 'approval_timestamp'],
    columnHeaders: {
        id: "ID", entry_date: "Entry Date", style_number: "Style No.", destination: "Destination", quantity: "Quantity",
        status: "Status", entered_by_username: "Entered By", entry_timestamp: "Entered At",
        approved_by_username: "Approved By", approval_timestamp: "Approved At"
    }
  },
};

const ReportsPage = () => {
  const today = new Date().toISOString().slice(0,10);
  const [selectedReportType, setSelectedReportType] = useState(Object.keys(reportConfigurations)[0]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(today);
  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      setError('Please select both Start Date and End Date.');
      setReportData([]);
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
        setError('Start Date cannot be after End Date.');
        setReportData([]);
        return;
    }

    const config = reportConfigurations[selectedReportType];
    if (!config || !config.service) {
      setError(`Report generation for "${config?.label || selectedReportType}" is not implemented or configured yet.`);
      setReportData([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setReportData([]);

    try {
      const data = await config.service(startDate, endDate);
      if (Array.isArray(data)) {
        setReportData(data);
        if (data.length === 0) {
            setError('No approved data found for the selected criteria.');
        }
      } else {
        setReportData([]);
        setError(data.message || 'Received invalid data format from server.');
      }
    } catch (err) {
      setError(err.message || 'Failed to generate report.');
      setReportData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportToExcel = () => {
    if (reportData.length === 0) {
      alert('No data to export. Please generate a report first.');
      return;
    }
    const config = reportConfigurations[selectedReportType];
    const headers = config.columns.map(colKey => config.columnHeaders[colKey] || colKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));

    const dataToExport = reportData.map(row => {
      return config.columns.map(colKey => {
        let value = row[colKey];
        if (value === null || value === undefined) return '';

        if (colKey.includes('date') && !colKey.includes('timestamp')) {
            const d = new Date(value);
            if (!isNaN(d.getTime())) {
                return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            }
        }
        if (colKey.includes('timestamp')) {
          const d = new Date(value);
          if (!isNaN(d.getTime())) {
            return d.toLocaleString(); // Or a more specific format
          }
        }
        // For numeric values like unit_price_used, calculated_salary
        if (['unit_price_used', 'calculated_salary'].includes(colKey)) {
            return parseFloat(value); // Ensure it's a number for Excel
        }
        return value;
      });
    });

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...dataToExport]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, config.label.replace(/[^\w]/g, '_').substring(0, 30));

    const reportName = config.label.replace(/[^\w]/g, '_');
    const dateSuffix = `${startDate}_to_${endDate}`;
    XLSX.writeFile(workbook, `${reportName}_${dateSuffix}.xlsx`);
  };

  const currentConfig = reportConfigurations[selectedReportType];
  const displayColumns = currentConfig?.columns || (reportData.length > 0 ? Object.keys(reportData[0]) : []);
  const displayColumnHeaders = currentConfig?.columnHeaders || {};

  return (
    <div className="reports-page-container">
      <h1 className="page-header">Generate & Export Reports</h1>
      <div className="report-filters card">
        <FormField
          label="Select Report Type"
          name="selectedReportType"
          type="select"
          value={selectedReportType}
          onChange={(e) => {
            setSelectedReportType(e.target.value);
            setReportData([]);
            setError(null);
          }}
          options={Object.keys(reportConfigurations).map(key => ({
            value: key,
            label: reportConfigurations[key].label,
          }))}
        />
        <div className="date-range-fields">
          <FormField label="Start Date" name="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          <FormField label="End Date" name="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </div>
        <div className="report-actions">
          <button onClick={handleGenerateReport} disabled={isLoading || !currentConfig?.service} className="action-button generate-report-btn">
            {isLoading ? 'Generating...' : 'Generate Report'}
          </button>
          <button onClick={handleExportToExcel} disabled={reportData.length === 0 || isLoading} className="action-button export-button">
            Export to Excel
          </button>
        </div>
      </div>

      {isLoading && <div className="loading-message">Loading report data...</div>}
      {error && !isLoading && <div className="alert alert-danger">{error}</div>}

      {reportData.length > 0 && !isLoading && (
        <div className="report-display-area card">
          <h3>{currentConfig?.label}</h3>
          {startDate && endDate && <p className="date-range-info">Date Range: {startDate} to {endDate}</p>}
          <div className="report-table-container">
            <table>
              <thead>
                <tr>
                  {displayColumns.map(colKey => (
                    <th key={colKey}>{displayColumnHeaders[colKey] || colKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, index) => (
                  <tr key={row.id || index}>
                    {displayColumns.map(colKey => (
                      <td key={colKey}>
                        {row[colKey] !== null && row[colKey] !== undefined ?
                          (colKey.includes('date') && !colKey.includes('timestamp') ? // Only date part
                            (!isNaN(new Date(row[colKey]).getTime()) ? new Date(row[colKey]).toLocaleDateString() : String(row[colKey]))
                            : (colKey.includes('timestamp') ? // Date and time part
                                (!isNaN(new Date(row[colKey]).getTime()) ? new Date(row[colKey]).toLocaleString() : String(row[colKey]))
                                : row[colKey])
                          )
                          : ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {reportData.length === 0 && !isLoading && !error && (
        <p className="no-data-message">No data to display. Select criteria and generate report, or the selected report type might not be implemented yet.</p>
      )}
    </div>
  );
};

export default ReportsPage;
