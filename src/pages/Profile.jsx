import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import '../styles/Profile.css';

const Profile = () => {
  const [employee, setEmployee] = useState(() => {
    return JSON.parse(localStorage.getItem('employee')) || {};
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        email: employee.email || '',
        password: employee.lastName || '',
        confirmPassword: employee.lastName || ''
      });
    }
  }, [employee]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/employees/${employee._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password
          })
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert('Profile updated');
        localStorage.setItem('employee', JSON.stringify(data));
        setEmployee(data);
      } else {
        alert(data.error || 'Update failed');
      }
    } catch (error) {
      alert('Error updating profile');
    }
  };

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-header-top">
          <h1>Canova<span>CRM</span></h1>
        </div>
        <div className="profile-header-bottom">
          <ChevronLeft className="icon" />
          <h2>Profile</h2>
        </div>
      </div>

      {/* Form */}
      <div className="profile-form">
        {['firstName', 'lastName', 'email', 'password', 'confirmPassword'].map((field) => (
          <div key={field} className="profile-input-group">
            <label>
              {field === 'firstName' && 'First Name'}
              {field === 'lastName' && 'Last Name'}
              {field === 'email' && 'Email'}
              {field === 'password' && 'Password'}
              {field === 'confirmPassword' && 'Confirm Password'}
            </label>
            <input
              type={field.includes('password') ? 'password' : 'text'}
              value={formData[field]}
              onChange={(e) => handleInputChange(field, e.target.value)}
            />
          </div>
        ))}

        <button className="profile-save-btn" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default Profile;
