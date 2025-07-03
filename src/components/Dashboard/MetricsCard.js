import React from 'react';
import '../../styles/MetricsCard.css';

const MetricsCard = ({ title, value, icon }) => {
  return (
    <div className="metrics-card">
      <div className="metrics-icon">
        <img src={icon} alt={title} className="metrics-icon-img" />
      </div>
      <div className="metrics-content">
        <h3>{title}</h3>
        <p className="metrics-value">{value}</p>
      </div>
    </div>
  );
};

export default MetricsCard;
