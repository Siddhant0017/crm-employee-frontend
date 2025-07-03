import React from 'react';
import BottomNav from './BottomNav';

const Layout = ({ children }) => {
  return (
    <div
      style={{
        position: 'relative',
        width: '393px',
        height: '852px',
        background: '#fff',
        margin: '0 auto',
        overflow: 'hidden', // no scroll
      }}
    >
      <div style={{ height: '762px' }}>
        {children}
      </div>
      <BottomNav />
    </div>
  );
};

export default Layout;
