import axios from 'axios';

// Use the base URL from environment variables
const API_URL = process.env.REACT_APP_API_BASE_URL;

// Fetch all leads
export const fetchLeads = async () => {
  try {
    const response = await axios.get(`${API_URL}/leads`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Upload leads CSV
export const uploadLeadsCsv = async (formData, onUploadProgress) => {
  try {
    const response = await axios.post(`${API_URL}/leads/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Bulk assign leads
export const bulkAssignLeads = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/leads/bulk-assign`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch employees
export const fetchEmployees = async () => {
  try {
    const response = await axios.get(`${API_URL}/employees`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update lead
export const updateLead = async (id, leadData) => {
  try {
    const response = await axios.put(`${API_URL}/leads/${id}`, leadData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete lead
export const deleteLead = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/leads/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Employee-related functions
export const createEmployee = async (employeeData) => {
  try {
    const response = await axios.post(`${API_URL}/employees`, employeeData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteEmployee = async (employeeId) => {
  try {
    const response = await axios.delete(`${API_URL}/employees/${employeeId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateEmployee = async (employeeId, employeeData) => {
  try {
    const response = await axios.put(`${API_URL}/employees/${employeeId}`, employeeData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
