import React, { useState, useEffect } from 'react';
import '../../styles/LeadsActivity.css';

const API_URL = process.env.REACT_APP_API_BASE_URL;

const LeadsActivity = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(0);
  const leadsPerPage = 10;

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch(`${API_URL}/leads`);
        const data = await response.json();
        setLeads(data);
        setFilteredLeads(data);
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };
    fetchLeads();
  }, []);

  useEffect(() => {
    let result = leads;

    if (searchTerm) {
      result = result.filter(lead =>
        Object.values(lead).some(
          value =>
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter(lead => lead.status === statusFilter);
    }

    setFilteredLeads(result);
    setCurrentPage(0);
  }, [searchTerm, statusFilter, leads]);

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');

      setLeads(leads.map(lead =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleTypeChange = async (leadId, newType) => {
    try {
      const res = await fetch(`${API_URL}/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: newType }),
      });
      if (!res.ok) throw new Error('Failed to update type');

      setLeads(leads.map(lead =>
        lead.id === leadId ? { ...lead, type: newType } : lead
      ));
    } catch (error) {
      console.error('Error updating type:', error);
    }
  };

  const pageCount = Math.ceil(filteredLeads.length / leadsPerPage);
  const offset = currentPage * leadsPerPage;
  const currentLeads = filteredLeads.slice(offset, offset + leadsPerPage);

  return (
    <div className="leads-page">
      <div className="leads-header">
        <h2>Leads Management</h2>

        <div className="filters">
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="leads-table-container">
        <table className="leads-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Location</th>
              <th>Language</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentLeads.map(lead => (
              <tr key={lead.id}>
                <td>{lead.name}</td>
                <td>{lead.contact}</td>
                <td>{lead.location}</td>
                <td>{lead.language}</td>
                <td>
                  <select
                    value={lead.type || 'Warm'}
                    onChange={(e) => handleTypeChange(lead.id, e.target.value)}
                    className="type-select"
                  >
                    <option value="Hot">Hot</option>
                    <option value="Warm">Warm</option>
                    <option value="Cold">Cold</option>
                  </select>
                </td>
                <td>
                  <select
                    value={lead.status || 'Open'}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    className="status-select"
                    disabled={lead.scheduled && new Date(lead.scheduled) > new Date()}
                  >
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>
                <td>
                  <button
                    className="schedule-btn"
                    onClick={() => { /* Implement schedule modal */ }}
                  >
                    Schedule
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
          Previous
        </button>

        <span>Page {currentPage + 1} of {pageCount}</span>

        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount - 1))}
          disabled={currentPage >= pageCount - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LeadsActivity;
