import api from './api';

export const getAllRoles = async () => {
    const response = await api.get('/roles');
    return response.data;
};

export const getRolePermissions = async (id) => {
    const response = await api.get(`/roles/${id}/permissions`);
    return response.data;
};

export const getModulesAndPermissions = async () => {
    const response = await api.get('/roles/modules-permissions');
    return response.data;
};

export const createRole = async (roleData) => {
    const response = await api.post('/roles', roleData);
    return response.data;
};

export const updateRolePermissions = async (id, permissions) => {
    const response = await api.put(`/roles/${id}/permissions`, { permissions });
    return response.data;
};
