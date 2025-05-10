// src/components/layout/MobileEntrySideMenu.jsx
import React from 'react';
import './MobileEntrySideMenu.css'; // Make sure this CSS file exists and is imported

// Helper component for icons
const Icon = ({ children }) => <span className="mobile-menu-icon">{children}</span>;

const MobileEntrySideMenu = ({ isOpen, onSelectItem, onCloseMenu, activeItem }) => {
  // Menu items definition
  const menuItems = [
    { key: 'BULK_INPUT', label: 'Bulk Input', icon: '📥' },
    { key: 'DRY_PROCESS', label: 'Dry Process', icon: '🌵' },
    { key: 'WASHING', label: 'Washing', icon: '💧' },
    { key: 'SUB_CONTRACTS', label: 'Sub Contracts', icon: '👥' },
    { key: 'GATE_PASS', label: 'Gate Pass', icon: '🚚' },
  ];

  return (
    <>
      {/* Overlay to close menu when clicking outside */}
      {/* This div is only rendered when isOpen is true */}
      {isOpen && <div className="mobile-menu-overlay" onClick={onCloseMenu}></div>}

      {/* The 'open' class controls visibility and animation via CSS */}
      <aside className={`mobile-entry-side-menu ${isOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <span>Select Task</span>
          <button onClick={onCloseMenu} className="mobile-menu-close-btn">✖</button>
        </div>
        <nav>
          <ul>
            {menuItems.map(item => (
              <li key={item.key}>
                <button
                  className={`mobile-menu-item ${activeItem === item.key ? 'active' : ''}`}
                  onClick={() => {
                    onSelectItem(item.key); // This will set the active form in MobileEntryDashboard
                    // onCloseMenu(); // Closing is now typically handled by onSelectItem in the parent
                  }}
                >
                  <Icon>{item.icon}</Icon>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default MobileEntrySideMenu;
