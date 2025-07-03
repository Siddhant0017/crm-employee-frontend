import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/RecentActivitySection.css';

const API_URL = process.env.REACT_APP_API_BASE_URL;

const RecentActivitySection = () => {
  const [activities, setActivities] = useState([]);

  const fetchActivities = async () => {
    try {
      const res = await axios.get(`${API_URL}/activities?limit=50`);
      setActivities(res.data);
    } catch (err) {
      console.error('Error fetching activities:', err);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div className="recent-activity">
      <h3>Recent Activities Feed</h3>
      <div className="activity-container">
        <ul className="activity-list">
          {activities.length === 0 ? (
            <li>No recent activities</li>
          ) : (
            activities.map((act, idx) => (
              <li key={idx}>
                <span className="bullet">•</span>
                <div className="activity-content">
                  <span className="message">{act.message}</span>
                  <span className="time">{act.timeAgo}</span>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default RecentActivitySection;
