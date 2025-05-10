// src/pages/entry/MobileDryProcessForm.jsx
import React, { useState } from 'react';
import FormField from '../../components/common/FormField';
import { addDryProcessEntry } from '../../services/dryProcessService'; // Make sure this service exists and is correct
import './EntryForm.css'; // Common mobile entry form styles

const dryProcessesList = [
    { value: 'HAND_SHINE', label: 'Hand Shine' },
    { value: 'WHISKER', label: 'Whisker' },
    { value: 'WHISKER_SAVERONE', label: 'Whisker Saverone' },
    { value: 'PP', label: 'PP' },
    { value: 'PP_OVERALL', label: 'PP Overall' },
    { value: 'TAGGING', label: 'Tagging' },
    { value: 'GRINDING', label: 'Grinding' },
];

const MobileDryProcessForm = () => {
  const today = new Date().toISOString().slice(0,10);
  const [formData, setFormData] = useState({
    date: today,
    styleNumber: '',
    processName: '',
    quantity: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, error: null, message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) { setErrors(prev => ({ ...prev, [name]: null })); }
    setSubmitStatus({ success: false, error: null, message: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Date is required.';
    if (!formData.styleNumber.trim()) newErrors.styleNumber = 'Style Number is required.';
    if (!formData.processName) newErrors.processName = 'Process is required.';
    if (!formData.quantity.trim() || isNaN(formData.quantity) || Number(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be a positive number.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ success: false, error: null, message: '' });
    if (validateForm()) {
      setIsLoading(true);
      try {
        const result = await addDryProcessEntry(formData);
        setSubmitStatus({ success: true, error: null, message: result.message || 'Dry Process entry added! Awaiting approval.' });
        setFormData({ date: today, styleNumber: '', processName: '', quantity: '' });
        setErrors({});
      } catch (apiError) {
        setSubmitStatus({ success: false, error: true, message: apiError.message || 'Failed to add Dry Process entry.' });
      } finally {
        setIsLoading(false);
      }
    } else {
      setSubmitStatus({ success: false, error: true, message: 'Please fix the errors.' });
    }
  };

  return (
    <div className="form-container mobile-entry-form">
      <h4>Add New Dry Process Entry</h4>
      {submitStatus.message && (
        <div className={`alert ${submitStatus.success ? 'alert-success' : 'alert-danger'}`}>
          {submitStatus.message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <FormField label="Date" name="date" type="date" value={formData.date} onChange={handleChange} error={errors.date} required disabled={isLoading} />
        <FormField label="Style Number" name="styleNumber" type="text" value={formData.styleNumber} onChange={handleChange} placeholder="e.g., STY1002" error={errors.styleNumber} required disabled={isLoading} />
        <FormField label="Select Dry Process" name="processName" type="select" value={formData.processName} onChange={handleChange} options={dryProcessesList} placeholder="Select Process" error={errors.processName} required disabled={isLoading} />
        <FormField label="Quantity Processed" name="quantity" type="number" value={formData.quantity} onChange={handleChange} placeholder="Enter quantity" error={errors.quantity} required disabled={isLoading} />
        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Dry Process'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MobileDryProcessForm;
