import React, { useEffect, useState } from 'react';
import '../../styles/EmployeeSummaryTable.css';

const API_URL = process.env.REACT_APP_API_BASE_URL;

const EmployeeSummaryTable = () => {
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${API_URL}/employees/summary/all`);
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="employee-summary">
      <h3>Employee Summary</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Employee ID</th>
            <th>Assigned Leads</th>
            <th>Closed Leads</th>
            <th>Conversion Rate</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 ? (
            <tr><td colSpan="6">No employees found</td></tr>
          ) : (
            employees.map(emp => (
              <tr key={emp.id}>
                <td>{emp.firstName} {emp.lastName}</td>
                <td>{emp.employeeId}</td>
                <td>{emp.assignedLeads}</td>
                <td>{emp.closedLeads}</td>
                <td>{emp.conversionRate}</td>
                <td>{emp.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeSummaryTable;
