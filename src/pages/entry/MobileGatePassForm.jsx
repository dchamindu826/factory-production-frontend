// src/pages/entry/MobileGatePassForm.jsx
import React, { useState } from 'react';
import FormField from '../../components/common/FormField';
import { addGatePassEntry } from '../../services/gatePassService'; // Make sure this service exists
import './EntryForm.css';

const destinationList = [
  { value: 'CIB', label: 'CIB (Return/Transfer)' },
  { value: 'G_FLOCK', label: 'G FLOCK (Return/Transfer)' },
  { value: 'CUSTOMER_X', label: 'Customer X' },
  { value: 'CUSTOMER_Y', label: 'Customer Y' },
];

const MobileGatePassForm = () => {
  const today = new Date().toISOString().slice(0,10);
  const [formData, setFormData] = useState({
    date: today,
    styleNumber: '',
    destination: '',
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
    if (!formData.destination) newErrors.destination = 'Destination is required.';
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
        const result = await addGatePassEntry(formData);
        setSubmitStatus({ success: true, error: null, message: result.message || 'Gate Pass entry added! Awaiting approval.' });
        setFormData({ date: today, styleNumber: '', destination: '', quantity: '' });
        setErrors({});
      } catch (apiError) {
        setSubmitStatus({ success: false, error: true, message: apiError.message || 'Failed to add Gate Pass entry.' });
      } finally {
        setIsLoading(false);
      }
    } else {
      setSubmitStatus({ success: false, error: true, message: 'Please fix the errors.' });
    }
  };

  return (
    <div className="form-container mobile-entry-form">
      <h4>Create New Gate Pass Entry</h4>
      {submitStatus.message && (
        <div className={`alert ${submitStatus.success ? 'alert-success' : 'alert-danger'}`}>
          {submitStatus.message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <FormField label="Gate Pass Date" name="date" type="date" value={formData.date} onChange={handleChange} error={errors.date} required disabled={isLoading} />
        <FormField label="Style Number" name="styleNumber" type="text" value={formData.styleNumber} onChange={handleChange} placeholder="Outgoing goods style" error={errors.styleNumber} required disabled={isLoading} />
        <FormField label="Select Destination" name="destination" type="select" value={formData.destination} onChange={handleChange} options={destinationList} placeholder="Select Destination" error={errors.destination} required disabled={isLoading} />
        <FormField label="Quantity Shipped" name="quantity" type="number" value={formData.quantity} onChange={handleChange} placeholder="Enter quantity" error={errors.quantity} required disabled={isLoading} />
        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Issuing...' : 'Issue Gate Pass'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MobileGatePassForm;
