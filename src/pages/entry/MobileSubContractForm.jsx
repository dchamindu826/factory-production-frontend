// src/pages/entry/MobileSubContractForm.jsx
import React, { useState, useEffect } from 'react';
import FormField from '../../components/common/FormField';
import { addSCEntry } from '../../services/subContractService'; // Ensure this service exists and is correct
import './EntryForm.css'; // Common mobile entry form styles

// Supplier-specific unit prices
// Mēka danata mē component ekēma define karala thiyemu.
// Loku system ekaka nam, mēka backend eken ho global state ekakin enna ōna.
const supplierSpecificUnitPrices = {
  CIB: {
    HAND_SHINE: 15.00,
    WHISKER: 11.50,
    WHISKER_SAVERONE: 18.00,
    PP: 19.50,
    PP_OVERALL: 24.00,
    TAGGING: 4.75,
    GRINDING: 10.00,
  },
  G_FLOCK: {
    HAND_SHINE: 14.50,
    WHISKER: 11.00,
    WHISKER_SAVERONE: 17.50,
    PP: 19.00,
    PP_OVERALL: 23.50,
    TAGGING: 4.50,
    GRINDING: 9.75,
  },
  // Add other suppliers and their prices here
};

// Get list of suppliers for the dropdown
const pricingSuppliersList = Object.keys(supplierSpecificUnitPrices).map(key => ({
    value: key,
    label: key.replace(/_/g, ' '), // Replace underscore with space for display
}));

// Get list of all dry processes (assuming all suppliers offer the same processes)
// We take process names from the first supplier in the list as a reference
const firstSupplierKey = Object.keys(supplierSpecificUnitPrices)[0];
const allDryProcessesList = firstSupplierKey ? Object.keys(supplierSpecificUnitPrices[firstSupplierKey]).map(key => ({
    value: key,
    label: key.replace(/_/g, ' '),
})) : [];


const MobileSubContractForm = () => {
  const today = new Date().toISOString().slice(0,10);
  const [formData, setFormData] = useState({
    date: today,
    subContractorName: '', // Name of the actual sub-contractor person/company
    styleNumber: '',
    pricingSupplier: '',   // <<<--- Aluthin: Supplier for unit pricing (CIB, G_FLOCK)
    processName: '',
    quantity: '',
  });

  const [unitPrice, setUnitPrice] = useState(0);
  const [totalSalary, setTotalSalary] = useState(0);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, error: null, message: '' });

  // Calculate unit price and total salary based on selected pricing supplier and process
  useEffect(() => {
    if (formData.pricingSupplier && formData.processName && supplierSpecificUnitPrices[formData.pricingSupplier]?.[formData.processName]) {
      const currentUnitPrice = supplierSpecificUnitPrices[formData.pricingSupplier][formData.processName];
      setUnitPrice(currentUnitPrice);
      const qty = parseFloat(formData.quantity);
      if (!isNaN(qty) && qty > 0) {
        setTotalSalary(qty * currentUnitPrice);
      } else {
        setTotalSalary(0);
      }
    } else {
      setUnitPrice(0);
      setTotalSalary(0);
    }
  }, [formData.pricingSupplier, formData.processName, formData.quantity]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // If pricing supplier changes, reset process name and unit price to avoid mismatches
    if (name === 'pricingSupplier') {
        setFormData(prev => ({ ...prev, processName: '', quantity: '' })); // Also reset quantity
        setUnitPrice(0);
        setTotalSalary(0);
    }
    if (name === 'processName') {
        setFormData(prev => ({...prev, quantity: ''})); // Reset quantity if process changes
        setTotalSalary(0);
    }


    if (errors[name]) { setErrors(prev => ({ ...prev, [name]: null })); }
    setSubmitStatus({ success: false, error: null, message: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Date is required.';
    if (!formData.subContractorName.trim()) newErrors.subContractorName = 'Sub Contractor name is required.';
    if (!formData.styleNumber.trim()) newErrors.styleNumber = 'Style Number is required.';
    if (!formData.pricingSupplier) newErrors.pricingSupplier = 'Pricing Supplier is required.'; // Validation for new field
    if (!formData.processName) newErrors.processName = 'Process is required.';
    if (!formData.quantity.trim() || isNaN(formData.quantity) || Number(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be a valid positive number.';
    }
    if (formData.pricingSupplier && formData.processName && unitPrice <= 0) {
        newErrors.processName = `Unit price not found for selected process under ${formData.pricingSupplier}.`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ success: false, error: null, message: '' });
    if (validateForm()) {
      setIsLoading(true);
      const submissionData = {
        date: formData.date,
        subContractorName: formData.subContractorName,
        styleNumber: formData.styleNumber,
        processName: formData.processName, // Backend expects process_name
        quantity: parseInt(formData.quantity),
        unitPriceUsed: unitPrice, // Send the dynamically fetched unit price
        calculatedSalary: totalSalary, // Send the calculated salary
        // pricingSupplier: formData.pricingSupplier, // Optional: send to backend if needed for records
      };
      try {
        const result = await addSCEntry(submissionData); // Call the existing service function
        setSubmitStatus({ success: true, error: null, message: result.message || 'Sub-Contract entry added! Awaiting approval.' });
        setFormData({
          date: today,
          subContractorName: '',
          styleNumber: '',
          pricingSupplier: '', // Reset this too
          processName: '',
          quantity: ''
        });
        setErrors({});
        setUnitPrice(0); // Reset displayed unit price
        setTotalSalary(0); // Reset displayed total salary
      } catch (apiError) {
        console.error('API Error adding Sub-Contract:', apiError);
        setSubmitStatus({ success: false, error: true, message: apiError.message || 'Failed to add Sub-Contract entry.' });
      } finally {
        setIsLoading(false);
      }
    } else {
      setSubmitStatus({ success: false, error: true, message: 'Please fix errors in the form.' });
    }
  };

  return (
    <div className="form-container mobile-entry-form">
      <h4>Add New Sub-Contract Entry</h4>
      {submitStatus.message && ( <div className={`alert ${submitStatus.success ? 'alert-success' : 'alert-danger'}`}>{submitStatus.message}</div> )}
      <form onSubmit={handleSubmit}>
        <FormField label="Date" name="date" type="date" value={formData.date} onChange={handleChange} error={errors.date} required disabled={isLoading} />
        <FormField label="Sub Contractor Name" name="subContractorName" type="text" value={formData.subContractorName} onChange={handleChange} placeholder="Contractor's Actual Name" error={errors.subContractorName} required disabled={isLoading} />
        <FormField label="Style Number" name="styleNumber" type="text" value={formData.styleNumber} onChange={handleChange} placeholder="e.g., STY123" error={errors.styleNumber} required disabled={isLoading} />

        {/* --- Aluth Supplier Dropdown eka --- */}
        <FormField
          label="Select Pricing Supplier"
          name="pricingSupplier"
          type="select"
          value={formData.pricingSupplier}
          onChange={handleChange}
          options={pricingSuppliersList}
          placeholder="Select Supplier for Rates"
          error={errors.pricingSupplier}
          required
          disabled={isLoading}
        />

        <FormField
          label="Select Dry Process"
          name="processName"
          type="select"
          value={formData.processName}
          onChange={handleChange}
          options={allDryProcessesList} // Use the list of all processes
          placeholder="Select Process"
          error={errors.processName}
          required
          disabled={!formData.pricingSupplier || isLoading} // Enable only after pricing supplier is selected
        />
        <FormField
          label="Quantity Processed (Pieces)"
          name="quantity"
          type="number"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="No. of pieces"
          error={errors.quantity}
          required
          disabled={!formData.processName || isLoading} // Enable only after process is selected
        />

        <div className="form-group">
          <label>Unit Price (Based on Supplier & Process)</label>
          <input type="text" value={formData.pricingSupplier && formData.processName ? `Rs. ${unitPrice.toFixed(2)}` : 'N/A'} readOnly className="readonly-field" />
        </div>
        <div className="form-group">
          <label>Total Salary (Auto Calculated)</label>
          <input type="text" value={`Rs. ${totalSalary.toFixed(2)}`} readOnly className="readonly-field" />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Sub-Contract Entry'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MobileSubContractForm;
