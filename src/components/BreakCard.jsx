import React, { useState } from 'react';
import '../styles/BreakCard.css';

const BreakCard = () => {
  const [onBreak, setOnBreak] = useState(false);

  return (
    <div className="break-card">
      <div className="time-info">
        <div>
          <p className="label">Break</p>
          <h4 className="time">01:25 PM</h4>
        </div>
        <div>
          <p className="label">Ended</p>
          <h4 className="time">{onBreak ? '--:--' : '02:15 PM'}</h4>
        </div>
      </div>
      <div 
        className={`indicator ${onBreak ? 'green' : 'red'}`}
        onClick={() => setOnBreak(!onBreak)}
      ></div>
    </div>
  );
};

export default BreakCard;