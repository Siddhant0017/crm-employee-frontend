import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import EmployeeFormModal from '../components/Modals/EmployeeFormModal';
import BreadcrumbNav from '../components/BreadcrumbNav';
import '../styles/EmployeesPage.css';
import editIcon from '../assests/images/edit-icon.png';
import deleteIcon from '../assests/images/delete-icon.png';

const API_URL = process.env.REACT_APP_API_BASE_URL;

const EmployeesPage = () => {
  const [searchQuery] = useOutletContext();
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'firstName', direction: 'asc' });
  const [showActions, setShowActions] = useState(null);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 8,
    totalItems: 0,
    totalPages: 1,
  });

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Employees', isActive: true },
  ];

  useEffect(() => {
    fetchEmployees();
  }, [pagination.currentPage, sortConfig, searchQuery]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        sortBy: sortConfig.key,
        sortDirection: sortConfig.direction,
        search: searchQuery,
      });

      const response = await fetch(`${API_URL}/employees/with-stats?${queryParams}`);
      const data = await response.json();

      setEmployees(data.employees || []);
      setPagination((prev) => ({
        ...prev,
        totalItems: data.totalCount || 0,
        totalPages: Math.ceil((data.totalCount || 0) / prev.itemsPerPage),
      }));
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleAddEmployee = async (formData) => {
    try {
      const response = await fetch(`${API_URL}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        fetchEmployees();
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const handleEditEmployee = async (formData) => {
    try {
      const { language, location, ...editableData } = formData;
      const response = await fetch(`${API_URL}/employees/${editEmployee._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editableData),
      });
      if (response.ok) {
        fetchEmployees();
        setShowModal(false);
        setEditEmployee(null);
      }
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      const response = await fetch(`${API_URL}/employees/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchEmployees();
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: pageNumber,
    }));
  };

  const getPageNumbers = () => {
    const { currentPage, totalPages } = pagination;
    const pageNumbers = [];

    pageNumbers.push(1);
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    if (startPage > 2) pageNumbers.push('...');
    for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
    if (endPage < totalPages - 1) pageNumbers.push('...');
    if (totalPages > 1) pageNumbers.push(totalPages);

    return pageNumbers;
  };

  return (
    <div className="employees-page">
      <div className="page-header">
        <BreadcrumbNav items={breadcrumbItems} />
        <button className="add-employee-btn" onClick={() => setShowModal(true)}>
          Add Employee
        </button>
      </div>

      <div className="employees-table">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : employees.length > 0 ? (
          <table className="employee-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('firstName')}>Name</th>
                <th onClick={() => handleSort('employeeId')}>Employee ID</th>
                <th onClick={() => handleSort('assignedLeadsCount')}>Assigned Leads</th>
                <th onClick={() => handleSort('closedLeadsCount')}>Closed Leads</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id}>
                  <td>
                    <div className="emp-info">
                      <div className="avatar">
                        {emp.firstName?.charAt(0)}
                        {emp.lastName?.charAt(0)}
                      </div>
                      <div>
                        <div className="name">
                          {emp.firstName} {emp.lastName}
                        </div>
                        <div className="email">{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{emp.employeeId}</td>
                  <td>{emp.assignedLeadsCount || 0}</td>
                  <td>{emp.closedLeadsCount || 0}</td>
                  <td>
                    <span
                      className={`status ${emp.isOnline ? 'active' : 'inactive'}`}
                    >
                      ● {emp.isOnline ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="actions-btn"
                      onClick={() =>
                        setShowActions((prev) => (prev === emp._id ? null : emp._id))
                      }
                    >
                      ⋮
                    </button>
                    {showActions === emp._id && (
                      <div className="actions-dropdown">
                        <button
                          onClick={() => {
                            setEditEmployee(emp);
                            setShowModal(true);
                            setShowActions(null);
                          }}
                          className="action-item"
                        >
                          <img src={editIcon} alt="Edit" className="action-icon" />
                          Edit
                        </button>

                        <button
                          onClick={() => {
                            handleDeleteEmployee(emp._id);
                            setShowActions(null);
                          }}
                          className="action-item"
                        >
                          <img src={deleteIcon} alt="Delete" className="action-icon" />
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-data">No employees found</div>
        )}
      </div>

      <div className="pagination-container">
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
          className="pagination-button"
        >
          Previous
        </button>

        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() =>
              typeof page === 'number' ? handlePageChange(page) : null
            }
            className={`pagination-button ${
              pagination.currentPage === page ? 'active' : ''
            } ${typeof page !== 'number' ? 'ellipsis' : ''}`}
            disabled={typeof page !== 'number'}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
          className="pagination-button"
        >
          Next
        </button>
      </div>

      {showModal && (
        <EmployeeFormModal
          employee={editEmployee}
          isEdit={!!editEmployee}
          onClose={() => {
            setShowModal(false);
            setEditEmployee(null);
          }}
          onSubmit={editEmployee ? handleEditEmployee : handleAddEmployee}
          disableFields={editEmployee ? ['language', 'location'] : []}
        />
      )}
    </div>
  );
};

export default EmployeesPage;
