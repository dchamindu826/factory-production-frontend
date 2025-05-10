// src/pages/entry/MobileSubContractForm.jsx
import React, { useState, useEffect } from 'react';
import FormField from '../../components/common/FormField';
import { addSCEntry } from '../../services/subContractService'; // Make sure this service exists
import './EntryForm.css';

const genericDryProcessUnitPrices = {
  HAND_SHINE: 15.50, WHISKER: 12.00, WHISKER_SAVERONE: 18.75, PP: 20.00,
  PP_OVERALL: 25.00, TAGGING: 5.00, GRINDING: 10.25,
};
const allDryProcessesList = Object.keys(genericDryProcessUnitPrices).map(key => ({
    value: key, label: key.replace(/_/g, ' '),
}));

const MobileSubContractForm = () => {
  const today = new Date().toISOString().slice(0,10);
  const [formData, setFormData] = useState({
    date: today,
    subContractorName: '',
    styleNumber: '',
    processName: '',
    quantity: '',
  });
  const [unitPrice, setUnitPrice] = useState(0);
  const [totalSalary, setTotalSalary] = useState(0);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, error: null, message: '' });

  useEffect(() => {
    if (formData.processName && genericDryProcessUnitPrices[formData.processName]) {
      const currentUnitPrice = genericDryProcessUnitPrices[formData.processName];
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
  }, [formData.processName, formData.quantity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) { setErrors(prev => ({ ...prev, [name]: null })); }
    setSubmitStatus({ success: false, error: null, message: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Date is required.';
    if (!formData.subContractorName.trim()) newErrors.subContractorName = 'Sub Contractor name is required.';
    if (!formData.styleNumber.trim()) newErrors.styleNumber = 'Style Number is required.';
    if (!formData.processName) newErrors.processName = 'Process is required.';
    if (!formData.quantity.trim() || isNaN(formData.quantity) || Number(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be a valid positive number.';
    }
    if (formData.processName && unitPrice <= 0) {
        newErrors.processName = `Unit price not found for selected process.`;
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
        ...formData,
        quantity: parseInt(formData.quantity),
        unitPriceUsed: unitPrice,
        calculatedSalary: totalSalary,
      };
      try {
        const result = await addSCEntry(submissionData);
        setSubmitStatus({ success: true, error: null, message: result.message || 'Sub-Contract entry added! Awaiting approval.' });
        setFormData({ date: today, subContractorName: '', styleNumber: '', processName: '', quantity: '' });
        setErrors({});
      } catch (apiError) {
        setSubmitStatus({ success: false, error: true, message: apiError.message || 'Failed to add Sub-Contract entry.' });
      } finally {
        setIsLoading(false);
      }
    } else {
      setSubmitStatus({ success: false, error: true, message: 'Please fix errors.' });
    }
  };

  return (
    <div className="form-container mobile-entry-form">
      <h4>Add New Sub-Contract Entry</h4>
      {submitStatus.message && ( <div className={`alert ${submitStatus.success ? 'alert-success' : 'alert-danger'}`}>{submitStatus.message}</div> )}
      <form onSubmit={handleSubmit}>
        <FormField label="Date" name="date" type="date" value={formData.date} onChange={handleChange} error={errors.date} required disabled={isLoading} />
        <FormField label="Sub Contractor Name" name="subContractorName" type="text" value={formData.subContractorName} onChange={handleChange} placeholder="Contractor's Name" error={errors.subContractorName} required disabled={isLoading} />
        <FormField label="Style Number" name="styleNumber" type="text" value={formData.styleNumber} onChange={handleChange} placeholder="e.g., STY123" error={errors.styleNumber} required disabled={isLoading} />
        <FormField label="Select Dry Process" name="processName" type="select" value={formData.processName} onChange={handleChange} options={allDryProcessesList} placeholder="Select Process" error={errors.processName} required disabled={isLoading} />
        <FormField label="Quantity Processed" name="quantity" type="number" value={formData.quantity} onChange={handleChange} placeholder="No. of pieces" error={errors.quantity} required disabled={isLoading} />
        <div className="form-group"><label>Unit Price (Auto)</label><input type="text" value={`Rs. ${unitPrice.toFixed(2)}`} readOnly className="readonly-field" /></div>
        <div className="form-group"><label>Total Salary (Auto)</label><input type="text" value={`Rs. ${totalSalary.toFixed(2)}`} readOnly className="readonly-field" /></div>
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
