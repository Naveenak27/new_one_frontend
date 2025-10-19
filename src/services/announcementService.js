import api from './api';

export const getAllEmployees = async () => {
    const response = await api.get('/employees');
    return response.data;
};

export const sendBulkAnnouncement = async (subject, content, recipients, priority) => {
    const response = await api.post('/announcements/send-bulk', {
        subject,
        content,
        recipients,
        priority
    });
    return response.data;
};
