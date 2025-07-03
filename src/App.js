import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import MyLeads from './pages/MyLeads';
import Schedule from './pages/Schedule';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import { tabOpen, tabClose } from './utils/attendanceApi';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

function App() {
  const employee = JSON.parse(localStorage.getItem('employee'));
  const employeeId = employee?._id;

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!employeeId) return;

    if (!hasInitialized.current) {
      tabOpen(employeeId);
      hasInitialized.current = true;
    }

    const sendHeartbeat = () => {
      fetch(`${API_BASE}/attendance/heartbeat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId }),
      });
    };

    sendHeartbeat();

    const heartbeatInterval = setInterval(() => {
      sendHeartbeat();
    }, 60000); // every 60 seconds

    const handleClose = () => {
      tabClose(employeeId);
    };

    window.addEventListener('beforeunload', handleClose);
    window.addEventListener('pagehide', handleClose);

    return () => {
      clearInterval(heartbeatInterval);
      handleClose();
      window.removeEventListener('beforeunload', handleClose);
      window.removeEventListener('pagehide', handleClose);
    };
  }, [employeeId]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            employee ? (
              <Layout>
                <Dashboard />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/leads"
          element={
            employee ? (
              <Layout>
                <MyLeads />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/schedule"
          element={
            employee ? (
              <Layout>
                <Schedule />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/profile"
          element={
            employee ? (
              <Layout>
                <Profile />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
