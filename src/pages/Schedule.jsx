import React, { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, MapPin, ChevronLeft } from 'lucide-react';
import '../styles/Schedule.css';

const Schedule = () => {
  const employee = JSON.parse(localStorage.getItem('employee'));
  const employeeId = employee?._id || employee?.id;

  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('today');
  const [openFilterDropdown, setOpenFilterDropdown] = useState(false);

  const fetchScheduledLeads = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/leads/employee/${employeeId}`);
      const data = await res.json();
      const scheduledLeads = data.filter(
        (lead) => lead.scheduledDate && lead.status !== 'closed'
      );
      setLeads(scheduledLeads);
    } catch (error) {
      console.error('Error fetching scheduled leads:', error);
    }
  };

  useEffect(() => {
    if (employeeId) {
      fetchScheduledLeads();
    }
  }, [employeeId]);

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenFilterDropdown(false);
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const filteredLeads = leads.filter((lead) => {
    const leadDate = new Date(lead.scheduledDate).toISOString().split('T')[0];
    const todayDate = new Date().toISOString().split('T')[0];

    const dateMatch = filter === 'today' ? leadDate === todayDate : true;
    const searchMatch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase()));

    return dateMatch && searchMatch;
  });

  return (
    <div className="schedule-container">
      {/* Header */}
      <div className="schedule-header">
        <div className="schedule-header-top">
          <h1>Canova<span>CRM</span></h1>
        </div>
        <div className="schedule-header-bottom">
          <ChevronLeft className="schedule-back-icon" />
          <h2>Schedule</h2>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="schedule-search-container">
        <div className="schedule-search-bar">
          <Search className="schedule-search-icon" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div
          className="schedule-filter-section"
          onClick={(e) => e.stopPropagation()}
        >
          <SlidersHorizontal
            className="schedule-filter-icon"
            onClick={() => setOpenFilterDropdown((prev) => !prev)}
          />

          {openFilterDropdown && (
            <div className="schedule-filter-dropdown">
              <div
                className={filter === 'today' ? 'active' : ''}
                onClick={() => {
                  setFilter('today');
                  setOpenFilterDropdown(false);
                }}
              >
                Today
              </div>
              <div
                className={filter === 'all' ? 'active' : ''}
                onClick={() => {
                  setFilter('all');
                  setOpenFilterDropdown(false);
                }}
              >
                All
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className="schedule-cards-wrapper">
        {filteredLeads.length === 0 ? (
          <p className="schedule-no-data">No Scheduled Calls</p>
        ) : (
          filteredLeads.map((lead) => (
            <div
              key={lead._id}
              className={`schedule-card ${
                lead.type === 'referral' ? 'schedule-card-referral' : 'schedule-card-coldcall'
              }`}
            >
              <div className="schedule-card-header">
                <div>
                  <h3>{lead.type === 'referral' ? 'Referral' : 'Cold Call'}</h3>
                  <p>{lead.phone}</p>
                </div>
                <div className="schedule-card-date">
                  <p>Date</p>
                  <p>{new Date(lead.scheduledDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="schedule-card-middle">
                <MapPin className="schedule-map-icon" />
                <span>Call</span>
              </div>

              <div className="schedule-card-footer">
                <div className="schedule-avatar">{lead.name.charAt(0)}</div>
                <div className="schedule-footer-info">
                  <span>{lead.name}</span>
                  <span className="schedule-email">{lead.email}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Schedule;
