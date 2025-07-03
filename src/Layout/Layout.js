import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import '../styles/Layout.css';

const Layout = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const getPlaceholder = () => {
    if (location.pathname === '/leads') return 'Search Leads...';
    if (location.pathname === '/employees') return 'Search Employees...';
    if (location.pathname === '/dashboard') return 'Search Activities...';
    return 'Search...';
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <TopBar
          placeholder={getPlaceholder()}
          onSearch={handleSearch}
        />
        <div className="page-content">
          <Outlet context={[searchQuery]} />
        </div>
      </div>
    </div>
  );
};

export default Layout;