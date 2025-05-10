// src/components/subcontract/PriceManagementTable.jsx
import React, { useState, useEffect } from 'react';
import './PriceManagementTable.css'; // මේකට අදාළ CSS පසුව හදමු

const PriceManagementTable = ({ initialPrices, onPricesUpdate }) => {
  const [prices, setPrices] = useState(initialPrices);
  const [editingRowKey, setEditingRowKey] = useState(null); // processName එක තමයි key එක
  const [editedRowData, setEditedRowData] = useState({});

  // initialPrices වෙනස් වුණොත් prices state එක update කරන්න
  useEffect(() => {
    setPrices(initialPrices);
  }, [initialPrices]);


  const processes = Object.keys(initialPrices.CIB || {}); // CIB supplier ගේ process ටික ගමු (අනිත් අයටත් ඒ ටිකම තියෙන්න ඕන)
  const suppliers = Object.keys(initialPrices || {}); // ['CIB', 'G_FLOCK']

  const handleEdit = (processName) => {
    setEditingRowKey(processName);
    const currentProcessPrices = {};
    suppliers.forEach(supplier => {
      currentProcessPrices[supplier] = prices[supplier]?.[processName] || 0;
    });
    setEditedRowData(currentProcessPrices);
  };

  const handleCancel = () => {
    setEditingRowKey(null);
    setEditedRowData({});
  };

  const handlePriceChange = (supplier, value) => {
    setEditedRowData(prev => ({
      ...prev,
      [supplier]: parseFloat(value) || 0,
    }));
  };

  const handleSave = (processName) => {
    const updatedPrices = JSON.parse(JSON.stringify(prices)); // Deep copy
    suppliers.forEach(supplier => {
      if (updatedPrices[supplier]) {
        updatedPrices[supplier][processName] = editedRowData[supplier];
      }
    });
    onPricesUpdate(updatedPrices); // Call the callback to update parent state
    setEditingRowKey(null);
    setEditedRowData({});
  };

  if (suppliers.length === 0 || processes.length === 0) {
    return <p>No price data available to display.</p>;
  }

  return (
    <div className="price-management-table-container">
      <h3>Supplier Unit Price Management (Dry Process)</h3>
      <table className="price-table">
        <thead>
          <tr>
            <th>Process Name</th>
            {suppliers.map(supplier => (
              <th key={supplier}>{supplier.replace(/_/g, ' ')} Price (Rs.)</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((processName) => (
            <tr key={processName}>
              <td>{processName.replace(/_/g, ' ')}</td>
              {suppliers.map(supplier => (
                <td key={`${processName}-${supplier}`}>
                  {editingRowKey === processName ? (
                    <input
                      type="number"
                      step="0.01"
                      value={editedRowData[supplier] || ''}
                      onChange={(e) => handlePriceChange(supplier, e.target.value)}
                      className="price-input-editable"
                    />
                  ) : (
                    (prices[supplier]?.[processName] || 0).toFixed(2)
                  )}
                </td>
              ))}
              <td>
                {editingRowKey === processName ? (
                  <>
                    <button onClick={() => handleSave(processName)} className="price-table-btn save-btn">Save</button>
                    <button onClick={handleCancel} className="price-table-btn cancel-btn">Cancel</button>
                  </>
                ) : (
                  <button onClick={() => handleEdit(processName)} className="price-table-btn edit-btn">Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PriceManagementTable;