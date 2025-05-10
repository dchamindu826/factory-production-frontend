// src/pages/entry/MobileWashingForm.jsx
import React, { useState } from 'react';
import FormField from '../../components/common/FormField';
import { addWashingEntry } from '../../services/washingService'; // Make sure this service exists
import './EntryForm.css';

const washCategoriesList = [
    { value: 'BEFORE_WASH', label: 'Before Wash' },
    { value: 'AFTER_WASH', label: 'After Wash' },
    { value: 'FINISH', label: 'Finish' },
];

const MobileWashingForm = () => {
  const today = new Date().toISOString().slice(0,10);
  const [formData, setFormData] = useState({
    date: today,
    styleNumber: '',
    washCategory: '',
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
    if (!formData.washCategory) newErrors.washCategory = 'Wash Category is required.';
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
        const result = await addWashingEntry(formData);
        setSubmitStatus({ success: true, error: null, message: result.message || 'Washing entry added! Awaiting approval.' });
        setFormData({ date: today, styleNumber: '', washCategory: '', quantity: '' });
        setErrors({});
      } catch (apiError) {
        setSubmitStatus({ success: false, error: true, message: apiError.message || 'Failed to add Washing entry.' });
      } finally {
        setIsLoading(false);
      }
    } else {
      setSubmitStatus({ success: false, error: true, message: 'Please fix the errors.' });
    }
  };

  return (
    <div className="form-container mobile-entry-form">
      <h4>Add New Washing Entry</h4>
       {submitStatus.message && (
        <div className={`alert ${submitStatus.success ? 'alert-success' : 'alert-danger'}`}>
          {submitStatus.message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <FormField label="Date" name="date" type="date" value={formData.date} onChange={handleChange} error={errors.date} required disabled={isLoading} />
        <FormField label="Style Number" name="styleNumber" type="text" value={formData.styleNumber} onChange={handleChange} placeholder="e.g., STY1003" error={errors.styleNumber} required disabled={isLoading} />
        <FormField label="Select Wash Category" name="washCategory" type="select" value={formData.washCategory} onChange={handleChange} options={washCategoriesList} placeholder="Select Category" error={errors.washCategory} required disabled={isLoading} />
        <FormField label="Quantity Processed" name="quantity" type="number" value={formData.quantity} onChange={handleChange} placeholder="Enter quantity" error={errors.quantity} required disabled={isLoading} />
        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Washing Entry'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MobileWashingForm;
