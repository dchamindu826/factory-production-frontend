// src/pages/entry/MobileEntryDashboard.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// This path assumes MobileEntrySideMenu.jsx is in src/components/layout/
import MobileEntrySideMenu from '../../components/layout/MobileEntrySideMenu';
import './MobileEntryDashboard.css';
import '../../components/layout/MobileEntryLayout.css'; // Assuming this CSS is for the header part

// Import form components
import MobileBulkInputForm from './MobileBulkInputForm';
import MobileDryProcessForm from './MobileDryProcessForm';
import MobileWashingForm from './MobileWashingForm';
import MobileSubContractForm from './MobileSubContractForm';
import MobileGatePassForm from './MobileGatePassForm';

// Header component (moved inside or kept in MobileEntryLayout and passed toggle via context/props)
const MobileEntryHeader = ({ onToggleMenu, isMenuOpen }) => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem('authUser');
  let username = 'Operator';
  if (storedUser) {
    try {
      username = JSON.parse(storedUser).username || 'Operator';
    } catch (e) {
      console.error("Error parsing authUser for mobile header", e);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    navigate('/login');
  };

  return (
    <header className="mobile-entry-header">
      <div className="mobile-header-left">
        <button onClick={onToggleMenu} className="mobile-hamburger-btn">
          {isMenuOpen ? '✖' : '☰'}
        </button>
        <Link to="/mobile-entry" className="mobile-header-brand">
          DenimPro Entry
        </Link>
      </div>
      <div className="mobile-header-user">
        <span className="mobile-user-greeting">Hi, {username}</span>
        <button onClick={handleLogout} className="mobile-logout-button">
          Logout
        </button>
      </div>
    </header>
  );
};

const MobileEntryDashboard = () => {
  const [activeFormKey, setActiveFormKey] = useState('BULK_INPUT');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemSelect = (formKey) => {
    setActiveFormKey(formKey);
    setIsMenuOpen(false); // Close menu after selection
  };

  const renderActiveForm = () => {
    switch (activeFormKey) {
      case 'BULK_INPUT':
        return <MobileBulkInputForm />;
      case 'DRY_PROCESS':
        return <MobileDryProcessForm />;
      case 'WASHING':
        return <MobileWashingForm />;
      case 'SUB_CONTRACTS':
        return <MobileSubContractForm />;
      case 'GATE_PASS':
        return <MobileGatePassForm />;
      default:
        return <MobileBulkInputForm />; // Default to Bulk Input or a welcome message
    }
  };

  return (
    <div className="mobile-entry-app-container"> {/* This class is from MobileEntryLayout.css */}
      <MobileEntryHeader onToggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />
      <MobileEntrySideMenu
        isOpen={isMenuOpen}
        onCloseMenu={toggleMenu}
        onSelectItem={handleMenuItemSelect}
        activeItem={activeFormKey}
      />
      <main className={`mobile-entry-content-area ${isMenuOpen ? 'menu-open' : ''}`}>
        {renderActiveForm()}
      </main>
    </div>
  );
};

export default MobileEntryDashboard;
