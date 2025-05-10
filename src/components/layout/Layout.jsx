// src/components/layout/Layout.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  // Check initial screen size only once for default state
  // Default state: Open on desktop (> 768px), Closed on mobile (<= 768px)
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth > 768);
  // We might still need isMobile if we have other logic dependent on it,
  // but for layout control, CSS media queries are handling it.
  // const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  // Optional: Adjust sidebar state based on resize if needed
  // useEffect(() => {
  //   const handleResize = () => {
  //     if (window.innerWidth <= 768) {
  //       setIsSidebarOpen(false); // Always close on mobile resize
  //     } else {
  //       // Decide if you want to force open on resize to desktop
  //       // setIsSidebarOpen(true);
  //     }
  //   };
  //   window.addEventListener('resize', handleResize);
  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);


  // Add/remove classes based on state
  // CSS handles the actual positioning/visibility based on these classes and media queries
  const sidebarContainerClass = `app-sidebar ${isSidebarOpen ? 'open' : 'closed'}`;
  // Add class to main content only if needed for desktop toggle (CSS handles mobile margin)
  const mainContentClass = `main-content ${!isSidebarOpen && window.innerWidth > 768 ? 'sidebar-closed-desktop' : ''}`;


  return (
    <div className="app-container">
      <div className={sidebarContainerClass}>
        {/* Pass toggle function and open state to Sidebar */}
        <Sidebar onToggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
      </div>

      {/* Using CSS classes for margin adjustment */}
      <main className={mainContentClass}>
        <Navbar onToggleSidebar={toggleSidebar} />
        <div className="page-content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;