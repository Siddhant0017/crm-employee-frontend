import React, { useEffect, useState } from 'react';
import {
  SlidersHorizontal,
  Calendar,
  ChevronLeft,
} from 'lucide-react';
import '../styles/MyLeads.css';
import searchIcon from '../assests/images/search.png';

const MyLeads = () => {
  const employee = JSON.parse(localStorage.getItem('employee'));
  const employeeId = employee?._id || employee?.id;

  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const [openDropdown, setOpenDropdown] = useState(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const typeColors = {
    hot: '#f77307',
    warm: '#f7d307',
    cold: '#07eff7',
  };

  // Close dropdown on clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest('.dropdown') &&
        !e.target.closest('.btn') &&
        !e.target.closest('.filter-btn')
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Fetch Leads
  const fetchLeads = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (typeFilter !== 'all') params.append('type', typeFilter);

      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/leads/employee/${employeeId}?${params}`
      );
      const data = await res.json();
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  useEffect(() => {
    if (employeeId) fetchLeads();
  }, [employeeId, searchTerm, statusFilter, typeFilter]);

  // Update Lead API
  const updateLead = async (id, updateData) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/leads/${id}/status`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData),
        }
      );
      const data = await res.json();
      if (res.ok) {
        fetchLeads();
        setOpenDropdown(null);
        setSelectedStatus('');
      } else {
        throw new Error(data.error || 'Error updating lead');
      }
    } catch (error) {
      console.error('Update Error:', error);
    }
  };

  // Save Lead Type
  const handleTypeSave = (leadId, type) => {
    updateLead(leadId, { type });
  };

  // Check for overlap
  const isOverlap = (start1, end1, start2, end2) => {
    return start1 < end2 && start2 < end1;
  };

  // Save Schedule with Conflict Check
  const handleScheduleSave = (leadId) => {
    if (scheduleDate && scheduleTime) {
      const start = new Date(`${scheduleDate}T${scheduleTime}:00`);
      const end = new Date(start.getTime() + 30 * 60000); // 30 min slot

      const hasConflict = leads.some(
        (lead) =>
          lead._id !== leadId &&
          lead.scheduledDate &&
          isOverlap(
            start,
            end,
            new Date(lead.scheduledDate),
            new Date(new Date(lead.scheduledDate).getTime() + 30 * 60000)
          )
      );

      if (hasConflict) {
        alert('Schedule conflict: Another lead is already scheduled at this time.');
        return;
      }

      updateLead(leadId, {
        scheduledDate: start,
        scheduledEndTime: end,
      });
    }
  };

  // Save Status with Future Check
  const handleStatusSave = (leadId) => {
    const lead = leads.find((l) => l._id === leadId);
    const now = new Date();

    if (selectedStatus === 'closed') {
      if (lead?.scheduledDate && new Date(lead.scheduledDate) > now) {
        alert('Cannot close a lead scheduled for the future.');
        return;
      }
    }

    const newStatus = selectedStatus === 'ongoing' ? 'open' : 'closed';
    updateLead(leadId, { status: newStatus });
  };
  return (
    <div className="leads-page">
      {/* Header */}
      <div className="header">
        <div className="header-top">
          <h1>Canova<span>CRM</span></h1>
        </div>
        <div className="header-bottom">
          <ChevronLeft className="icon" />
          <h2>Leads</h2>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="search-bar">
        <div className="search-input">
          <img src={searchIcon} alt="Search" className="search-icon" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div
          className="filter-btn"
          onClick={(e) => {
            e.stopPropagation();
            setOpenDropdown(openDropdown === 'filter' ? null : 'filter');
          }}
        >
          <SlidersHorizontal className="filter-icon" />
          {openDropdown === 'filter' && (
            <div className="filter-dropdown dropdown">
              <div
                className={statusFilter === 'all' ? 'active' : ''}
                onClick={() => {
                  setStatusFilter('all');
                  setOpenDropdown(null);
                }}
              >
                All
              </div>
              <div
                className={statusFilter === 'open' ? 'active' : ''}
                onClick={() => {
                  setStatusFilter('open');
                  setOpenDropdown(null);
                }}
              >
                Ongoing
              </div>
              <div
                className={statusFilter === 'closed' ? 'active' : ''}
                onClick={() => {
                  setStatusFilter('closed');
                  setOpenDropdown(null);
                }}
              >
                Closed
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Leads List */}
      <div className="leads-list">
        
        {leads.length === 0 ? (
          <p>No Leads Found</p>
        ) : (
          leads.map((lead) => (
            <div className="lead-card" key={lead._id}>
              <div
                className="color-bar"
                style={{ backgroundColor: typeColors[lead.type] || '#f0cfb4' }}
              ></div>

              <div className="lead-content">
                <div className="lead-info">
                  <h3>{lead.name}</h3>
                  <p>@{lead.email}</p>
                  <div className="date">
                    <Calendar className="date-icon" />
                    <span>{new Date(lead.receivedDate).toDateString()}</span>
                  </div>
                </div>

                <div className="lead-actions">
                  <div
                    className="status-circle"
                    style={{ borderColor: typeColors[lead.type] }}
                  >
                    <span>{lead.status === 'closed' ? 'Closed' : 'Ongoing'}</span>
                  </div>

                  <div className="buttons">
                    {/* Type */}
                    {openDropdown === `type-${lead._id}` ? (
                      <div className="type-dropdown dropdown">
                        <h2>Type</h2>
                        <div className="type-options">
                          <button
                            className="hot"
                            onClick={() => handleTypeSave(lead._id, 'hot')}
                          >
                            Hot
                          </button>
                          <button
                            className="warm"
                            onClick={() => handleTypeSave(lead._id, 'warm')}
                          >
                            Warm
                          </button>
                          <button
                            className="cold"
                            onClick={() => handleTypeSave(lead._id, 'cold')}
                          >
                            Cold
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdown(`type-${lead._id}`);
                        }}
                      >
                        <img
                          src={require('../assests/images/Edit.png')}
                          alt="Edit"
                          className="btn-icon"
                        />
                      </button>
                    )}

                    {/* Schedule */}
                    {openDropdown === `schedule-${lead._id}` ? (
                      <div className="schedule-dropdown dropdown">
                        <label>Date</label>
                        <input
                          type="date"
                          value={scheduleDate}
                          onChange={(e) => setScheduleDate(e.target.value)}
                        />
                        <label>Time</label>
                        <input
                          type="time"
                          value={scheduleTime}
                          onChange={(e) => setScheduleTime(e.target.value)}
                        />
                        <button
                          className="save-btn"
                          onClick={() => handleScheduleSave(lead._id)}
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdown(`schedule-${lead._id}`);
                        }}
                      >
                        <img
                          src={require('../assests/images/Schedule.png')}
                          alt="Schedule"
                          className="btn-icon"
                        />
                      </button>
                    )}

                    {/* Status */}
                    {openDropdown === `status-${lead._id}` ? (
                      <div className="status-dropdown dropdown">
                        <h2>Lead Status</h2>
                        <select
                          className="status-select"
                          value={selectedStatus || (lead.status === 'open' ? 'ongoing' : 'closed')}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                          <option value="ongoing">Ongoing</option>
                          <option value="closed">Closed</option>
                        </select>
                        <button
                          className="save-btn"
                          onClick={() => handleStatusSave(lead._id)}
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdown(`status-${lead._id}`);
                          setSelectedStatus(lead.status === 'open' ? 'ongoing' : 'closed');
                        }}
                      >
                        <img
                          src={require('../assests/images/Status.png')}
                          alt="Status"
                          className="btn-icon"
                        />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyLeads;
