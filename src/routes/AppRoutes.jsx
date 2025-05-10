// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout and Page Imports
import Layout from '../components/layout/Layout';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import BulkInputPage from '../pages/BulkInputPage';
import DryProcessPage from '../pages/DryProcessPage';
import WashingPage from '../pages/WashingPage';
import SubContractPage from '../pages/SubContractPage';
import GatePassPage from '../pages/GatePassPage';
import ReportsPage from '../pages/ReportsPage';
import NotFoundPage from '../pages/NotFoundPage';

// Admin Page Imports
import PendingBulkInputsPage from '../pages/admin/PendingBulkInputsPage';
import PendingDryProcessPage from '../pages/admin/PendingDryProcessPage';
import PendingWashingPage from '../pages/admin/PendingWashingPage'; // <<<--- අලුතින් import කළා
import PendingSubContractsPage from '../pages/admin/PendingSubContractsPage';
import PendingGatePassPage from '../pages/admin/PendingGatePassPage';

// Mobile Data Entry Page Imports
import MobileEntryLayout from '../components/layout/MobileEntryLayout';
import MobileEntryDashboard from '../pages/entry/MobileEntryDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false, dataEntryAllowed = false }) => {
  const token = localStorage.getItem('authToken');
  const authUserString = localStorage.getItem('authUser');
  let user = null;

  if (authUserString) {
    try {
      user = JSON.parse(authUserString);
    } catch (e) {
      console.error("ProtectedRoute: Error parsing authUser from localStorage", e);
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      return <Navigate to="/login" replace />;
    }
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'ADMIN') {
    console.warn('Access Denied: Admin role required for this route.');
    return <Navigate to="/" replace />;
  }

  if (dataEntryAllowed && !(user.role === 'ADMIN' || user.role === 'DATA_ENTRY')) {
    console.warn('Access Denied: Data Entry or Admin role required for this route.');
    return <Navigate to="/" replace />;
  }

  return children;
};


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute dataEntryAllowed={true}>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="bulk-input" element={<BulkInputPage />} />
        <Route path="dry-process" element={<DryProcessPage />} />
        <Route path="washing" element={<WashingPage />} />
        <Route path="sub-contracts" element={<SubContractPage />} />
        <Route path="gate-pass" element={<GatePassPage />} />
        <Route path="reports" element={<ReportsPage />} />

        <Route path="admin/pending-bulk-inputs" element={ <ProtectedRoute adminOnly={true}><PendingBulkInputsPage /></ProtectedRoute> } />
        <Route path="admin/pending-dry-process" element={ <ProtectedRoute adminOnly={true}><PendingDryProcessPage /></ProtectedRoute> } />
        <Route path="admin/pending-washing" element={ <ProtectedRoute adminOnly={true}><PendingWashingPage /></ProtectedRoute> } /> {/* <<<--- අලුත් Route එක */}
        <Route path="admin/pending-sub-contracts" element={ <ProtectedRoute adminOnly={true}><PendingSubContractsPage /></ProtectedRoute> } />
        <Route path="admin/pending-gate-pass" element={ <ProtectedRoute adminOnly={true}><PendingGatePassPage /></ProtectedRoute> } />
      </Route>

      <Route
        path="/mobile-entry"
        element={
          <ProtectedRoute dataEntryAllowed={true}>
            <MobileEntryDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
