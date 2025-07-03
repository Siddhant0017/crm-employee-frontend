import React from 'react';
import '../styles/BreadcrumbNav.css';

const BreadcrumbNav = ({ items }) => {
  return (
    <div className="breadcrumb">
      {items.map((item, index) => (
        <div key={index} className="breadcrumb-item">
          {item.isActive ? (
            <span className="active">{item.label}</span>
          ) : (
            <>
              <a href={item.href} className="link" > {item.label}</a>
              <span className="separator">{' > '}</span>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default BreadcrumbNav;
