import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home } from 'lucide-react'; // ✅ Home icon from Lucide
import '../styles/BottomNav.css';

//Upload your images
import LeadsIcon from '../assests/images/mdi_leads.png';
import ScheduleIcon from '../assests/images/calendar.png';
import ProfileIcon from '../assests/images/profile.png';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      label: 'Home',
      path: '/dashboard',
      type: 'icon', // uses Lucide
    },
    {
      label: 'Leads',
      path: '/leads',
      icon: LeadsIcon,
      type: 'image',
    },
    {
      label: 'Schedule',
      path: '/schedule',
      icon: ScheduleIcon,
      type: 'image',
    },
    {
      label: 'Profile',
      path: '/profile',
      icon: ProfileIcon,
      type: 'image',
    },
  ];

  return (
    <div className="bottom-bar">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;

        return (
          <div
            key={tab.label}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            {tab.type === 'icon' ? (
              <Home
                className="nav-icon"
                color={isActive ? '#2051e5' : '#666666'}
                size={24}
              />
            ) : (
              <img
                src={tab.icon}
                alt={tab.label}
                className={`nav-img ${isActive ? 'active' : ''}`}
              />
            )}
            <div>{tab.label}</div>
          </div>
        );
      })}
    </div>
  );
};

export default BottomNav;
