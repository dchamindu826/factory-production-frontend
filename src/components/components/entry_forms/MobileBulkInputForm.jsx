// src/components/entry_forms/MobileBulkInputForm.jsx
// (Or src/pages/entry/MobileBulkInputForm.jsx if you prefer)
import React, { useState } from 'react';
import FormField from '../../components/common/FormField';
import { addBulkInput } from '../../services/bulkInputService';
// We can reuse the EntryForm.css or the global form styles if they are suitable
// import '../../pages/entry/EntryForm.css'; // If you created this and it has good mobile styles

const MobileBulkInputForm = () => {
  const today = new Date().toISOString().slice(0,10);
  const [formData, setFormData] = useState({
    date: today,
    styleNumber: '',
    quantity: '',
    supplier: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, error: null, message: '' });

  const suppliers = [
    { value: 'CIB', label: 'CIB' },
    { value: 'G_FLOCK', label: 'G Flock' },
  ];

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
        setSubmitStatus({ success: true, error: null, message: result.message || 'Bulk input added! Awaiting approval.' });
        setFormData({ date: today, styleNumber: '', quantity: '', supplier: '' });
        setErrors({});
      } catch (apiError) {
        console.error('API Error:', apiError);
        setSubmitStatus({ success: false, error: true, message: apiError.message || 'Failed to add bulk input.' });
      } finally {
        setIsLoading(false);
      }
    } else {
      setSubmitStatus({ success: false, error: true, message: 'Please fix the errors.' });
    }
  };

  return (
    // Use .form-container and other relevant classes from index.css or a mobile-specific form CSS
    <div className="form-container mobile-entry-form"> {/* Added mobile-entry-form class */}
      <h4>Add New Bulk Input</h4> {/* Changed from h2 for better hierarchy in dashboard */}
      
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
            {isLoading ? 'Adding...' : 'Add Bulk Input'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MobileBulkInputForm; // Default export
