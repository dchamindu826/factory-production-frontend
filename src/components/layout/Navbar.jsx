// src/components/layout/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';
import './MobileNavMenu.css'; // Mobile dropdown menu CSS (මේක හදලා import කරන්න ඕන)

const Icon = ({ children }) => <span className="nav-icon">{children}</span>;

const Navbar = () => { // onToggleSidebar prop එක අයින් කළා
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const storedUser = localStorage.getItem('authUser');
  let username = 'User';
  let userRole = null;

  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      username = parsedUser.username || 'User';
      userRole = parsedUser.role;
    } catch (e) { console.error("Error parsing authUser for Navbar", e); }
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

   useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768 && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobileMenuOpen]);

  return (
    <header className="app-navbar fixed-navbar">
      <div className="navbar-left">
        <button className="sidebar-toggle-button" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? '✖' : '☰'}
        </button>
        <div className="navbar-brand">
          <span className="brand-text">DenimPro</span>
        </div>
      </div>

      <div className="navbar-right">
        <div className="user-profile">
          <span className="user-icon">👤</span>
          <span className="user-name">{username}</span>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>

      <nav className={`mobile-nav-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul>
          <li><NavLink to="/" end onClick={handleMobileLinkClick}><Icon>🏠</Icon><span>Dashboard</span></NavLink></li>

          {(userRole === 'ADMIN' || userRole === 'DATA_ENTRY') && (
            <>
              <li className="nav-menu-heading">Data Management</li>
              <li><NavLink to="/bulk-input" onClick={handleMobileLinkClick}><Icon>📥</Icon><span>Bulk Input</span></NavLink></li>
              <li><NavLink to="/dry-process" onClick={handleMobileLinkClick}><Icon>🌵</Icon><span>Dry Process</span></NavLink></li>
              <li><NavLink to="/washing" onClick={handleMobileLinkClick}><Icon>💧</Icon><span>Washing</span></NavLink></li>
              <li><NavLink to="/sub-contracts" onClick={handleMobileLinkClick}><Icon>👥</Icon><span>Sub Contracts</span></NavLink></li>
              <li><NavLink to="/gate-pass" onClick={handleMobileLinkClick}><Icon>🚚</Icon><span>Gate Pass</span></NavLink></li>
            </>
          )}

          {(userRole === 'ADMIN' || userRole === 'DATA_ENTRY') && (
             <li><NavLink to="/reports" onClick={handleMobileLinkClick}><Icon>📊</Icon><span>Reports</span></NavLink></li>
          )}

          {userRole === 'ADMIN' && (
            <>
              <li className="nav-menu-heading">Admin Approvals</li>
              <li><NavLink to="/admin/pending-bulk-inputs" onClick={handleMobileLinkClick}><Icon>⏳</Icon><span>Pending Bulk Inputs</span></NavLink></li>
              <li><NavLink to="/admin/pending-dry-process" onClick={handleMobileLinkClick}><Icon>⏳</Icon><span>Pending Dry Process</span></NavLink></li>
              <li><NavLink to="/admin/pending-washing" onClick={handleMobileLinkClick}><Icon>⏳</Icon><span>Pending Washing</span></NavLink></li>
              <li><NavLink to="/admin/pending-sub-contracts" onClick={handleMobileLinkClick}><Icon>⏳</Icon><span>Pending Sub Contracts</span></NavLink></li>
              <li><NavLink to="/admin/pending-gate-pass" onClick={handleMobileLinkClick}><Icon>⏳</Icon><span>Pending Gate Pass</span></NavLink></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;