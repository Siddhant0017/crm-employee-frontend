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
  const hasInitialized = useRef(false);

  useEffect(() => {
    const storedEmployee = JSON.parse(localStorage.getItem('employee'));
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!storedEmployee?._id || !isLoggedIn) return;

    const employeeId = storedEmployee._id;

    // Only fire tabOpen once when component mounts
    if (!hasInitialized.current) {
      tabOpen(employeeId);
      hasInitialized.current = true;
    }

    // Heartbeat every 60s
    const sendHeartbeat = () => {
      fetch(`${API_BASE}/api/attendance/heartbeat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId }),
      });
    };

    sendHeartbeat(); // initial
    const heartbeatInterval = setInterval(sendHeartbeat, 60000);

    // Close tab handler (sendBeacon)
    const handleClose = () => {
      tabClose(employeeId);
    };

    // Visibility change (to track switching away or back)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        tabClose(employeeId);
      } else if (document.visibilityState === 'visible') {
        tabOpen(employeeId);
      }
    };

    // Event listeners
    window.addEventListener('beforeunload', handleClose);
    window.addEventListener('pagehide', handleClose);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      clearInterval(heartbeatInterval);
      handleClose();
      window.removeEventListener('beforeunload', handleClose);
      window.removeEventListener('pagehide', handleClose);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const employee = JSON.parse(localStorage.getItem('employee'));
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            isLoggedIn && employee ? (
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
            isLoggedIn && employee ? (
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
            isLoggedIn && employee ? (
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
            isLoggedIn && employee ? (
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
