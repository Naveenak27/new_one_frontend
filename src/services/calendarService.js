// import api from './api';

// export const getCalendarEvents = async (month, year) => {
//     const response = await api.get(`/calendar/events?month=${month}&year=${year}`);
//     return response.data;
// };

// export const getHolidays = async (year) => {
//     const response = await api.get(`/holidays?year=${year}`);
//     return response.data;
// };

// export const createHoliday = async (holidayData) => {
//     const response = await api.post('/holidays', holidayData);
//     return response.data;
// };

// export const updateHoliday = async (id, holidayData) => {
//     const response = await api.put(`/holidays/${id}`, holidayData);
//     return response.data;
// };

// export const deleteHoliday = async (id) => {
//     const response = await api.delete(`/holidays/${id}`);
//     return response.data;
// };
// services/calendarService.js
import api from './api';

export const getCalendarEvents = async (month, year) => {
    const response = await api.get(`/calendar/events`, {
        params: { month, year }
    });
    return response.data;
};

export const getHolidays = async (year) => {
    const response = await api.get(`/holidays`, {
        params: { year }
    });
    return response.data;
};

export const createHoliday = async (holidayData) => {
    const response = await api.post('/holidays', holidayData);
    return response.data;
};

export const updateHoliday = async (id, holidayData) => {
    const response = await api.put(`/holidays/${id}`, holidayData);
    return response.data;
};

export const deleteHoliday = async (id) => {
    const response = await api.delete(`/holidays/${id}`);
    return response.data;
};




