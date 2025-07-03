import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const [menuItems, setMenuItems] = useState([
    { name: "Dashboard", path: "/dashboard", active: true },
    { name: "Leads", path: "/leads", active: false },
    { name: "Employees", path: "/employees", active: false },
    { name: "Settings", path: "/settings", active: false },
  ]);

  const handleNavClick = (clickedName) => {
    const updatedItems = menuItems.map((item) => ({
      ...item,
      active: item.name === clickedName,
    }));
    setMenuItems(updatedItems);
  };

  return (
    <div className="sidebar">
     <div className="sidebar-brand">
  Canova<span className="crm-highlight">CRM</span>
</div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `nav-item ${isActive ? "active" : ""}`
            }
            data-page={item.name.toLowerCase()}
            onClick={() => handleNavClick(item.name)}
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
     
    </div>
  );
};

export default Sidebar;
