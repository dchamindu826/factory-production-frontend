// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

// Helper component for icons
const Icon = ({ children }) => <span className="nav-icon">{children}</span>;

const Sidebar = ({ onToggleSidebar }) => {
  // Get user role from localStorage to conditionally render links
  const authUserString = localStorage.getItem('authUser');
  let userRole = null;
  if (authUserString) {
    try {
      userRole = JSON.parse(authUserString).role;
    } catch (e) {
      console.error("Error parsing authUser for sidebar", e);
    }
  }

  // Function to close sidebar on mobile after link click
  // This is relevant if this sidebar component were to be used in a mobile overlay scenario.
  // For the current setup where mobile uses a dropdown in Navbar, this specific handler might not be directly used by NavLinks here
  // but is kept if onToggleSidebar is passed for the close button.
  const handleLinkClick = () => {
    if (window.innerWidth <= 768 && typeof onToggleSidebar === 'function') {
      onToggleSidebar();
    }
  };

  return (
    // This sidebar is styled to be visible on desktop and hidden on mobile by CSS
    <aside className="app-sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Admin Panel</h2>
        {/* This close button is styled to be display:none on desktop,
            and display:block (if sidebar is open) on mobile.
            However, since the entire .app-sidebar is display:none on mobile,
            this button effectively only shows if you were to manually make .app-sidebar visible on mobile.
        */}
        <button className="sidebar-close-button" onClick={onToggleSidebar}>
          ✖
        </button>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {/* Dashboard Link (Visible to all logged-in users) */}
          <li><NavLink to="/" end onClick={handleLinkClick}><Icon>🏠</Icon><span>Dashboard</span></NavLink></li>

          {/* Data Entry Links (Visible to ADMIN and DATA_ENTRY) */}
          {(userRole === 'ADMIN' || userRole === 'DATA_ENTRY') && (
            <>
              <li className="sidebar-nav-heading">Data Management</li>
              <li><NavLink to="/bulk-input" onClick={handleLinkClick}><Icon>📥</Icon><span>Bulk Input</span></NavLink></li>
              <li><NavLink to="/dry-process" onClick={handleLinkClick}><Icon>🌵</Icon><span>Dry Process</span></NavLink></li>
              <li><NavLink to="/washing" onClick={handleLinkClick}><Icon>💧</Icon><span>Washing</span></NavLink></li>
              <li><NavLink to="/sub-contracts" onClick={handleLinkClick}><Icon>👥</Icon><span>Sub Contracts</span></NavLink></li>
              <li><NavLink to="/gate-pass" onClick={handleLinkClick}><Icon>🚚</Icon><span>Gate Pass</span></NavLink></li>
            </>
          )}

          {/* Reports Link (Visible to ADMIN and DATA_ENTRY - adjust if needed) */}
          {(userRole === 'ADMIN' || userRole === 'DATA_ENTRY') && (
             <li><NavLink to="/reports" onClick={handleLinkClick}><Icon>📊</Icon><span>Reports</span></NavLink></li>
          )}

          {/* --- Admin Only Links --- */}
          {userRole === 'ADMIN' && (
            <>
              <li className="sidebar-nav-heading">Admin Approvals</li>
              <li><NavLink to="/admin/pending-bulk-inputs" onClick={handleLinkClick}><Icon>⏳</Icon><span>Pending Bulk Inputs</span></NavLink></li>
              <li><NavLink to="/admin/pending-dry-process" onClick={handleLinkClick}><Icon>⏳</Icon><span>Pending Dry Process</span></NavLink></li>
              <li><NavLink to="/admin/pending-washing" onClick={handleLinkClick}><Icon>⏳</Icon><span>Pending Washing</span></NavLink></li>
              <li><NavLink to="/admin/pending-sub-contracts" onClick={handleLinkClick}><Icon>⏳</Icon><span>Pending Sub Contracts</span></NavLink></li>
              <li><NavLink to="/admin/pending-gate-pass" onClick={handleLinkClick}><Icon>⏳</Icon><span>Pending Gate Pass</span></NavLink></li>
            </>
          )}
        </ul>
      </nav>
      {/* Optional Footer */}
      {/* <div className="sidebar-footer">
        <p>&copy; {new Date().getFullYear()} DenimPro</p>
      </div> */}
    </aside>
  );
};

export default Sidebar;
