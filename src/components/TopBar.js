import React from 'react';
import '../styles/TopBar.css';
import searchIcon from '../assests/images/SearchIcon.png';

const TopBar = ({ placeholder, onSearch }) => {
  return (
    <div className="navbar">
      <div className="search-container">
        <img src={searchIcon} alt="search" className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder={placeholder || 'Search here...'}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
};

export default TopBar;
