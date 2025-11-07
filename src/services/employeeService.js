import api from './api';

export const getAllEmployees = async () => {
    const response = await api.get('/employees');
    return response.data;
};

export const getReportingManagers = async () => {
    const response = await api.get('/employees/reporting-managers');
    return response.data;
};

export const updateReportingManager = async (reporting_manager_id) => {
    const response = await api.put('/employees/update-reporting-manager', { 
        reporting_manager_id 
    });
    return response.data;
};

export const getEmployeeById = async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
};
// Add this function to your employeeService.js
export const updatePassword = async (passwordData) => {
    const response = await api.put('/auth/update-password', passwordData);
    return response.data;
};


export const createEmployee = async (employeeData) => {
    const response = await api.post('/employees', employeeData);
    return response.data;
};

export const updateEmployee = async (id, employeeData) => {
    const response = await api.put(`/employees/${id}`, employeeData);
    return response.data;
};

export const deleteEmployee = async (id) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
};
