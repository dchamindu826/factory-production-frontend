// src/components/common/FormField.jsx
import React from 'react';

const FormField = ({ label, type = 'text', name, value, onChange, placeholder, options, error, required = false }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label} {required && <span style={{color: 'red'}}>*</span>}</label>
      {type === 'select' ? (
        <select id={name} name={name} value={value} onChange={onChange} required={required}>
          <option value="">{placeholder || `Select ${label}`}</option>
          {options && options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder || `Enter ${label}`}
          required={required}
        />
      )}
      {error && <p style={{ color: 'red', fontSize: '0.8em', marginTop: '5px' }}>{error}</p>}
    </div>
  );
};

export default FormField;