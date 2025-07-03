import React, { useEffect, useState } from 'react';
import MetricsCard from '../components/Dashboard/MetricsCard';
import SalesAnalyticsChart from '../components/Dashboard/SalesAnalyticsChart';
import RecentActivitySection from '../components/Dashboard/RecentActivitySection';
import BreadcrumbNav from '../components/BreadcrumbNav';
import unassignedIcon from '../assests/images/unassigned.jpg';
import assignedIcon from '../assests/images/assignedweek.jpg';
import salespeopleIcon from '../assests/images/activesales.jpg';
import conversionIcon from '../assests/images/conversionrate.jpg';
import '../styles/DashboardPage.css';

const API_URL = process.env.REACT_APP_API_BASE_URL;

const DashboardPage = () => {
  const [metrics, setMetrics] = useState({
    unassignedLeads: 0,
    assignedThisWeek: 0,
    activeSalespeople: 0,
    conversionRate: 0,
  });

  const [analyticsData, setAnalyticsData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [employees, setEmployees] = useState([]);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', isActive: true },
  ];

  // Fetch functions
  const fetchMetrics = async () => {
    const res = await fetch(`${API_URL}/dashboard/metrics`);
    const data = await res.json();
    setMetrics(data);
  };

  const fetchAnalytics = async () => {
    const res = await fetch(`${API_URL}/dashboard/sales`);
    const data = await res.json();
    setAnalyticsData(data);
  };

  const fetchActivities = async () => {
    const res = await fetch(`${API_URL}/activities?limit=10`);
    const data = await res.json();
    setRecentActivity(data);
  };

  const fetchEmployees = async () => {
    const res = await fetch(`${API_URL}/employees/with-stats`);
    const data = await res.json();
    setEmployees(data.employees);
  };

  useEffect(() => {
    fetchMetrics();
    fetchAnalytics();
    fetchActivities();
    fetchEmployees();

    const interval = setInterval(() => {
      fetchEmployees();
    }, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const EmployeeSummary = ({ employees }) => {
    return (
      <div className="employee-summary">
        <div className="employee-table-container">
          <table className="employee-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Employee ID</th>
                <th>Assigned Leads</th>
                <th>Closed Leads</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-data">No employee data</td>
                </tr>
              ) : (
                employees.map((emp, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="emp-info">
                        <div className="avatar">
                          {emp.firstName?.charAt(0)}{emp.lastName?.charAt(0)}
                        </div>
                        <div>
                          <div className="name">{emp.firstName} {emp.lastName}</div>
                          <div className="email">{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>#{emp.employeeId}</td>
                    <td>{emp.assignedLeadsCount}</td>
                    <td>{emp.closedLeadsCount}</td>
                    <td>
                      <span
                        className={`status ${emp.isOnline ? 'active' : 'inactive'}`}>
                        ● {emp.isOnline ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-content">
      <BreadcrumbNav items={breadcrumbItems} />

      <div className="metrics-grid">
        <MetricsCard title="Unassigned Leads" value={metrics.unassignedLeads} icon={unassignedIcon} />
        <MetricsCard title="Assigned This Week" value={metrics.assignedThisWeek} icon={assignedIcon} />
        <MetricsCard title="Active Salespeople" value={metrics.activeSalespeople} icon={salespeopleIcon} />
        <MetricsCard title="Conversion Rate" value={`${metrics.conversionRate}%`} icon={conversionIcon} />
      </div>

      <div className="dashboard-middle">
        <div className="sales-chart-section">
          <SalesAnalyticsChart data={analyticsData} />
        </div>
        <div className="recent-activity-section">
          <RecentActivitySection activity={recentActivity} />
        </div>
      </div>

      <EmployeeSummary employees={employees} />
    </div>
  );
};

export default DashboardPage;
