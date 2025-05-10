// src/pages/SubContractPage.jsx
import React, { useState, useEffect } from 'react';
import FormField from '../components/common/FormField';
import PriceManagementTable from '../components/subcontract/PriceManagementTable';
import { addSCEntry } from '../services/subContractService'; // Service function එක import කරනවා

// --- උඩ Form එකට අදාළ පොදු මිල ගණන් (කලින් තිබ්බ විදිහටම) ---
const genericDryProcessUnitPrices = {
  HAND_SHINE: 15.50,
  WHISKER: 12.00,
  WHISKER_SAVERONE: 18.75,
  PP: 20.00,
  PP_OVERALL: 25.00,
  TAGGING: 5.00,
  GRINDING: 10.25,
};

// Dry Process ලැයිස්තුව උඩ Form එකට
const dryProcessesListForForm = Object.keys(genericDryProcessUnitPrices).map(key => ({
    value: key,
    label: key.replace(/_/g, ' '),
}));


// --- යට Table එකට අදාළ Supplier මිල ගණන් (මේක එහෙමම තියෙනවා) ---
const initialSupplierPrices = {
  CIB: {
    HAND_SHINE: 15.00, WHISKER: 11.50, WHISKER_SAVERONE: 18.00, PP: 19.50,
    PP_OVERALL: 24.00, TAGGING: 4.75, GRINDING: 10.00,
  },
  G_FLOCK: {
    HAND_SHINE: 14.50, WHISKER: 11.00, WHISKER_SAVERONE: 17.50, PP: 19.00,
    PP_OVERALL: 23.50, TAGGING: 4.50, GRINDING: 9.75,
  },
};


const SubContractPage = () => {
  const today = new Date().toISOString().slice(0,10);
  // formData එකෙන් supplierForPricing අයින් කළා
  const [formData, setFormData] = useState({
    date: today,
    styleNumber: '',
    processName: '', // Process name එක විතරයි
    quantity: '',
    subContractorName: '',
  });

  const [unitPriceForForm, setUnitPriceForForm] = useState(0);
  const [totalSalary, setTotalSalary] = useState(0);
  const [errors, setErrors] = useState({});
  const [supplierPricesState, setSupplierPricesState] = useState(initialSupplierPrices); // Table එකට state එක
  const [isLoading, setIsLoading] = useState(false); // API call loading
  const [submitStatus, setSubmitStatus] = useState({ success: false, error: null, message: '' }); // Submit status

  // Form එකේ Process එක තේරුවම පොදු Unit Price එක update කිරීම
  useEffect(() => {
    // supplierForPricing එක මත රඳා පවතින්නේ නැහැ දැන්
    if (formData.processName && genericDryProcessUnitPrices[formData.processName]) {
      setUnitPriceForForm(genericDryProcessUnitPrices[formData.processName]);
    } else {
      setUnitPriceForForm(0);
    }
  }, [formData.processName]); // Dependency එක processName විතරයි

  // Quantity හෝ Unit Price වෙනස් වෙද්දී Total Salary එක calculate කිරීම (වෙනසක් නැහැ)
  useEffect(() => {
    const quantityNum = parseFloat(formData.quantity);
    if (!isNaN(quantityNum) && quantityNum > 0 && unitPriceForForm > 0) {
      setTotalSalary(quantityNum * unitPriceForForm);
    } else {
      setTotalSalary(0);
    }
  }, [formData.quantity, unitPriceForForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) { setErrors(prev => ({ ...prev, [name]: null })); }
    setSubmitStatus({ success: false, error: null, message: '' });
  };

  // Frontend validation (supplierForPricing අයින් කළා)
  const validateForm = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Date is required.';
    if (!formData.subContractorName.trim()) newErrors.subContractorName = 'Sub Contractor name is required.';
    if (!formData.styleNumber.trim()) newErrors.styleNumber = 'Style Number is required.';
    if (!formData.processName) newErrors.processName = 'Process is required.';
    if (!formData.quantity.trim() || isNaN(formData.quantity) || Number(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be a valid positive number.';
    }
    // Unit price 0 ද කියලා බලන එක තවදුරටත් අවශ්‍ය වෙන්න පුළුවන්
    if (formData.processName && unitPriceForForm <= 0) {
        newErrors.processName = `Unit price not found for selected process in generic list.`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // handleSubmit function (submissionData එකෙන් supplierForPricing අයින් කළා)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ success: false, error: null, message: '' });

    if (validateForm()) {
      setIsLoading(true);
      const submissionData = {
          date: formData.date,
          subContractorName: formData.subContractorName,
          styleNumber: formData.styleNumber,
          processName: formData.processName,
          quantity: parseInt(formData.quantity),
          unitPriceUsed: unitPriceForForm, // පොදු මිල තමයි දැන් යන්නේ
          calculatedSalary: totalSalary // ඒ අනුව හැදුණු salary එක
      };

      try {
        const result = await addSCEntry(submissionData); // Service function එක call කරනවා
        setSubmitStatus({ success: true, error: null, message: result.message || 'Sub contract entry added successfully! Awaiting approval.'});
        console.log('API Response:', result);
        // Form එක clear කරනවා
        setFormData({ date: today, styleNumber: '', processName: '', quantity: '', subContractorName: '' });
        setErrors({});
      } catch (apiError) {
        console.error('API Error:', apiError);
        setSubmitStatus({ success: false, error: true, message: apiError.message || 'Failed to add sub contract entry.' });
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('Frontend Validation errors:', errors);
      setSubmitStatus({ success: false, error: true, message: 'Please fix the errors in the form.' });
    }
  };

  // Table එකේ මිල ගණන් update කරන function එක (වෙනසක් නැහැ)
  const handleSupplierPricesUpdateInParent = (updatedPrices) => {
     setSupplierPricesState(updatedPrices);
     console.log('Supplier prices updated in parent component state:', updatedPrices);
     alert('Supplier prices updated in the management table! (Changes are in frontend state only for now)');
  };

  return (
    <div>
      <h1 className="page-header">Sub Contract - Dry Process Management</h1>

      {/* ----- Log Sub Contract Work Form (Supplier තෝරන එක නැතුව) ----- */}
      <div className="form-container">
        <h2>Log Sub Contract Production & Calculate Salary</h2>
        {submitStatus.message && ( <div className={`alert ${submitStatus.success ? 'alert-success' : 'alert-danger'}`}>{submitStatus.message}</div> )}
        <form onSubmit={handleSubmit}>
          <FormField
            label="Date" name="date" type="date"
            value={formData.date} onChange={handleChange}
            error={errors.date} required disabled={isLoading}
          />
           <FormField
            label="Sub Contractor Name" name="subContractorName" type="text"
            value={formData.subContractorName} onChange={handleChange}
            placeholder="Enter Sub Contractor's Name" error={errors.subContractorName} required disabled={isLoading}
          />
          <FormField
            label="Style Number" name="styleNumber" type="text"
            value={formData.styleNumber} onChange={handleChange}
            placeholder="e.g., STY1001" error={errors.styleNumber} required disabled={isLoading}
          />
          {/* Supplier තෝරන dropdown එක මෙතන නැහැ */}
          <FormField
            label="Select Dry Process" name="processName" type="select"
            value={formData.processName} onChange={handleChange}
            options={dryProcessesListForForm} // පොදු process list එක
            placeholder="Select a process" error={errors.processName} required disabled={isLoading} // Supplier තේරුවම enable වෙන logic එක අයින් කළා
          />
          <FormField
            label="Quantity Processed (Pieces)" name="quantity" type="number"
            value={formData.quantity} onChange={handleChange}
            placeholder="Enter processed quantity" error={errors.quantity} required disabled={!formData.processName || isLoading}
          />
          {/* Display Unit Price and Calculated Total Salary (පොදු මිල අනුව) */}
          <div className="form-group">
            <label>Unit Price Used (Per Piece)</label>
            <input type="text" value={formData.processName ? `Rs. ${unitPriceForForm.toFixed(2)}` : 'N/A'} readOnly className="readonly-field" />
          </div>
          <div className="form-group">
            <label>Calculated Total Salary for this Entry</label>
            <input type="text" value={`Rs. ${totalSalary.toFixed(2)}`} readOnly className="readonly-field" />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? 'Logging...' : 'Log Production & Salary'}
            </button>
          </div>
        </form>
      </div>

      {/* Logged Entries Table Placeholder (වෙනසක් නැහැ) */}
       <div className="table-placeholder-container card">
           <h3>Logged Sub Contract Entries (From Top Form)</h3>
           <div className="table-placeholder-message">
               <p>A table displaying logged sub contract entries will appear here.</p>
           </div>
       </div>

      {/* Supplier Unit Price Management Table (මේක වෙනසක් නැතුව එහෙමම තියෙනවා) */}
      <PriceManagementTable
        initialPrices={supplierPricesState}
        onPricesUpdate={handleSupplierPricesUpdateInParent}
      />
    </div>
  );
};

export default SubContractPage;