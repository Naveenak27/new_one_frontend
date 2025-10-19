import api from './api';

export const applyLeave = async (leaveData) => {
    const response = await api.post('/leaves/apply', leaveData);
    return response.data;
};

export const getMyLeaves = async () => {
    const response = await api.get('/leaves/my-leaves');
    return response.data;
};

export const getLeaveBalance = async () => {
    const response = await api.get('/leaves/balance');
    return response.data;
};

export const getPendingLeaves = async () => {
    const response = await api.get('/leaves/pending');
    return response.data;
};

export const getAllLeaves = async () => {
    const response = await api.get('/leaves/all-leaves');
    return response.data;
};

export const cancelLeave = (leaveId) => api.put(`/leaves/cancel/${leaveId}`);

export const approveLeave = async (id, comments) => {
    const response = await api.put(`/leaves/${id}/approve`, { comments });
    return response.data;
};

export const rejectLeave = async (id, rejection_reason) => {
    const response = await api.put(`/leaves/${id}/reject`, { rejection_reason });
    return response.data;
};

export const getLeaveTypes = async () => {
    const response = await api.get('/leave-types');
    return response.data;
};
