import React, { useState } from 'react';
import '../styles/CheckInCard.css';

const CheckInCard = () => {
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [isCheckedOut, setIsCheckedOut] = useState(false);

  const formatTime = (date) => {
    return date
      ? new Date(date).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '--:--';
  };

  const handleToggle = () => {
    const now = new Date();
    if (isCheckedOut) {
      // If checked out, start a new check-in
      setCheckInTime(now);
      setCheckOutTime(null);
      setIsCheckedOut(false);
    } else {
      // If checked in, check out now
      setCheckOutTime(now);
      setIsCheckedOut(true);
    }
  };

  return (
    <div className="checkin-card">
      <div className="time-info">
        <div>
          <p className="label">Check-In</p>
          <h4 className="time">{formatTime(checkInTime)}</h4>
        </div>
        <div>
          <p className="label">Check-Out</p>
          <h4 className="time">{formatTime(checkOutTime)}</h4>
        </div>
      </div>
      <div
        className={`indicator ${isCheckedOut ? 'red' : 'green'}`}
        onClick={handleToggle}
      ></div>
    </div>
  );
};

export default CheckInCard;
