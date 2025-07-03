import React, { useEffect, useRef, useState } from 'react';
import { Info, X } from 'lucide-react';
import './EmployeeFormModal.css';

const EmployeeFormModal = ({ employee, onClose, onSubmit, isEdit }) => {
  const modalRef = useRef();

  const [formData, setFormData] = useState({
    firstName: employee?.firstName || '',
    lastName: employee?.lastName || '',
    email: employee?.email || '',
    location: employee?.location || 'Pune',
    language: employee?.language || 'Hindi'
  });

  const locations = ['Pune', 'Hyderabad', 'Delhi'];
  const languages = ['Hindi', 'English', 'Bengali', 'Tamil'];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="emp-modal-overlay">
      <div className="emp-modal-content" ref={modalRef}>
        {/* Header with X Button */}
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Employee' : 'Add Employee'}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* First Name */}
          <div className="form-group">
            <div className="label-row">
              <label>First Name</label>
            </div>
            <input
              type="text"
              placeholder="Enter First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>

          {/* Last Name */}
          <div className="form-group">
            <div className="label-row">
              <label>Last Name</label>
            </div>
            <input
              type="text"
              placeholder="Enter Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <div className="label-row">
              <label>Email</label>
            </div>
            <input
              type="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          {/* Location */}
          <div className="form-group">
            <div className="label-row">
              <label>Location</label>
              <div className="info-tooltip">
                <Info size={14} />
                <span className="tooltip-text">Lead will be assigned based on location</span>
              </div>
            </div>
            <select
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              disabled={isEdit}
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Preferred Language */}
          <div className="form-group">
            <div className="label-row">
              <label>Preferred Language</label>
              <div className="info-tooltip">
                <Info size={14} />
                <span className="tooltip-text">Lead will be assigned based on language</span>
              </div>
            </div>
            <select
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              disabled={isEdit}
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          {/* Save or Update Button */}
          <div className="emp-modal-actions">
            <button type="submit">{isEdit ? 'Update' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeFormModal;
