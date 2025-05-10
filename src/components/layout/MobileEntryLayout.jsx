// src/components/layout/MobileEntryLayout.jsx
import React from 'react'; // Removed useState
import { Outlet, useNavigate, Link } from 'react-router-dom';
import './MobileEntryLayout.css';

// MobileEntryHeader එක එහෙමම තියෙන්න පුළුවන්, හැබැයි onToggleMenu එක Dashboard එකෙන් එන්න ඕන
// නැත්නම්, Header එකත් Dashboard එක ඇතුළට ගන්න වෙනවා.
// දැනට Header එක මෙහෙම තියමු, toggle logic එක Dashboard එකට දාමු.

const MobileEntryHeader = ({ onToggleMenu }) => { // onToggleMenu is now passed from MobileEntryDashboard
  const navigate = useNavigate();
  const storedUser = localStorage.getItem('authUser');
  let username = 'Operator';
  if (storedUser) { /* ... */ username = JSON.parse(storedUser).username || 'Operator'; }
  const handleLogout = () => { /* ... */ navigate('/login'); };

  return (
    <header className="mobile-entry-header">
      <div className="mobile-header-left">
        <button onClick={onToggleMenu} className="mobile-hamburger-btn">☰</button>
        <Link to="/mobile-entry" className="mobile-header-brand">DenimPro Entry</Link>
      </div>
      <div className="mobile-header-user">
        <span className="mobile-user-greeting">Hi, {username}</span>
        <button onClick={handleLogout} className="mobile-logout-button">Logout</button>
      </div>
    </header>
  );
};


const MobileEntryLayout = ({ children }) => { // children prop එකක් ගන්නවා
  return (
    <div className="mobile-entry-app-container">
      {/* Header එකට toggle function එක දැන් children (MobileEntryDashboard) එකෙන් එන්න ඕන.
          මේක ටිකක් සංකීර්ණයි props drilling නිසා.
          වඩා හොඳයි Header එකත් MobileEntryDashboard එක ඇතුළට ගන්න එක.
          නැත්නම් Context API.
          දැනට, අපි MobileEntryDashboard එකට Header එකත් දාමු.
      */}
      {/* <MobileEntryHeader onToggleMenu={toggleMenu} /> */}
      <main className="mobile-entry-content-area">
        {children ? children : <Outlet />}
      </main>
    </div>
  );
};

export default MobileEntryLayout;
