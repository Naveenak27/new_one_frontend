import api from './api';

export const login = async (email, password) => {
    try {
        console.log('Calling login API...');
        const response = await api.post('/auth/login', { email, password });
        console.log('Login API response:', response.data);
        
        if (response.data.success) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('permissions', JSON.stringify(response.data.permissions || []));
        }
        
        return response.data;
    } catch (error) {
        console.error('Login service error:', error);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('permissions');
};

export const getProfile = async () => {
    const response = await api.get('/auth/profile');
    return response.data;
};

export const getCurrentUser = () => {
    try {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        return null;
    }
};

export const getUserPermissions = () => {
    try {
        const permStr = localStorage.getItem('permissions');
        return permStr ? JSON.parse(permStr) : [];
    } catch (error) {
        console.error('Error parsing permissions from localStorage:', error);
        return [];
    }
};

export const hasPermission = (moduleName, permissionName) => {
    const user = getCurrentUser();
    if (user?.role_name === 'superadmin') return true;
    
    const permissions = getUserPermissions();
    return permissions.some(
        p => p.module_name === moduleName && p.permission_name === permissionName
    );
};
