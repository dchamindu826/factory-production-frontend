// src/components/dashboard/SummaryCard.jsx
import React from 'react';
import './SummaryCard.css'; // We'll create this CSS file next

const SummaryCard = ({ title, value, icon, detailsLink, unit }) => {
  return (
    <div className="summary-card">
      {icon && <div className="card-icon">{icon}</div>}
      <div className="card-content">
        <h4>{title}</h4>
        <p className="card-value">
          {value} {unit && <span className="card-unit">{unit}</span>}
        </p>
        {detailsLink && (
          <a href={detailsLink} className="card-details-link">
            View Details
          </a>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;