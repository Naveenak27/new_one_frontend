// import React, { useState, useEffect } from 'react';
// import { Card, Table, DatePicker, Button, Space, Statistic, Row, Col, Select, message, Tag, Typography, Modal } from 'antd';
// import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, UserOutlined, LoginOutlined, LogoutOutlined, DownloadOutlined, CalendarOutlined, SyncOutlined } from '@ant-design/icons';
// import { getMyAttendance, getAllAttendance, getAttendanceSummary } from '../services/attendanceService';
// import { getAllEmployees } from '../services/employeeService';
// import { useAuth } from '../context/AuthContext';
// import moment from 'moment';
// import api from '../services/api';


// const { RangePicker } = DatePicker;
// const { Text } = Typography;


// const AttendancePage = () => {
//     const { user } = useAuth();
//     const [attendance, setAttendance] = useState([]);
//     const [summary, setSummary] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [syncing, setSyncing] = useState(false);
//     const [dateRange, setDateRange] = useState([moment().startOf('month'), moment().endOf('month')]);
//     const [selectedEmployee, setSelectedEmployee] = useState(null);
//     const [employees, setEmployees] = useState([]);
//     const [employeeStats, setEmployeeStats] = useState({
//         daily: 0,
//         weekly: 0,
//         monthly: 0
//     });


//     const isHR = ['hr', 'manager', 'superadmin'].includes(user?.role_name);


//     // Helper function to convert decimal hours to HH:MM format
//     const convertDecimalToTime = (decimalHours) => {
//         if (!decimalHours || isNaN(decimalHours)) return null;
        
//         const hours = Math.floor(decimalHours);
//         const minutes = Math.round((decimalHours - hours) * 60);
        
//         return `${hours}:${minutes.toString().padStart(2, '0')}`;
//     };


//     // Calculate employee statistics
//     const calculateEmployeeStats = (attendanceData) => {
//         if (!attendanceData || attendanceData.length === 0) {
//             setEmployeeStats({ daily: 0, weekly: 0, monthly: 0 });
//             return;
//         }


//         const today = moment().startOf('day');
//         const startOfWeek = moment().startOf('week');
//         const startOfMonth = moment().startOf('month');


//         let dailyTotal = 0;
//         let weeklyTotal = 0;
//         let monthlyTotal = 0;


//         attendanceData.forEach(record => {
//             const recordDate = moment(record.date);
//             const hours = parseFloat(record.total_hours) || 0;


//             // Daily total (today)
//             if (recordDate.isSame(today, 'day')) {
//                 dailyTotal += hours;
//             }


//             // Weekly total (current week)
//             if (recordDate.isSameOrAfter(startOfWeek, 'day') && recordDate.isSameOrBefore(today, 'day')) {
//                 weeklyTotal += hours;
//             }


//             // Monthly total (current month)
//             if (recordDate.isSameOrAfter(startOfMonth, 'day') && recordDate.isSameOrBefore(today, 'day')) {
//                 monthlyTotal += hours;
//             }
//         });


//         setEmployeeStats({
//             daily: dailyTotal,
//             weekly: weeklyTotal,
//             monthly: monthlyTotal
//         });
//     };


//     useEffect(() => {
//         fetchAttendance();
//         if (isHR) {
//             fetchSummary();
//             fetchEmployees();
//         }
//     }, [dateRange, selectedEmployee]);


//     const fetchEmployees = async () => {
//         try {
//             const data = await getAllEmployees();
//             setEmployees(data.data);
//         } catch (error) {
//             console.error('Error fetching employees');
//         }
//     };


//     const fetchAttendance = async () => {
//         setLoading(true);
//         try {
//             const startDate = dateRange[0].format('YYYY-MM-DD');
//             const endDate = dateRange[1].format('YYYY-MM-DD');


//             let data;
//             if (isHR) {
//                 data = await getAllAttendance(startDate, endDate, selectedEmployee);
//             } else {
//                 data = await getMyAttendance(startDate, endDate);
//             }
            
//             setAttendance(data.data);


//             // Calculate stats for employees
//             if (!isHR) {
//                 calculateEmployeeStats(data.data);
//             }
//         } catch (error) {
//             message.error('Failed to fetch attendance');
//         } finally {
//             setLoading(false);
//         }
//     };


//     const fetchSummary = async () => {
//         try {
//             const data = await getAttendanceSummary(moment().format('YYYY-MM-DD'));
//             setSummary(data.data);
//         } catch (error) {
//             console.error('Error fetching summary');
//         }
//     };

//     // Handle sync button click
//     const handleSync = async () => {
//         Modal.confirm({
//             title: 'Sync Attendance Data',
//             content: 'This will sync new attendance records from the biometric database. Continue?',
//             okText: 'Yes, Sync',
//             cancelText: 'Cancel',
//             onOk: async () => {
//                 setSyncing(true);
//                 try {
//                     const response = await api.post('/attendance/sync');
                    
//                     if (response.data.success) {
//                         message.success(
//                             `Synced ${response.data.synced} records in ${response.data.duration_seconds}s`
//                         );
//                         fetchAttendance();
//                     }
//                 } catch (error) {
//                     message.error('Failed to sync attendance data');
//                     console.error('Sync error:', error);
//                 } finally {
//                     setSyncing(false);
//                 }
//             }
//         });
//     };


//     // Export to CSV function
//     const exportToCSV = () => {
//         if (!attendance || attendance.length === 0) {
//             message.warning('No data to export');
//             return;
//         }


//         try {
//             let headers;
//             let rows;


//             if (isHR) {
//                 headers = ['Employee Code', 'Employee Name', 'Date', 'Total Hours'];
                
//                 rows = attendance.map(record => [
//                     record.employee_code || '',
//                     record.employee_name || '',
//                     moment(record.date).format('DD MMM YYYY'),
//                     record.total_hours ? convertDecimalToTime(record.total_hours) : ''
//                 ]);
//             } else {
//                 headers = ['Date', 'Day', 'Total Hours'];
                
//                 rows = attendance.map(record => [
//                     moment(record.date).format('DD MMM YYYY'),
//                     moment(record.date).format('dddd'),
//                     record.total_hours ? convertDecimalToTime(record.total_hours) : ''
//                 ]);
//             }


//             const escapeCsvValue = (value) => {
//                 if (value === null || value === undefined) return '';
//                 const stringValue = String(value);
//                 if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
//                     return `"${stringValue.replace(/"/g, '""')}"`;
//                 }
//                 return stringValue;
//             };


//             const csvContent = [
//                 headers.map(escapeCsvValue).join(','),
//                 ...rows.map(row => row.map(escapeCsvValue).join(','))
//             ].join('\n');


//             const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//             const link = document.createElement('a');
//             const url = URL.createObjectURL(blob);
            
//             const fileName = `Attendance_${dateRange[0].format('YYYY-MM-DD')}_to_${dateRange[1].format('YYYY-MM-DD')}.csv`;
//             link.setAttribute('href', url);
//             link.setAttribute('download', fileName);
//             link.style.visibility = 'hidden';
            
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
            
//             message.success('CSV exported successfully');
//         } catch (error) {
//             console.error('Export error:', error);
//             message.error('Failed to export CSV');
//         }
//     };


//     // Expandable row to show detailed IN/OUT pairs
//     const expandedRowRender = (record) => {
//         if (!record.pairs || record.pairs.length === 0) {
//             return <Text type="secondary">No punch details available</Text>;
//         }


//         const pairColumns = [
//             {
//                 title: '#',
//                 key: 'index',
//                 width: 50,
//                 render: (_, __, index) => index + 1
//             },
//             {
//                 title: 'IN Time',
//                 dataIndex: 'in',
//                 key: 'in',
//                 render: (time) => time ? (
//                     <Space>
//                         <LoginOutlined style={{ color: '#52c41a' }} />
//                         <Text strong>{time}</Text>
//                     </Space>
//                 ) : <Text type="secondary">-</Text>
//             },
//             {
//                 title: 'OUT Time',
//                 dataIndex: 'out',
//                 key: 'out',
//                 render: (time) => time ? (
//                     <Space>
//                         <LogoutOutlined style={{ color: '#f5222d' }} />
//                         <Text strong>{time}</Text>
//                     </Space>
//                 ) : <Text type="secondary">-</Text>
//             },
//             {
//                 title: 'Duration',
//                 dataIndex: 'duration',
//                 key: 'duration',
//                 render: (duration) => {
//                     if (!duration) return <Text type="secondary">-</Text>;
//                     const hours = Math.floor(duration / 60);
//                     const minutes = Math.round(duration % 60);
//                     return (
//                         <Tag color="blue">
//                             {hours}h {minutes}m
//                         </Tag>
//                     );
//                 }
//             }
//         ];


//         return (
//             <Table
//                 columns={pairColumns}
//                 dataSource={record.pairs}
//                 pagination={false}
//                 size="small"
//                 rowKey={(item, index) => `${record.date}_${index}`}
//                 style={{ margin: '8px 0' }}
//             />
//         );
//     };


//     const columns = isHR ? [
//         {
//             title: 'Employee Code',
//             dataIndex: 'employee_code',
//             key: 'employee_code',
//             width: 120,
//             fixed: 'left'
//         },
//         {
//             title: 'Employee Name',
//             dataIndex: 'employee_name',
//             key: 'employee_name',
//             width: 180,
//             fixed: 'left'
//         },
//         {
//             title: 'Date',
//             dataIndex: 'date',
//             key: 'date',
//             width: 130,
//             render: (date) => moment(date).format('DD MMM YYYY')
//         },
//         {
//             title: 'First IN',
//             dataIndex: 'first_in',
//             key: 'first_in',
//             width: 100,
//             render: (time) => time ? (
//                 <Tag color="green" icon={<LoginOutlined />}>{time}</Tag>
//             ) : '-'
//         },
//         {
//             title: 'Last OUT',
//             dataIndex: 'last_out',
//             key: 'last_out',
//             width: 100,
//             render: (time) => time ? (
//                 <Tag color="red" icon={<LogoutOutlined />}>{time}</Tag>
//             ) : '-'
//         },
// {
//     title: 'Total Hours',
//     dataIndex: 'total_hours',
//     key: 'total_hours',
//     width: isHR ? 120 : 150,
//     render: (hours) => {
//         const timeStr = convertDecimalToTime(hours);
        
//         // Determine color based on hours value
//         let color = 'default';
//         if (hours < 7.5) {
//             color = 'red'; // Less than 7:30 hours
//         } else if (hours >= 7.5 && hours < 8) {
//             color = 'orange'; // Between 7:30 and 8 hours (warning)
//         } else if (hours >= 8) {
//             color = 'green'; // 8 hours or more
//         }
        
//         return timeStr ? (
//             <Tag 
//                 color={color} 
//                 style={{ fontSize: isHR ? 14 : 15, padding: isHR ? undefined : '4px 12px' }}
//             >
//                 <ClockCircleOutlined /> {timeStr}
//             </Tag>
//         ) : <Text type="secondary">-</Text>;
//     }
// }
//     ] : [
//         {
//             title: 'Date',
//             dataIndex: 'date',
//             key: 'date',
//             width: 150,
//             render: (date) => (
//                 <Space direction="vertical" size={0}>
//                     <Text strong>{moment(date).format('DD MMM YYYY')}</Text>
//                     <Text type="secondary" style={{ fontSize: 12 }}>
//                         {moment(date).format('dddd')}
//                     </Text>
//                 </Space>
//             )
//         },
//         {
//             title: 'First IN',
//             dataIndex: 'first_in',
//             key: 'first_in',
//             width: 120,
//             render: (time) => time ? (
//                 <Tag color="green" icon={<LoginOutlined />} style={{ fontSize: 13 }}>
//                     {time}
//                 </Tag>
//             ) : <Text type="secondary">-</Text>
//         },
//         {
//             title: 'Last OUT',
//             dataIndex: 'last_out',
//             key: 'last_out',
//             width: 120,
//             render: (time) => time ? (
//                 <Tag color="red" icon={<LogoutOutlined />} style={{ fontSize: 13 }}>
//                     {time}
//                 </Tag>
//             ) : <Text type="secondary">-</Text>
//         },
// {
//     title: 'Total Hours',
//     dataIndex: 'total_hours',
//     key: 'total_hours',
//     width: isHR ? 120 : 150,
//     render: (hours) => {
//         const timeStr = convertDecimalToTime(hours);
        
//         // Determine color based on hours value
//         let color = 'default';
//         if (hours < 7.5) {
//             color = 'red'; // Less than 7:30 hours
//         } else if (hours >= 7.5 && hours < 8) {
//             color = 'orange'; // Between 7:30 and 8 hours (warning)
//         } else if (hours >= 8) {
//             color = 'green'; // 8 hours or more
//         }
        
//         return timeStr ? (
//             <Tag 
//                 color={color} 
//                 style={{ fontSize: isHR ? 14 : 15, padding: isHR ? undefined : '4px 12px' }}
//             >
//                 <ClockCircleOutlined /> {timeStr}
//             </Tag>
//         ) : <Text type="secondary">-</Text>;
//     }
// }
//     ];


//     return (
//         <div>
//             <h1>Attendance</h1>


//             {isHR && summary && (
//                 <Row gutter={16} style={{ marginBottom: 24 }}>
//                     <Col xs={24} sm={12} md={6}>
//                         <Card>
//                             <Statistic
//                                 title="Total Employees"
//                                 value={summary.total_employees}
//                                 prefix={<UserOutlined />}
//                                 valueStyle={{ color: '#1890ff' }}
//                             />
//                         </Card>
//                     </Col>
//                     <Col xs={24} sm={12} md={6}>
//                         <Card>
//                             <Statistic
//                                 title="Present Today"
//                                 value={summary.present}
//                                 prefix={<CheckCircleOutlined />}
//                                 valueStyle={{ color: '#52c41a' }}
//                             />
//                         </Card>
//                     </Col>
//                     <Col xs={24} sm={12} md={6}>
//                         <Card>
//                             <Statistic
//                                 title="Absent Today"
//                                 value={summary.absent}
//                                 prefix={<CloseCircleOutlined />}
//                                 valueStyle={{ color: '#f5222d' }}
//                             />
//                         </Card>
//                     </Col>
//                     <Col xs={24} sm={12} md={6}>
//                         <Card>
//                             <Statistic
//                                 title="Late Arrivals"
//                                 value={summary.late}
//                                 prefix={<ClockCircleOutlined />}
//                                 valueStyle={{ color: '#fa8c16' }}
//                             />
//                         </Card>
//                     </Col>
//                 </Row>
//             )}


//             {!isHR && (
//                 <Row gutter={16} style={{ marginBottom: 24 }}>
//                     <Col xs={24} sm={8}>
//                         <Card>
//                             <Statistic
//                                 title="Today's Working Hours"
//                                 value={convertDecimalToTime(employeeStats.daily) || '0:00'}
//                                 prefix={<ClockCircleOutlined />}
//                                 valueStyle={{ color: '#1890ff', fontSize: 24 }}
//                             />
//                         </Card>
//                     </Col>
//                     <Col xs={24} sm={8}>
//                         <Card>
//                             <Statistic
//                                 title="This Week's Total"
//                                 value={convertDecimalToTime(employeeStats.weekly) || '0:00'}
//                                 prefix={<CalendarOutlined />}
//                                 valueStyle={{ color: '#52c41a', fontSize: 24 }}
//                             />
//                         </Card>
//                     </Col>
//                     <Col xs={24} sm={8}>
//                         <Card>
//                             <Statistic
//                                 title="This Month's Total"
//                                 value={convertDecimalToTime(employeeStats.monthly) || '0:00'}
//                                 prefix={<CalendarOutlined />}
//                                 valueStyle={{ color: '#722ed1', fontSize: 24 }}
//                             />
//                         </Card>
//                     </Col>
//                 </Row>
//             )}


//             <Card>
//                 <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
//                     <Space wrap>
//                         <RangePicker
//                             value={dateRange}
//                             onChange={setDateRange}
//                             format="DD-MM-YYYY"
//                         />
//                         {isHR && (
//                             <Select
//                                 placeholder="Filter by employee"
//                                 style={{ width: 200 }}
//                                 allowClear
//                                 value={selectedEmployee}
//                                 onChange={setSelectedEmployee}
//                                 showSearch
//                                 filterOption={(input, option) =>
//                                     option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
//                                 }
//                             >
//                                 {employees.map(emp => (
//                                     <Select.Option key={emp.employee_id} value={emp.employee_id}>
//                                         {emp.name}
//                                     </Select.Option>
//                                 ))}
//                             </Select>
//                         )}
//                     </Space>
//                     <Space>
//                         {isHR && (
//                             <Button
//                                 type="primary"
//                                 onClick={handleSync}
//                                 icon={<SyncOutlined spin={syncing} />}
//                                 loading={syncing}
//                                 style={{ backgroundColor: '#73d13d', borderColor: '#73d13d' }}
//                             >
//                                 Sync Data
//                             </Button>
//                         )}
//                         <Button 
//                             type="default" 
//                             onClick={exportToCSV} 
//                             icon={<DownloadOutlined />}
//                             disabled={!attendance || attendance.length === 0}
//                         >
//                             Export CSV
//                         </Button>
//                         <Button type="primary" onClick={fetchAttendance} icon={<ClockCircleOutlined />}>
//                             Refresh
//                         </Button>
//                     </Space>
//                 </Space>


//                 <Table
//                     dataSource={attendance}
//                     columns={columns}
//                     loading={loading}
//                     rowKey={(record) => `${record.employee_code}_${record.date}`}
//                     scroll={{ x: 1000 }}
//                     expandable={{
//                         expandedRowRender,
//                         expandRowByClick: true,
//                         rowExpandable: (record) => record.pairs && record.pairs.length > 0
//                     }}
//                     pagination={{
//                         pageSize: 20,
//                         showSizeChanger: true,
//                         showTotal: (total) => `Total ${total} records`
//                     }}
//                 />
//             </Card>
//         </div>
//     );
// };


// export default AttendancePage;





import React, { useState, useEffect } from 'react';
import { Card, Table, DatePicker, Button, Space, Statistic, Row, Col, Select, message, Tag, Typography, Modal, Form, InputNumber, Input } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, UserOutlined, DownloadOutlined, CalendarOutlined, SyncOutlined, EditOutlined } from '@ant-design/icons';
import { getMyAttendance, getAllAttendance, getAttendanceSummary, updateAttendanceHours } from '../services/attendanceService';
import { getAllEmployees } from '../services/employeeService';
import { hasPermission } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import moment from 'moment';
import api from '../services/api';

const { RangePicker } = DatePicker;
const { Text } = Typography;
const { TextArea } = Input;

const AttendancePage = () => {
    const { user } = useAuth();
    const [attendance, setAttendance] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [dateRange, setDateRange] = useState([moment().startOf('month'), moment().endOf('month')]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [employeeStats, setEmployeeStats] = useState({
        daily: 0,
        weekly: 0,
        monthly: 0
    });

    // Edit modal state
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [editForm] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    // Permission checks
    const isHR = ['hr', 'manager', 'superadmin'].includes(user?.role_name);
    const canViewAttendance = hasPermission('attendance', 'view');
    const canEditAttendance = hasPermission('attendance', 'edit');

    // Helper function to convert decimal hours to HH:MM format
    const convertDecimalToTime = (decimalHours) => {
        if (!decimalHours || isNaN(decimalHours)) return null;
        
        const hours = Math.floor(decimalHours);
        const minutes = Math.round((decimalHours - hours) * 60);
        
        return `${hours}:${minutes.toString().padStart(2, '0')}`;
    };

    // Calculate employee statistics
    const calculateEmployeeStats = (attendanceData) => {
        if (!attendanceData || attendanceData.length === 0) {
            setEmployeeStats({ daily: 0, weekly: 0, monthly: 0 });
            return;
        }

        const today = moment().startOf('day');
        const startOfWeek = moment().startOf('week');
        const startOfMonth = moment().startOf('month');

        let dailyTotal = 0;
        let weeklyTotal = 0;
        let monthlyTotal = 0;

        attendanceData.forEach(record => {
            const recordDate = moment(record.date);
            const hours = parseFloat(record.total_hours) || 0;

            if (recordDate.isSame(today, 'day')) {
                dailyTotal += hours;
            }

            if (recordDate.isSameOrAfter(startOfWeek, 'day') && recordDate.isSameOrBefore(today, 'day')) {
                weeklyTotal += hours;
            }

            if (recordDate.isSameOrAfter(startOfMonth, 'day') && recordDate.isSameOrBefore(today, 'day')) {
                monthlyTotal += hours;
            }
        });

        setEmployeeStats({
            daily: dailyTotal,
            weekly: weeklyTotal,
            monthly: monthlyTotal
        });
    };

    useEffect(() => {
        if (canViewAttendance) {
            fetchAttendance();
        }
        if (isHR) {
            fetchSummary();
            fetchEmployees();
        }
    }, [dateRange, selectedEmployee]);

    const fetchEmployees = async () => {
        try {
            const data = await getAllEmployees();
            setEmployees(data.data);
        } catch (error) {
            console.error('Error fetching employees');
        }
    };

    const fetchAttendance = async () => {
        if (!canViewAttendance) {
            message.error('You do not have permission to view attendance');
            return;
        }

        setLoading(true);
        try {
            const startDate = dateRange[0].format('YYYY-MM-DD');
            const endDate = dateRange[1].format('YYYY-MM-DD');

            let data;
            if (isHR) {
                data = await getAllAttendance(startDate, endDate, selectedEmployee);
            } else {
                data = await getMyAttendance(startDate, endDate);
            }
            
            setAttendance(data.data);

            // Calculate stats for employees
            if (!isHR) {
                calculateEmployeeStats(data.data);
            }
        } catch (error) {
            message.error('Failed to fetch attendance');
        } finally {
            setLoading(false);
        }
    };

    const fetchSummary = async () => {
        try {
            const data = await getAttendanceSummary(moment().format('YYYY-MM-DD'));
            setSummary(data.data);
        } catch (error) {
            console.error('Error fetching summary');
        }
    };

    // Handle edit button click with permission check
    const handleEditClick = (record) => {
        if (!canEditAttendance) {
            message.error('You do not have permission to edit attendance');
            return;
        }
        
        setEditingRecord(record);
        editForm.setFieldsValue({
            new_hours: parseFloat(record.total_hours) || 0,
            reason: ''
        });
        setEditModalVisible(true);
    };

    // Handle edit form submission with permission check
    const handleEditSubmit = async () => {
        if (!canEditAttendance) {
            message.error('You do not have permission to edit attendance');
            return;
        }

        try {
            const values = await editForm.validateFields();
            setSubmitting(true);

            await updateAttendanceHours(
                editingRecord.employee_code,
                moment(editingRecord.date).format('YYYY-MM-DD'),
                values.new_hours,
                values.reason
            );

            message.success('Attendance hours updated successfully');
            setEditModalVisible(false);
            editForm.resetFields();
            fetchAttendance();
        } catch (error) {
            if (error.errorFields) {
                message.error('Please fill in all required fields');
            } else {
                message.error('Failed to update attendance hours');
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Handle sync button click
    const handleSync = async () => {
        Modal.confirm({
            title: 'Sync Attendance Data',
            content: 'This will sync new attendance records from the biometric database. Continue?',
            okText: 'Yes, Sync',
            cancelText: 'Cancel',
            onOk: async () => {
                setSyncing(true);
                try {
                    const response = await api.post('/attendance/sync');
                    
                    if (response.data.success) {
                        message.success(
                            `Synced ${response.data.synced} records in ${response.data.duration_seconds}s`
                        );
                        fetchAttendance();
                    }
                } catch (error) {
                    message.error('Failed to sync attendance data');
                    console.error('Sync error:', error);
                } finally {
                    setSyncing(false);
                }
            }
        });
    };

    // Export to CSV function
    const exportToCSV = () => {
        if (!attendance || attendance.length === 0) {
            message.warning('No data to export');
            return;
        }

        try {
            const headers = ['Employee Code', 'Date', 'Total Hours', 'Status'];
            
            const rows = attendance.map(record => [
                record.employee_code || '',
                moment(record.date).format('DD MMM YYYY'),
                record.total_hours ? convertDecimalToTime(record.total_hours) : '',
                record.is_edited ? 'Edited' : 'Original'
            ]);

            const escapeCsvValue = (value) => {
                if (value === null || value === undefined) return '';
                const stringValue = String(value);
                if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                    return `"${stringValue.replace(/"/g, '""')}"`;
                }
                return stringValue;
            };

            const csvContent = [
                headers.map(escapeCsvValue).join(','),
                ...rows.map(row => row.map(escapeCsvValue).join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            const fileName = `Attendance_${dateRange[0].format('YYYY-MM-DD')}_to_${dateRange[1].format('YYYY-MM-DD')}.csv`;
            link.setAttribute('href', url);
            link.setAttribute('download', fileName);
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            message.success('CSV exported successfully');
        } catch (error) {
            console.error('Export error:', error);
            message.error('Failed to export CSV');
        }
    };

    // Columns with permission-based Actions column
    const columns = [
        {
            title: 'Employee Code',
            dataIndex: 'employee_code',
            key: 'employee_code',
            width: 150,
            sorter: (a, b) => a.employee_code.localeCompare(b.employee_code),
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            width: 150,
            render: (date) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{moment(date).format('DD MMM YYYY')}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {moment(date).format('dddd')}
                    </Text>
                </Space>
            ),
            sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
        },
        {
            title: 'Total Hours',
            dataIndex: 'total_hours',
            key: 'total_hours',
            width: 150,
            render: (hours, record) => {
                const timeStr = convertDecimalToTime(hours);
                
                let color = 'default';
                if (hours < 7.5) {
                    color = 'red';
                } else if (hours >= 7.5 && hours < 8) {
                    color = 'orange';
                } else if (hours >= 8) {
                    color = 'green';
                }
                
                return (
                    <Space>
                        {timeStr ? (
                            <Tag 
                                color={color} 
                                style={{ fontSize: 15, padding: '4px 12px' }}
                            >
                                <ClockCircleOutlined /> {timeStr}
                            </Tag>
                        ) : <Text type="secondary">-</Text>}
                        {record.is_edited && (
                            <Tag color="blue" style={{ fontSize: 11 }}>
                                Edited
                            </Tag>
                        )}
                    </Space>
                );
            },
            sorter: (a, b) => (parseFloat(a.total_hours) || 0) - (parseFloat(b.total_hours) || 0),
        },
        // Only show Actions column if user has edit permission
        ...(canEditAttendance ? [{
            title: 'Actions',
            key: 'actions',
            width: 100,
            render: (_, record) => (
                <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => handleEditClick(record)}
                    size="small"
                >
                    Edit
                </Button>
            ),
        }] : [])
    ];

    // Check if user has view permission before rendering
    if (!canViewAttendance) {
        return (
            <div style={{ padding: 24, textAlign: 'center' }}>
                <CloseCircleOutlined style={{ fontSize: 48, color: '#f5222d' }} />
                <h2>Access Denied</h2>
                <p>You do not have permission to view attendance records.</p>
            </div>
        );
    }

    return (
        <div>
            <h1>Attendance</h1>

            {isHR && summary && (
                <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Total Employees"
                                value={summary.total_employees}
                                prefix={<UserOutlined />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Present Today"
                                value={summary.present}
                                prefix={<CheckCircleOutlined />}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Absent Today"
                                value={summary.absent}
                                prefix={<CloseCircleOutlined />}
                                valueStyle={{ color: '#f5222d' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Late Arrivals"
                                value={summary.late}
                                prefix={<ClockCircleOutlined />}
                                valueStyle={{ color: '#fa8c16' }}
                            />
                        </Card>
                    </Col>
                </Row>
            )}

            {!isHR && (
                <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={8}>
                        <Card>
                            <Statistic
                                title="Today's Working Hours"
                                value={convertDecimalToTime(employeeStats.daily) || '0:00'}
                                prefix={<ClockCircleOutlined />}
                                valueStyle={{ color: '#1890ff', fontSize: 24 }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card>
                            <Statistic
                                title="This Week's Total"
                                value={convertDecimalToTime(employeeStats.weekly) || '0:00'}
                                prefix={<CalendarOutlined />}
                                valueStyle={{ color: '#52c41a', fontSize: 24 }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card>
                            <Statistic
                                title="This Month's Total"
                                value={convertDecimalToTime(employeeStats.monthly) || '0:00'}
                                prefix={<CalendarOutlined />}
                                valueStyle={{ color: '#722ed1', fontSize: 24 }}
                            />
                        </Card>
                    </Col>
                </Row>
            )}

            <Card>
                <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <Space wrap>
                        <RangePicker
                            value={dateRange}
                            onChange={setDateRange}
                            format="DD-MM-YYYY"
                        />
                        {isHR && (
                            <Select
                                placeholder="Filter by employee"
                                style={{ width: 200 }}
                                allowClear
                                value={selectedEmployee}
                                onChange={setSelectedEmployee}
                                showSearch
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {employees.map(emp => (
                                    <Select.Option key={emp.employee_id} value={emp.employee_id}>
                                        {emp.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        )}
                    </Space>
                    <Space>
                        {isHR && (
                            <Button
                                type="primary"
                                onClick={handleSync}
                                icon={<SyncOutlined spin={syncing} />}
                                loading={syncing}
                                style={{ backgroundColor: '#73d13d', borderColor: '#73d13d' }}
                            >
                                Sync Data
                            </Button>
                        )}
                        <Button 
                            type="default" 
                            onClick={exportToCSV} 
                            icon={<DownloadOutlined />}
                            disabled={!attendance || attendance.length === 0}
                        >
                            Export CSV
                        </Button>
                        <Button type="primary" onClick={fetchAttendance} icon={<ClockCircleOutlined />}>
                            Refresh
                        </Button>
                    </Space>
                </Space>

                <Table
                    dataSource={attendance}
                    columns={columns}
                    loading={loading}
                    rowKey={(record) => `${record.employee_code}_${record.date}`}
                    pagination={{
                        pageSize: 20,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} records`
                    }}
                />
            </Card>

            {/* Edit Modal - Only rendered if user has edit permission */}
            {canEditAttendance && (
                <Modal
                    title={
                        <Space>
                            <EditOutlined />
                            Edit Attendance Hours
                        </Space>
                    }
                    open={editModalVisible}
                    onOk={handleEditSubmit}
                    onCancel={() => {
                        setEditModalVisible(false);
                        editForm.resetFields();
                    }}
                    confirmLoading={submitting}
                    okText="Update"
                    cancelText="Cancel"
                    width={500}
                >
                    {editingRecord && (
                        <div style={{ marginBottom: 16 }}>
                            <Text type="secondary">Employee: </Text>
                            <Text strong>{editingRecord.employee_code}</Text>
                            <br />
                            <Text type="secondary">Date: </Text>
                            <Text strong>{moment(editingRecord.date).format('DD MMM YYYY')}</Text>
                            <br />
                            <Text type="secondary">Current Hours: </Text>
                            <Text strong>{convertDecimalToTime(editingRecord.total_hours)}</Text>
                        </div>
                    )}

                    <Form
                        form={editForm}
                        layout="vertical"
                        name="edit_attendance_form"
                    >
                        <Form.Item
                            name="new_hours"
                            label="New Hours"
                            rules={[
                                { required: true, message: 'Please enter new hours' },
                                { type: 'number', min: 0, max: 24, message: 'Hours must be between 0 and 24' }
                            ]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                placeholder="Enter hours (e.g., 8.5)"
                                step={0.5}
                                precision={2}
                                formatter={(value) => `${value} hrs`}
                                parser={(value) => value.replace(' hrs', '')}
                            />
                        </Form.Item>

                        <Form.Item
                            name="reason"
                            label="Reason for Edit"
                            rules={[
                                { required: true, message: 'Please provide a reason' },
                                { min: 10, message: 'Reason must be at least 10 characters' }
                            ]}
                        >
                            <TextArea
                                rows={4}
                                placeholder="Explain why you are editing this attendance record..."
                                maxLength={500}
                                showCount
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            )}
        </div>
    );
};

export default AttendancePage;
