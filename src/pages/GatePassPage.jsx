// src/pages/GatePassPage.jsx
import React, { useState } from 'react';
import FormField from '../components/common/FormField';
import { addGatePassEntry } from '../services/gatePassService'; // <<<--- අලුත් service function එක import කරන්න

// Define destination list (or import from a shared place)
const destinationSuppliersOrCustomers = [
  { value: 'CIB', label: 'CIB (Return/Transfer)' },
  { value: 'G_FLOCK', label: 'G FLOCK (Return/Transfer)' },
  { value: 'CUSTOMER_X', label: 'Customer X' },
  { value: 'CUSTOMER_Y', label: 'Customer Y' },
];

const GatePassPage = () => {
  const today = new Date().toISOString().slice(0,10);
  const [formData, setFormData] = useState({
    date: today,
    styleNumber: '',
    destination: '',
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
    if (!formData.destination) newErrors.destination = 'Supplier/Destination is required.';
    if (!formData.quantity.trim() || isNaN(formData.quantity) || Number(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be a valid positive number.';
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
        const result = await addGatePassEntry(formData);

        setSubmitStatus({
            success: true,
            error: null,
            message: result.message || 'Gate Pass entry added successfully! Awaiting approval.'
        });
        console.log('API Response:', result);
        // Clear the form on success
        setFormData({ date: today, styleNumber: '', destination: '', quantity: '' });
        setErrors({});

      } catch (apiError) {
        console.error('API Error:', apiError);
        setSubmitStatus({
            success: false,
            error: true,
            message: apiError.message || 'Failed to add Gate Pass entry. Please try again.'
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
      <h1 className="page-header">Gate Pass Management</h1>
      <div className="form-container">
        <h2>Create New Gate Pass Entry</h2>

        {/* Display Success or Error Messages */}
        {submitStatus.message && (
            <div className={`alert ${submitStatus.success ? 'alert-success' : 'alert-danger'}`}>
                {submitStatus.message}
            </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormField
            label="Gate Pass Date" name="date" type="date"
            value={formData.date} onChange={handleChange}
            error={errors.date} required disabled={isLoading}
          />
          <FormField
            label="Style Number" name="styleNumber" type="text"
            value={formData.styleNumber} onChange={handleChange}
            placeholder="Enter Style Number" error={errors.styleNumber} required disabled={isLoading}
          />
           <FormField
            label="Select Supplier / Destination" name="destination" type="select"
            value={formData.destination} onChange={handleChange}
            options={destinationSuppliersOrCustomers} placeholder="Select destination" error={errors.destination} required disabled={isLoading}
          />
          <FormField
            label="Quantity Shipped" name="quantity" type="number"
            value={formData.quantity} onChange={handleChange}
            placeholder="Enter quantity shipped" error={errors.quantity} required disabled={isLoading}
          />
          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? 'Issuing...' : 'Issue Gate Pass'}
            </button>
          </div>
        </form>
      </div>

      {/* --- Table placeholder (as before) --- */}
      <div className="table-placeholder-container card">
        <h3>Issued Gate Pass Entries</h3>
         <div className="table-placeholder-message">
             <p>A table displaying issued gate pass entries will appear here.</p>
         </div>
      </div>
    </div>
  );
};
export default GatePassPage;