import api from './api';

export const getMyAttendance = async (startDate, endDate) => {
    const response = await api.get('/attendance/my-attendance', {
        params: { start_date: startDate, end_date: endDate }
    });
    return response.data;
};


export const gettotalhoursforcalendar = async (startDate, endDate) => {
    const response = await api.get('/attendance/gettotalhoursforcalendar', {
        params: { start_date: startDate, end_date: endDate }
    });
    return response.data;
};




export const getFullEmployeeAttendance = async (startDate, endDate, employeeCode = null) => {
    const response = await api.get('/attendance/full-employee-attendance', {
        params: { 
            start_date: startDate, 
            end_date: endDate,
            employee_code: employeeCode
        }
    });
    return response.data;
};

export const getAllAttendance = async (startDate, endDate, employeeCode = null) => {
    const response = await api.get('/attendance/all', {
        params: { 
            start_date: startDate, 
            end_date: endDate,
            employee_code: employeeCode
        }
    });
    return response.data;
};

export const getAttendanceSummary = async (date) => {
    const response = await api.get('/attendance/summary', {
        params: { date }
    });
    return response.data;
};

export const updateAttendanceHours = async (employee_code, date, new_hours, reason) => {
    const response = await api.put('/attendance/edit', {
        employee_code,
        date,
        new_hours,
        reason
    });
    return response.data;
};

