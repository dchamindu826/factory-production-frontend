// src/pages/WashingPage.jsx
import React, { useState } from 'react';
import FormField from '../components/common/FormField';
import { addWashingEntry } from '../services/washingService'; // <<<--- අලුත් service function එක import කරන්න

// Define washCategories list here or import it
const washCategories = [
    { value: 'BEFORE_WASH', label: 'Before Wash' },
    { value: 'AFTER_WASH', label: 'After Wash' },
    { value: 'FINISH', label: 'Finish' },
];

const WashingPage = () => {
  const today = new Date().toISOString().slice(0,10);
  const [formData, setFormData] = useState({
    date: today,
    styleNumber: '',
    washCategory: '',
    quantity: '',
  });

  const [errors, setErrors] = useState({}); // Frontend validation errors
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [submitStatus, setSubmitStatus] = useState({ success: false, error: null, message: '' }); // Submit status

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) { setErrors(prev => ({ ...prev, [name]: null })); }
    setSubmitStatus({ success: false, error: null, message: '' });
  };

  // Frontend validation function
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

  // Updated handleSubmit function
  const handleSubmit = async (e) => { // Make async
    e.preventDefault();
    setSubmitStatus({ success: false, error: null, message: '' });

    if (validateForm()) {
      setIsLoading(true);
      try {
        // Call the service function
        const result = await addWashingEntry(formData);

        setSubmitStatus({
            success: true,
            error: null,
            message: result.message || 'Washing entry added successfully! Awaiting approval.'
        });
        console.log('API Response:', result);
        // Clear the form on success
        setFormData({ date: today, styleNumber: '', washCategory: '', quantity: '' });
        setErrors({});

      } catch (apiError) {
        console.error('API Error:', apiError);
        setSubmitStatus({
            success: false,
            error: true,
            message: apiError.message || 'Failed to add washing entry. Please try again.'
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
      <h1 className="page-header">Washing Process Production Update</h1>
      <div className="form-container">
        <h2>Log Washing Process</h2>

        {/* Display Success or Error Messages */}
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
            placeholder="Enter Style Number" error={errors.styleNumber} required disabled={isLoading}
          />
          <FormField
            label="Select Wash Category" name="washCategory" type="select"
            value={formData.washCategory} onChange={handleChange}
            options={washCategories} placeholder="Select a wash category" error={errors.washCategory} required disabled={isLoading}
          />
          <FormField
            label="Quantity Processed" name="quantity" type="number"
            value={formData.quantity} onChange={handleChange}
            placeholder="Enter processed quantity" error={errors.quantity} required disabled={isLoading}
          />
          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Process'}
            </button>
          </div>
        </form>
      </div>

      {/* --- Table placeholder (as before) --- */}
      <div className="table-placeholder-container card">
        <h3>Today's Washing Process Entries</h3>
         <div className="table-placeholder-message">
             <p>A table displaying today's washing entries will appear here.</p>
             <p>(This will be implemented later)</p>
         </div>
      </div>
    </div>
  );
};
export default WashingPage;