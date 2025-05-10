// src/pages/BulkInputPage.jsx
import React, { useState } from 'react';
import FormField from '../components/common/FormField';
import { addBulkInput } from '../services/bulkInputService'; // Service function import

const BulkInputPage = () => {
  const today = new Date().toISOString().slice(0,10);
  const [formData, setFormData] = useState({
    date: today,
    styleNumber: '',
    quantity: '',
    supplier: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
      success: false,
      error: null,
      message: ''
  });

  const suppliers = [
    { value: 'CIB', label: 'CIB' },
    { value: 'G_FLOCK', label: 'G Flock' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    setSubmitStatus({ success: false, error: null, message: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Date is required.';
    if (!formData.styleNumber.trim()) newErrors.styleNumber = 'Style Number is required.';
    if (!formData.quantity.trim() || isNaN(formData.quantity) || Number(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be a positive number.';
    }
    if (!formData.supplier) newErrors.supplier = 'Supplier is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ success: false, error: null, message: '' });

    if (validateForm()) {
      setIsLoading(true);
      try {
        const result = await addBulkInput(formData);
        setSubmitStatus({
            success: true,
            error: null,
            message: result.message || 'Bulk input added successfully! Awaiting approval.'
        });
        console.log('API Response:', result);
        setFormData({ date: today, styleNumber: '', quantity: '', supplier: '' });
        setErrors({});
      } catch (apiError) {
        console.error('API Error:', apiError);
        setSubmitStatus({
            success: false,
            error: true,
            message: apiError.message || 'Failed to add bulk input. Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('Frontend Validation errors:', errors);
       setSubmitStatus({ success: false, error: true, message: 'Please fix the errors in the form.' });
    }
  };

  return (
    <div>
      <h1 className="page-header">Bulk Input Management</h1>
      <div className="form-container">
        <h2>Add New Bulk Input</h2>

        {submitStatus.message && (
            <div className={`alert ${submitStatus.success ? 'alert-success' : 'alert-danger'}`}>
                {submitStatus.message}
            </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormField
            label="Date" name="date" type="date"
            value={formData.date} onChange={handleChange}
            error={errors.date} required disabled={isLoading}
          />
          <FormField
            label="Style Number" name="styleNumber" type="text"
            value={formData.styleNumber} onChange={handleChange}
            placeholder="e.g., STY1001" error={errors.styleNumber} required disabled={isLoading}
          />
          <FormField
            label="Quantity" name="quantity" type="number"
            value={formData.quantity} onChange={handleChange}
            placeholder="Enter quantity" error={errors.quantity} required disabled={isLoading}
          />
          <FormField
            label="Supplier" name="supplier" type="select"
            value={formData.supplier} onChange={handleChange}
            options={suppliers} placeholder="Select a supplier" error={errors.supplier} required disabled={isLoading}
          />
          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Bulk'}
            </button>
          </div>
        </form>
      </div>

      <div className="table-placeholder-container card">
        <h3>Existing Bulk Inputs</h3>
        <div className="table-placeholder-message">
          <p>A table displaying existing bulk inputs will appear here.</p>
          <p>(This will be implemented with data from the backend)</p>
        </div>
      </div>
    </div>
  );
};

export default BulkInputPage; // <<<--- මේ තියෙන්නේ හරියටම default export එක