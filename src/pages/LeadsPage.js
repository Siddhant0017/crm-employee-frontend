import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import CsvUploadModal from '../components/Modals/CsvUploadModal';
import BreadcrumbNav from '../components/BreadcrumbNav';
import '../styles/LeadsPage.css';

const LeadsPage = () => {
  const [searchQuery] = useOutletContext();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [leads, setLeads] = useState([]);
  const [, setStats] = useState({
    totalLeads: 0,
    assignedLeads: 0,
    unassignedLeads: 0,
  });

  const [sortBy, setSortBy] = useState('receivedDate');
  const [sortOrder, setSortOrder] = useState('asc');

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Leads', isActive: true },
  ];

  useEffect(() => {
    fetchLeads();
    const intervalId = setInterval(fetchLeads, 30000);
    return () => clearInterval(intervalId);
  }, [searchQuery]);

  const fetchLeads = async () => {
    try {
      const queryParams = new URLSearchParams({
        search: searchQuery,
      });

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/leads/admin?${queryParams}`
      );
      const data = await response.json();
      setLeads(data.leads);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const handleUploadSuccess = () => {
    fetchLeads();
    setIsUploadModalOpen(false);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedLeads = [...leads].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (sortBy === 'receivedDate') {
      valA = new Date(valA);
      valB = new Date(valB);
    }

    if (valA === undefined) valA = '';
    if (valB === undefined) valB = '';

    if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="leads-page-container">
      <div className="header">
        <BreadcrumbNav items={breadcrumbItems} />

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="add-leads-button"
        >
          Upload CSV
        </button>
      </div>

      <div className="leads-table">
        <div className="table-header">
          <div>No.</div>
          <div onClick={() => handleSort('name')}>Name</div>
          <div onClick={() => handleSort('email')}>Email</div>
          <div onClick={() => handleSort('phone')}>Phone No.</div>
          <div onClick={() => handleSort('receivedDate')}>Received Date</div>
          <div onClick={() => handleSort('status')}>Status</div>
          <div onClick={() => handleSort('type')}>Type</div>
        </div>

        <div className="divider-line"></div>

        <div className="table-body">
          {sortedLeads.length > 0 ? (
            sortedLeads.map((lead, index) => (
              <div key={lead._id} className="table-row">
                <div>{index + 1}</div>
                <div>{lead.name}</div>
                <div>{lead.email}</div>
                <div>{lead.phone}</div>
                <div>
                  {lead.receivedDate
                    ? new Date(lead.receivedDate).toLocaleDateString()
                    : 'N/A'}
                </div>
                <div>{lead.status}</div>
                <div>{lead.type}</div>
              </div>
            ))
          ) : (
            <div className="no-data">No leads found</div>
          )}
        </div>
      </div>

      {isUploadModalOpen && (
        <CsvUploadModal
          onClose={() => setIsUploadModalOpen(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
};

export default LeadsPage;
