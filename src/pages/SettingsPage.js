import React, { useState, useEffect } from 'react';
import '../styles/SettingsPage.css';
import BreadcrumbNav from '../components/BreadcrumbNav';

const SettingsPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [adminData, setAdminData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  const [originalData, setOriginalData] = useState({});

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Settings', isActive: true },
  ];

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/admin/profile`);
      const data = await response.json();
      setAdminData(data);
      setOriginalData(data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (isEditing) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/admin/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(adminData)
        });

        if (response.ok) {
          setOriginalData(adminData);
          setIsEditing(false);
        }
      } catch (error) {
        console.error('Error updating admin data:', error);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setAdminData(originalData);
    setIsEditing(false);
  };

  return (
    <div className="settings-page">
      <BreadcrumbNav items={breadcrumbItems} />

      <div className="settings-container">
        <h2>Admin Profile</h2>
        <div className="profile-form">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={adminData.firstName}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={adminData.lastName}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={adminData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div className="button-group">
            {isEditing && (
              <button
                className="cancel-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
            <button
              className={`action-btn ${isEditing ? 'save' : 'edit'}`}
              onClick={handleSubmit}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
