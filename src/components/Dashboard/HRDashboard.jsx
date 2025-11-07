// import React, { useEffect, useState } from 'react';
// import { Card, Row, Col, Statistic, Table, Tag, Calendar, Badge } from 'antd';
// import {
//     UserOutlined,
//     FileTextOutlined,
//     CheckCircleOutlined,
//     ClockCircleOutlined,
//     CalendarOutlined
// } from '@ant-design/icons';
// import { getAllEmployees } from '../../services/employeeService';
// import { getPendingLeaves, getAllLeaves } from '../../services/leaveService';
// import { getCalendarEvents } from '../../services/calendarService';
// import moment from 'moment';

// const HRDashboard = () => {
//     const [stats, setStats] = useState({
//         totalEmployees: 0,
//         pendingApprovals: 0,
//         todayOnLeave: 0,
//         monthLeaves: 0
//     });
//     const [pendingLeaves, setPendingLeaves] = useState([]);
//     const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
//     const [calendarEvents, setCalendarEvents] = useState([]);

//     useEffect(() => {
//         fetchDashboardData();
//     }, []);

//     const fetchDashboardData = async () => {
//         try {
//             const employeesData = await getAllEmployees();
//             const pendingData = await getPendingLeaves();
//             const allLeavesData = await getAllLeaves();
//             const allLeaves = allLeavesData.data;

//             // Get calendar events for current month
//             const currentMonth = moment().month() + 1;
//             const currentYear = moment().year();
//             const eventsData = await getCalendarEvents(currentMonth, currentYear);

//             // Calculate stats
//             const today = moment().format('YYYY-MM-DD');
//             const todayLeaves = allLeaves.filter(l => 
//                 l.status === 'approved' && 
//                 moment(today).isBetween(moment(l.from_date), moment(l.to_date), null, '[]')
//             );

//             const monthStart = moment().startOf('month').format('YYYY-MM-DD');
//             const monthEnd = moment().endOf('month').format('YYYY-MM-DD');
//             const monthLeaves = allLeaves.filter(l =>
//                 l.status === 'approved' &&
//                 (moment(l.from_date).isBetween(monthStart, monthEnd, null, '[]') ||
//                  moment(l.to_date).isBetween(monthStart, monthEnd, null, '[]'))
//             );

//             // Upcoming birthdays
//             const employees = employeesData.data;
//             const birthdays = employees
//                 .filter(e => e.date_of_birth)
//                 .map(e => ({
//                     ...e,
//                     birthday: moment(e.date_of_birth).month(moment().month()).year(moment().year())
//                 }))
//                 .filter(e => e.birthday.isAfter(moment()) && e.birthday.isBefore(moment().add(30, 'days')))
//                 .sort((a, b) => a.birthday - b.birthday)
//                 .slice(0, 5);

//             setStats({
//                 totalEmployees: employees.length,
//                 pendingApprovals: pendingData.data.length,
//                 todayOnLeave: todayLeaves.length,
//                 monthLeaves: monthLeaves.length
//             });

//             setPendingLeaves(pendingData.data.slice(0, 5));
//             setUpcomingBirthdays(birthdays);
//             setCalendarEvents(eventsData.data);

//         } catch (error) {
//             console.error('Error fetching dashboard data:', error);
//         }
//     };

//     const leaveColumns = [
//         {
//             title: 'Employee',
//             dataIndex: 'employee_name',
//             key: 'employee_name'
//         },
//         {
//             title: 'Leave Type',
//             dataIndex: 'leave_name',
//             key: 'leave_name'
//         },
//         {
//             title: 'From Date',
//             dataIndex: 'from_date',
//             key: 'from_date',
//             render: (date) => moment(date).format('DD MMM YYYY')
//         },
//         {
//             title: 'Days',
//             dataIndex: 'number_of_days',
//             key: 'number_of_days'
//         }
//     ];

//     return (
//         <div>
//             <h1>HR Dashboard</h1>
            
//             <Row gutter={16} style={{ marginBottom: 24 }}>
//                 <Col xs={24} sm={12} lg={6}>
//                     <Card>
//                         <Statistic
//                             title="Total Employees"
//                             value={stats.totalEmployees}
//                             prefix={<UserOutlined />}
//                             valueStyle={{ color: '#1890ff' }}
//                         />
//                     </Card>
//                 </Col>
//                 <Col xs={24} sm={12} lg={6}>
//                     <Card>
//                         <Statistic
//                             title="Pending Approvals"
//                             value={stats.pendingApprovals}
//                             prefix={<ClockCircleOutlined />}
//                             valueStyle={{ color: '#fa8c16' }}
//                         />
//                     </Card>
//                 </Col>
//                 <Col xs={24} sm={12} lg={6}>
//                     <Card>
//                         <Statistic
//                             title="On Leave Today"
//                             value={stats.todayOnLeave}
//                             prefix={<FileTextOutlined />}
//                             valueStyle={{ color: '#52c41a' }}
//                         />
//                     </Card>
//                 </Col>
//                 <Col xs={24} sm={12} lg={6}>
//                     <Card>
//                         <Statistic
//                             title="This Month Leaves"
//                             value={stats.monthLeaves}
//                             prefix={<CalendarOutlined />}
//                             valueStyle={{ color: '#722ed1' }}
//                         />
//                     </Card>
//                 </Col>
//             </Row>

//             <Row gutter={16}>
//                 <Col xs={24} lg={12}>
//                     <Card title="Upcoming Birthdays">
//                         <Table
//                             dataSource={upcomingBirthdays}
//                             columns={[
//                                 { title: 'Employee', dataIndex: 'name', key: 'name' },
//                                 { 
//                                     title: 'Date', 
//                                     dataIndex: 'date_of_birth', 
//                                     key: 'date_of_birth',
//                                     render: (date) => moment(date).format('DD MMM')
//                                 }
//                             ]}
//                             pagination={false}
//                             rowKey="id"
//                             size="small"
//                         />
//                     </Card>
//                 </Col>
//             </Row>
//         </div>
//     );
// };

// export default HRDashboard;


// import React, { useEffect, useState } from 'react';
// import { Card, Row, Col, Statistic, Table, Tag, Space, Modal, Input, message, Dropdown, Button, Typography } from 'antd';
// import {
//     ClockCircleOutlined,
//     CalendarOutlined,
//     CheckOutlined,
//     CloseOutlined,
//     PauseOutlined,
//     DownOutlined,
//     WarningOutlined,
//     UserOutlined
// } from '@ant-design/icons';
// import moment from 'moment-timezone';
// import { getAllEmployees } from '../../services/employeeService';
// import { getPendingLeaves, getAllLeaves, approveLeave, rejectLeave, holdLeave } from '../../services/leaveService';
// import { gettotalhoursforcalendar, getAllAttendance } from '../../services/attendanceService';
// import CalendarView from '../Calendar/CalendarView';
// const { TextArea } = Input;
// const { Text } = Typography;

// const HRDashboard = () => {
//     const [stats, setStats] = useState({
//         totalEmployees: 0,
//         pendingApprovals: 0,
//         todayOnLeave: 0,
//         monthLeaves: 0
//     });
//     const [pendingLeaves, setPendingLeaves] = useState([]);
//     const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
//     const [shortHourWorkers, setShortHourWorkers] = useState([]);
//     const [checkDate, setCheckDate] = useState(null);
//     const [employeeStats, setEmployeeStats] = useState({
//         daily: 0,
//         weekly: 0,
//         monthly: 0
//     });
//     const [todayPunch, setTodayPunch] = useState(null);
//     const [liveWorkingTime, setLiveWorkingTime] = useState('0:00:00');
//     const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(false);
    
//     // Leave modal states
//     const [leaveModalVisible, setLeaveModalVisible] = useState(false);
//     const [selectedLeave, setSelectedLeave] = useState(null);
//     const [comments, setComments] = useState('');
//     const [actionType, setActionType] = useState('');
//     const [loading, setLoading] = useState(false);

//     const IST_TIMEZONE = 'Asia/Kolkata';

//     useEffect(() => {
//         moment.tz.setDefault(IST_TIMEZONE);
//         fetchDashboardData();
//     }, []);

//     useEffect(() => {
//         let interval;
//         if (isCurrentlyWorking && todayPunch) {
//             interval = setInterval(() => {
//                 const calculatedTime = calculateLiveWorkingTime();
//                 setLiveWorkingTime(calculatedTime);
//             }, 1000);
//         } else if (todayPunch && !isCurrentlyWorking) {
//             setLiveWorkingTime(convertDecimalToTimeWithSeconds(todayPunch.total_hours));
//         }
//         return () => {
//             if (interval) clearInterval(interval);
//         };
//     }, [isCurrentlyWorking, todayPunch]);

//     const calculateLiveWorkingTime = () => {
//         if (!todayPunch || !todayPunch.pairs) return '0:00:00';
//         let totalSeconds = 0;
//         const now = moment.tz(IST_TIMEZONE);

//         todayPunch.pairs.forEach((pair) => {
//             if (pair.in && pair.out) {
//                 totalSeconds += (pair.duration || 0) * 60;
//             } else if (pair.in && !pair.out) {
//                 const todayDate = moment.tz(todayPunch.date, IST_TIMEZONE).format('YYYY-MM-DD');
//                 const inTime = moment.tz(`${todayDate} ${pair.in}`, 'YYYY-MM-DD HH:mm:ss', IST_TIMEZONE);
//                 const diffSeconds = now.diff(inTime, 'seconds');
//                 totalSeconds += diffSeconds;
//             }
//         });

//         const hours = Math.floor(totalSeconds / 3600);
//         const minutes = Math.floor((totalSeconds % 3600) / 60);
//         const seconds = totalSeconds % 60;
//         return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
//     };

//     const convertDecimalToTimeWithSeconds = (decimalHours) => {
//         if (!decimalHours || isNaN(decimalHours)) return '0:00:00';
//         const totalSeconds = Math.round(decimalHours * 3600);
//         const hours = Math.floor(totalSeconds / 3600);
//         const minutes = Math.floor((totalSeconds % 3600) / 60);
//         const seconds = totalSeconds % 60;
//         return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
//     };

//     const convertDecimalToTime = (decimalHours) => {
//         if (!decimalHours || isNaN(decimalHours)) return '0:00';
//         const hours = Math.floor(decimalHours);
//         const minutes = Math.round((decimalHours - hours) * 60);
//         return `${hours}:${minutes.toString().padStart(2, '0')}`;
//     };

//     const calculateEmployeeStats = (attendanceData) => {
//         if (!attendanceData || attendanceData.length === 0) {
//             setEmployeeStats({ daily: 0, weekly: 0, monthly: 0 });
//             setIsCurrentlyWorking(false);
//             return;
//         }

//         const today = moment.tz(IST_TIMEZONE).startOf('day');
//         const startOfWeek = moment.tz(IST_TIMEZONE).startOf('week');
//         const startOfMonth = moment.tz(IST_TIMEZONE).startOf('month');

//         let dailyTotal = 0;
//         let weeklyTotal = 0;
//         let monthlyTotal = 0;
//         let todayRecord = null;

//         attendanceData.forEach(record => {
//             const recordDate = moment.tz(record.date, IST_TIMEZONE);
//             const hours = parseFloat(record.total_hours) || 0;

//             if (recordDate.isSame(today, 'day')) {
//                 dailyTotal += hours;
//                 todayRecord = record;
//             }
//             if (recordDate.isSameOrAfter(startOfWeek, 'day') && recordDate.isSameOrBefore(today, 'day')) {
//                 weeklyTotal += hours;
//             }
//             if (recordDate.isSameOrAfter(startOfMonth, 'day') && recordDate.isSameOrBefore(today, 'day')) {
//                 monthlyTotal += hours;
//             }
//         });

//         setEmployeeStats({ daily: dailyTotal, weekly: weeklyTotal, monthly: monthlyTotal });
//         setTodayPunch(todayRecord);

//         if (todayRecord && todayRecord.pairs && todayRecord.pairs.length > 0) {
//             const lastPair = todayRecord.pairs[todayRecord.pairs.length - 1];
//             const isWorking = lastPair.in && !lastPair.out;
//             setIsCurrentlyWorking(isWorking);
//         } else {
//             setIsCurrentlyWorking(false);
//         }
//     };

//     const getCheckDate = () => {
//         const yesterday = moment.tz(IST_TIMEZONE).subtract(1, 'day');
//         const dayOfWeek = yesterday.day();

//         if (dayOfWeek === 0) {
//             return yesterday.subtract(2, 'days');
//         } else if (dayOfWeek === 6) {
//             return yesterday.subtract(1, 'day');
//         } else {
//             return yesterday;
//         }
//     };

//     const fetchShortHourWorkers = async () => {
//         try {
//             const checkDateMoment = getCheckDate();
//             const dateStr = checkDateMoment.format('YYYY-MM-DD');
//             setCheckDate(checkDateMoment);

//             const attendanceData = await getAllAttendance(dateStr, dateStr);
            
//             const shortWorkers = attendanceData.data
//                 .filter(record => parseFloat(record.total_hours) < 8 && parseFloat(record.total_hours) > 0)
//                 .sort((a, b) => parseFloat(a.total_hours) - parseFloat(b.total_hours))
//                 .slice(0, 30);

//             setShortHourWorkers(shortWorkers);
//         } catch (error) {
//             console.error('Error fetching short hour workers:', error);
//         }
//     };

// const fetchDashboardData = async () => {
//     try {
//         const employeesData = await getAllEmployees();
//         const pendingData = await getPendingLeaves();
//         const allLeavesData = await getAllLeaves();
//         const allLeaves = allLeavesData.data;

//         const today = moment();
//         const todayLeaves = allLeaves.filter(l => 
//             l.status === 'approved' && 
//             today.isBetween(moment(l.from_date), moment(l.to_date), 'day', '[]')
//         );

//         const monthStart = moment().startOf('month');
//         const monthEnd = moment().endOf('month');
//         const monthLeaves = allLeaves.filter(l =>
//             l.status === 'approved' &&
//             (moment(l.from_date).isBetween(monthStart, monthEnd, 'day', '[]') ||
//              moment(l.to_date).isBetween(monthStart, monthEnd, 'day', '[]'))
//         );

//         const employees = employeesData.data;
//         const now = moment();
//         const next30Days = moment().add(30, 'days');

//         const birthdays = employees
//             .filter(e => e.date_of_birth)
//             .map(e => {
//                 const birthDate = moment(e.date_of_birth);
//                 let birthdayThisYear = moment(birthDate).year(now.year());
                
//                 // If birthday already passed this year, set to next year
//                 if (birthdayThisYear.isBefore(now, 'day')) {
//                     birthdayThisYear = moment(birthDate).year(now.year() + 1);
//                 }
                
//                 return {
//                     ...e,
//                     birthday: birthdayThisYear
//                 };
//             })
//             .filter(e => e.birthday.isSameOrAfter(now, 'day') && e.birthday.isSameOrBefore(next30Days, 'day'))
//             .sort((a, b) => a.birthday.valueOf() - b.birthday.valueOf())
//             .slice(0, 5);

//         setStats({
//             totalEmployees: employees.length,
//             pendingApprovals: pendingData.data.length,
//             todayOnLeave: todayLeaves.length,
//             monthLeaves: monthLeaves.length
//         });

//         setPendingLeaves(pendingData.data.slice(0, 5));
//         setUpcomingBirthdays(birthdays);

//         const startOfMonth = moment.tz(IST_TIMEZONE).startOf('month').format('YYYY-MM-DD');
//         const endDate = moment.tz(IST_TIMEZONE).format('YYYY-MM-DD');
//         const attendanceData = await gettotalhoursforcalendar(startOfMonth, endDate);
//         calculateEmployeeStats(attendanceData.data);

//         await fetchShortHourWorkers();

//     } catch (error) {
//         console.error('Error fetching dashboard data:', error);
//     }
// };

//     const showActionModal = (leave, type) => {
//         setSelectedLeave(leave);
//         setActionType(type);
//         setLeaveModalVisible(true);
//         setComments('');
//     };

//     const handleAction = async () => {
//         if ((actionType === 'reject' || actionType === 'hold') && !comments.trim()) {
//             message.error(actionType === 'reject' ? 'Rejection reason is required' : 'Hold reason is required');
//             return;
//         }

//         setLoading(true);
//         try {
//             if (actionType === 'approve') {
//                 await approveLeave(selectedLeave.id, comments);
//                 message.success('Leave approved successfully');
//             } else if (actionType === 'reject') {
//                 await rejectLeave(selectedLeave.id, comments);
//                 message.success('Leave rejected successfully');
//             } else if (actionType === 'hold') {
//                 await holdLeave(selectedLeave.id, comments);
//                 message.success('Leave put on hold successfully');
//             }
//             setLeaveModalVisible(false);
//             fetchDashboardData();
//         } catch (error) {
//             message.error(error.response?.data?.message || 'Action failed');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const getActionItems = (record) => [
//         {
//             key: 'approve',
//             label: 'Approve',
//             icon: <CheckOutlined style={{ color: '#52c41a' }} />,
//             onClick: () => showActionModal(record, 'approve')
//         },
//         {
//             key: 'hold',
//             label: 'Hold',
//             icon: <PauseOutlined style={{ color: '#faad14' }} />,
//             onClick: () => showActionModal(record, 'hold')
//         },
//         {
//             key: 'reject',
//             label: 'Reject',
//             icon: <CloseOutlined style={{ color: '#ff4d4f' }} />,
//             onClick: () => showActionModal(record, 'reject')
//         }
//     ];

//     const leaveColumns = [
//         {
//             title: 'Employee',
//             dataIndex: 'employee_name',
//             key: 'employee_name',
//             width: 150
//         },
//         {
//             title: 'Leave Type',
//             dataIndex: 'leave_name',
//             key: 'leave_name',
//             width: 120
//         },
//         {
//             title: 'From',
//             dataIndex: 'from_date',
//             key: 'from_date',
//             width: 100,
//             render: (date) => moment(date).format('DD MMM')
//         },
//         {
//             title: 'Days',
//             dataIndex: 'number_of_days',
//             key: 'number_of_days',
//             width: 60,
//             align: 'center'
//         },
//         {
//             title: 'Action',
//             key: 'action',
//             width: 100,
//             align: 'center',
//             render: (_, record) => (
//                 <Dropdown
//                     menu={{ items: getActionItems(record) }}
//                     trigger={['click']}
//                 >
//                     <Button size="small">
//                         Actions <DownOutlined />
//                     </Button>
//                 </Dropdown>
//             )
//         }
//     ];

//     const birthdayColumns = [
//         { 
//             title: 'Employee', 
//             dataIndex: 'name', 
//             key: 'name',
//             width: 150
//         },
//         { 
//             title: 'Date', 
//             dataIndex: 'date_of_birth', 
//             key: 'date_of_birth',
//             width: 100,
//             render: (date) => moment(date).format('DD MMM')
//         }
//     ];

//     const shortHourColumns = [
//         {
//             title: 'Employee',
//             dataIndex: 'employee_name',
//             key: 'employee_name',
//             width: 150,
//             render: (name, record) => (
//                 <Space>
//                     <UserOutlined style={{ color: '#ff4d4f' }} />
//                     <Text>{name || record.employee_code}</Text>
//                 </Space>
//             )
//         },
//         {
//             title: 'Hours',
//             dataIndex: 'total_hours',
//             key: 'total_hours',
//             width: 100,
//             align: 'center',
//             render: (hours) => {
//                 const timeStr = convertDecimalToTime(hours);
//                 let color = 'red';
//                 if (hours >= 7 && hours < 8) {
//                     color = 'orange';
//                 }
//                 return (
//                     <Tag color={color} style={{ fontSize: 14 }}>
//                         <ClockCircleOutlined /> {timeStr}
//                     </Tag>
//                 );
//             }
//         }
//     ];

//     return (
//         <div>
//             <h1>HR Dashboard</h1>
            
//             {/* Attendance Statistics */}
//             <Row gutter={16} style={{ marginBottom: 24 }}>
//                 <Col xs={24} sm={8}>
//                     <Card>
//                         <Statistic
//                             title={
//                                 <Space>
//                                     <span>Today's Hours</span>
//                                     {isCurrentlyWorking && <Tag color="success">Live</Tag>}
//                                 </Space>
//                             }
//                             value={liveWorkingTime}
//                             prefix={<ClockCircleOutlined />}
//                             valueStyle={{ 
//                                 color: isCurrentlyWorking ? '#52c41a' : '#1890ff', 
//                                 fontSize: 24 
//                             }}
//                         />
//                     </Card>
//                 </Col>
//                 <Col xs={24} sm={8}>
//                     <Card>
//                         <Statistic
//                             title="Weekly Total"
//                             value={convertDecimalToTime(employeeStats.weekly)}
//                             prefix={<CalendarOutlined />}
//                             valueStyle={{ color: '#52c41a', fontSize: 24 }}
//                         />
//                     </Card>
//                 </Col>
//                 <Col xs={24} sm={8}>
//                     <Card>
//                         <Statistic
//                             title="Monthly Total"
//                             value={convertDecimalToTime(employeeStats.monthly)}
//                             prefix={<CalendarOutlined />}
//                             valueStyle={{ color: '#722ed1', fontSize: 24 }}
//                         />
//                     </Card>
//                 </Col>
//             </Row>

//             <Row gutter={16} style={{ marginBottom: 16 }}>
//                 <Col xs={24} lg={14}>
//                     <Card title="Pending Leave Approvals">
//                         <Table
//                             dataSource={pendingLeaves}
//                             columns={leaveColumns}
//                             pagination={false}
//                             rowKey="id"
//                             size="small"
//                             scroll={{ x: 600 }}
//                         />
//                     </Card>
//                 </Col>
//                 <Col xs={24} lg={10}>
//                     <Card title="Upcoming Birthdays">
//                         <Table
//                             dataSource={upcomingBirthdays}
//                             columns={birthdayColumns}
//                             pagination={false}
//                             rowKey="id"
//                             size="small"
//                         />
//                     </Card>
//                 </Col>
//             </Row>

         

//             {/* Calendar Section */}
//             <Row gutter={32}>
//                 <Col xs={24} lg={24}>
//                     <CalendarView />
//                 </Col>

//                 <Col xs={24} lg={6}>
//                     {/* Calendar sidebar with shortage tables will be rendered by CalendarViewForDashboard */}
//                 </Col>
//             </Row>

//             {/* Leave Action Modal */}
//             <Modal
//                 title={
//                     <Space>
//                         {actionType === 'approve' ? (
//                             <><CheckOutlined style={{ color: '#52c41a' }} /> Approve Leave</>
//                         ) : actionType === 'hold' ? (
//                             <><PauseOutlined style={{ color: '#faad14' }} /> Put On Hold</>
//                         ) : (
//                             <><CloseOutlined style={{ color: '#ff4d4f' }} /> Reject Leave</>
//                         )}
//                     </Space>
//                 }
//                 open={leaveModalVisible}
//                 onOk={handleAction}
//                 onCancel={() => setLeaveModalVisible(false)}
//                 okText={actionType === 'approve' ? 'Approve' : actionType === 'hold' ? 'Hold' : 'Reject'}
//                 confirmLoading={loading}
//                 okButtonProps={{
//                     danger: actionType === 'reject',
//                     type: actionType === 'approve' ? 'primary' : 'default',
//                     style: actionType === 'hold' ? { backgroundColor: '#faad14', borderColor: '#faad14', color: 'white' } : {}
//                 }}
//             >
//                 <div style={{ marginBottom: 16 }}>
//                     <Space direction="vertical" size="small" style={{ width: '100%' }}>
//                         <p><strong>Employee:</strong> {selectedLeave?.employee_name}</p>
//                         <p><strong>Leave Type:</strong> {selectedLeave?.leave_name}</p>
//                         <p><strong>Duration:</strong> {selectedLeave?.number_of_days} days</p>
//                         <p><strong>From:</strong> {selectedLeave?.from_date && moment(selectedLeave.from_date).format('DD MMM YYYY')}</p>
//                         <p><strong>To:</strong> {selectedLeave?.to_date && moment(selectedLeave.to_date).format('DD MMM YYYY')}</p>
//                         {selectedLeave?.reason && <p><strong>Reason:</strong> {selectedLeave.reason}</p>}
//                     </Space>
//                 </div>
//                 <TextArea
//                     rows={3}
//                     placeholder={
//                         actionType === 'approve' 
//                             ? 'Comments (optional)' 
//                             : actionType === 'hold'
//                             ? 'Hold reason (required)'
//                             : 'Rejection reason (required)'
//                     }
//                     value={comments}
//                     onChange={(e) => setComments(e.target.value)}
//                 />
//             </Modal>
//         </div>
//     );
// };

// export default HRDashboard;



import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Space, Modal, Input, message, Dropdown, Button, Typography } from 'antd';
import {
    ClockCircleOutlined,
    CalendarOutlined,
    CheckOutlined,
    CloseOutlined,
    PauseOutlined,
    DownOutlined,
    WarningOutlined,
    UserOutlined
} from '@ant-design/icons';
import moment from 'moment-timezone';
import { getAllEmployees } from '../../services/employeeService';
import { getPendingLeaves, getAllLeaves, approveLeave, rejectLeave, holdLeave } from '../../services/leaveService';
import { gettotalhoursforcalendar, getAllAttendance } from '../../services/attendanceService';
import CalendarView from '../Calendar/CalendarView';
const { TextArea } = Input;
const { Text } = Typography;


const HRDashboard = () => {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        pendingApprovals: 0,
        todayOnLeave: 0,
        monthLeaves: 0
    });
    const [pendingLeaves, setPendingLeaves] = useState([]);
    const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
    const [shortHourWorkers, setShortHourWorkers] = useState([]);
    const [checkDate, setCheckDate] = useState(null);
    const [employeeStats, setEmployeeStats] = useState({
        daily: 0,
        weekly: 0,
        monthly: 0
    });
    const [todayPunch, setTodayPunch] = useState(null);
    const [liveWorkingTime, setLiveWorkingTime] = useState('0:00:00');
    const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(false);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [netWorkingHours, setNetWorkingHours] = useState(0);
    
    // Leave modal states
    const [leaveModalVisible, setLeaveModalVisible] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [comments, setComments] = useState('');
    const [actionType, setActionType] = useState('');
    const [loading, setLoading] = useState(false);


    const IST_TIMEZONE = 'Asia/Kolkata';


    useEffect(() => {
        moment.tz.setDefault(IST_TIMEZONE);
        fetchDashboardData();
        fetchCalendarEvents();
    }, []);


    useEffect(() => {
        let interval;
        if (isCurrentlyWorking && todayPunch) {
            interval = setInterval(() => {
                const calculatedTime = calculateLiveWorkingTime();
                setLiveWorkingTime(calculatedTime);
            }, 1000);
        } else if (todayPunch && !isCurrentlyWorking) {
            setLiveWorkingTime(convertDecimalToTimeWithSeconds(todayPunch.total_hours));
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isCurrentlyWorking, todayPunch]);


    const calculateLiveWorkingTime = () => {
        if (!todayPunch || !todayPunch.pairs) return '0:00:00';
        let totalSeconds = 0;
        const now = moment.tz(IST_TIMEZONE);


        todayPunch.pairs.forEach((pair) => {
            if (pair.in && pair.out) {
                totalSeconds += (pair.duration || 0) * 60;
            } else if (pair.in && !pair.out) {
                const todayDate = moment.tz(todayPunch.date, IST_TIMEZONE).format('YYYY-MM-DD');
                const inTime = moment.tz(`${todayDate} ${pair.in}`, 'YYYY-MM-DD HH:mm:ss', IST_TIMEZONE);
                const diffSeconds = now.diff(inTime, 'seconds');
                totalSeconds += diffSeconds;
            }
        });


        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };


    const convertDecimalToTimeWithSeconds = (decimalHours) => {
        if (!decimalHours || isNaN(decimalHours)) return '0:00:00';
        const totalSeconds = Math.round(decimalHours * 3600);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };


    const convertDecimalToTime = (decimalHours) => {
        if (!decimalHours || isNaN(decimalHours)) return '0:00';
        const hours = Math.floor(decimalHours);
        const minutes = Math.round((decimalHours - hours) * 60);
        return `${hours}:${minutes.toString().padStart(2, '0')}`;
    };


    const calculateEmployeeStats = (attendanceData) => {
        if (!attendanceData || attendanceData.length === 0) {
            setEmployeeStats({ daily: 0, weekly: 0, monthly: 0 });
            setIsCurrentlyWorking(false);
            return;
        }


        const today = moment.tz(IST_TIMEZONE).startOf('day');
        const startOfWeek = moment.tz(IST_TIMEZONE).startOf('week');
        const startOfMonth = moment.tz(IST_TIMEZONE).startOf('month');


        let dailyTotal = 0;
        let weeklyTotal = 0;
        let monthlyTotal = 0;
        let todayRecord = null;


        attendanceData.forEach(record => {
            const recordDate = moment.tz(record.date, IST_TIMEZONE);
            const hours = parseFloat(record.total_hours) || 0;


            if (recordDate.isSame(today, 'day')) {
                dailyTotal += hours;
                todayRecord = record;
            }
            if (recordDate.isSameOrAfter(startOfWeek, 'day') && recordDate.isSameOrBefore(today, 'day')) {
                weeklyTotal += hours;
            }
            if (recordDate.isSameOrAfter(startOfMonth, 'day') && recordDate.isSameOrBefore(today, 'day')) {
                monthlyTotal += hours;
            }
        });


        setEmployeeStats({ daily: dailyTotal, weekly: weeklyTotal, monthly: monthlyTotal });
        setTodayPunch(todayRecord);


        if (todayRecord && todayRecord.pairs && todayRecord.pairs.length > 0) {
            const lastPair = todayRecord.pairs[todayRecord.pairs.length - 1];
            const isWorking = lastPair.in && !lastPair.out;
            setIsCurrentlyWorking(isWorking);
        } else {
            setIsCurrentlyWorking(false);
        }
    };


    const getCheckDate = () => {
        const yesterday = moment.tz(IST_TIMEZONE).subtract(1, 'day');
        const dayOfWeek = yesterday.day();


        if (dayOfWeek === 0) {
            return yesterday.subtract(2, 'days');
        } else if (dayOfWeek === 6) {
            return yesterday.subtract(1, 'day');
        } else {
            return yesterday;
        }
    };


    const fetchShortHourWorkers = async () => {
        try {
            const checkDateMoment = getCheckDate();
            const dateStr = checkDateMoment.format('YYYY-MM-DD');
            setCheckDate(checkDateMoment);


            const attendanceData = await getAllAttendance(dateStr, dateStr);
            
            const shortWorkers = attendanceData.data
                .filter(record => parseFloat(record.total_hours) < 8 && parseFloat(record.total_hours) > 0)
                .sort((a, b) => parseFloat(a.total_hours) - parseFloat(b.total_hours))
                .slice(0, 30);


            setShortHourWorkers(shortWorkers);
        } catch (error) {
            console.error('Error fetching short hour workers:', error);
        }
    };


    const fetchCalendarEvents = async () => {
        try {
            const currentDate = moment.tz(IST_TIMEZONE);
            const month = currentDate.month() + 1;
            const year = currentDate.year();
            
            const token = localStorage.getItem('token') || localStorage.getItem('authToken');
            
            const response = await fetch(
                `http://localhost:5000/api/calendar/events?month=${month}&year=${year}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setCalendarEvents(data.data || []);
            
            // Extract net_working_hours from insights
            if (data.insights && data.insights.net_working_hours) {
                setNetWorkingHours(data.insights.net_working_hours);
            }
            
            console.log('Calendar events:', data);
        } catch (error) {
            console.error('Error fetching calendar events:', error);
        }
    };


    const fetchDashboardData = async () => {
        try {
            const employeesData = await getAllEmployees();
            const pendingData = await getPendingLeaves();
            const allLeavesData = await getAllLeaves();
            const allLeaves = allLeavesData.data;


            const today = moment();
            const todayLeaves = allLeaves.filter(l => 
                l.status === 'approved' && 
                today.isBetween(moment(l.from_date), moment(l.to_date), 'day', '[]')
            );


            const monthStart = moment().startOf('month');
            const monthEnd = moment().endOf('month');
            const monthLeaves = allLeaves.filter(l =>
                l.status === 'approved' &&
                (moment(l.from_date).isBetween(monthStart, monthEnd, 'day', '[]') ||
                 moment(l.to_date).isBetween(monthStart, monthEnd, 'day', '[]'))
            );


            const employees = employeesData.data;
            const now = moment();
            const next30Days = moment().add(30, 'days');


            const birthdays = employees
                .filter(e => e.date_of_birth)
                .map(e => {
                    const birthDate = moment(e.date_of_birth);
                    let birthdayThisYear = moment(birthDate).year(now.year());
                    
                    // If birthday already passed this year, set to next year
                    if (birthdayThisYear.isBefore(now, 'day')) {
                        birthdayThisYear = moment(birthDate).year(now.year() + 1);
                    }
                    
                    return {
                        ...e,
                        birthday: birthdayThisYear
                    };
                })
                .filter(e => e.birthday.isSameOrAfter(now, 'day') && e.birthday.isSameOrBefore(next30Days, 'day'))
                .sort((a, b) => a.birthday.valueOf() - b.birthday.valueOf())
                .slice(0, 5);


            setStats({
                totalEmployees: employees.length,
                pendingApprovals: pendingData.data.length,
                todayOnLeave: todayLeaves.length,
                monthLeaves: monthLeaves.length
            });


            setPendingLeaves(pendingData.data.slice(0, 5));
            setUpcomingBirthdays(birthdays);


            const startOfMonth = moment.tz(IST_TIMEZONE).startOf('month').format('YYYY-MM-DD');
            const endDate = moment.tz(IST_TIMEZONE).format('YYYY-MM-DD');
            const attendanceData = await gettotalhoursforcalendar(startOfMonth, endDate);
            calculateEmployeeStats(attendanceData.data);


            await fetchShortHourWorkers();


        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };


    const showActionModal = (leave, type) => {
        setSelectedLeave(leave);
        setActionType(type);
        setLeaveModalVisible(true);
        setComments('');
    };


    const handleAction = async () => {
        if ((actionType === 'reject' || actionType === 'hold') && !comments.trim()) {
            message.error(actionType === 'reject' ? 'Rejection reason is required' : 'Hold reason is required');
            return;
        }


        setLoading(true);
        try {
            if (actionType === 'approve') {
                await approveLeave(selectedLeave.id, comments);
                message.success('Leave approved successfully');
            } else if (actionType === 'reject') {
                await rejectLeave(selectedLeave.id, comments);
                message.success('Leave rejected successfully');
            } else if (actionType === 'hold') {
                await holdLeave(selectedLeave.id, comments);
                message.success('Leave put on hold successfully');
            }
            setLeaveModalVisible(false);
            fetchDashboardData();
        } catch (error) {
            message.error(error.response?.data?.message || 'Action failed');
        } finally {
            setLoading(false);
        }
    };


    const getActionItems = (record) => [
        {
            key: 'approve',
            label: 'Approve',
            icon: <CheckOutlined style={{ color: '#52c41a' }} />,
            onClick: () => showActionModal(record, 'approve')
        },
        {
            key: 'hold',
            label: 'Hold',
            icon: <PauseOutlined style={{ color: '#faad14' }} />,
            onClick: () => showActionModal(record, 'hold')
        },
        {
            key: 'reject',
            label: 'Reject',
            icon: <CloseOutlined style={{ color: '#ff4d4f' }} />,
            onClick: () => showActionModal(record, 'reject')
        }
    ];


    const leaveColumns = [
        {
            title: 'Employee',
            dataIndex: 'employee_name',
            key: 'employee_name',
            width: 150
        },
        {
            title: 'Leave Type',
            dataIndex: 'leave_name',
            key: 'leave_name',
            width: 120
        },
        {
            title: 'From',
            dataIndex: 'from_date',
            key: 'from_date',
            width: 100,
            render: (date) => moment(date).format('DD MMM')
        },
        {
            title: 'Days',
            dataIndex: 'number_of_days',
            key: 'number_of_days',
            width: 60,
            align: 'center'
        },
        {
            title: 'Action',
            key: 'action',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <Dropdown
                    menu={{ items: getActionItems(record) }}
                    trigger={['click']}
                >
                    <Button size="small">
                        Actions <DownOutlined />
                    </Button>
                </Dropdown>
            )
        }
    ];


    const birthdayColumns = [
        { 
            title: 'Employee', 
            dataIndex: 'name', 
            key: 'name',
            width: 150
        },
        { 
            title: 'Date', 
            dataIndex: 'date_of_birth', 
            key: 'date_of_birth',
            width: 100,
            render: (date) => moment(date).format('DD MMM')
        }
    ];


    const shortHourColumns = [
        {
            title: 'Employee',
            dataIndex: 'employee_name',
            key: 'employee_name',
            width: 150,
            render: (name, record) => (
                <Space>
                    <UserOutlined style={{ color: '#ff4d4f' }} />
                    <Text>{name || record.employee_code}</Text>
                </Space>
            )
        },
        {
            title: 'Hours',
            dataIndex: 'total_hours',
            key: 'total_hours',
            width: 100,
            align: 'center',
            render: (hours) => {
                const timeStr = convertDecimalToTime(hours);
                let color = 'red';
                if (hours >= 7 && hours < 8) {
                    color = 'orange';
                }
                return (
                    <Tag color={color} style={{ fontSize: 14 }}>
                        <ClockCircleOutlined /> {timeStr}
                    </Tag>
                );
            }
        }
    ];


    return (
        <div>
            <h1>HR Dashboard</h1>
            
            {/* Attendance Statistics */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title={
                                <Space>
                                    <span>Today's Hours</span>
                                    {isCurrentlyWorking && <Tag color="success">Live</Tag>}
                                </Space>
                            }
                            value={liveWorkingTime}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ 
                                color: isCurrentlyWorking ? '#52c41a' : '#1890ff', 
                                fontSize: 24 
                            }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Weekly Total"
                            value={convertDecimalToTime(employeeStats.weekly)}
                            prefix={<CalendarOutlined />}
                            valueStyle={{ color: '#52c41a', fontSize: 24 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <Statistic
                                    title="Monthly Total"
                                    value={convertDecimalToTime(employeeStats.monthly)}
                                    prefix={<CalendarOutlined />}
                                    valueStyle={{ color: '#52c41a', fontSize: 24 }}
                                />
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <Text type="secondary" style={{ fontSize: 12 }}>Net Working Hours</Text>
                                <div style={{ fontSize: 18, fontWeight: 'bold', color: '#1890ff', marginTop: 8 }}>
                                    {convertDecimalToTime(netWorkingHours)}
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>


            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col xs={24} lg={14}>
                    <Card title="Pending Leave Approvals">
                        <Table
                            dataSource={pendingLeaves}
                            columns={leaveColumns}
                            pagination={false}
                            rowKey="id"
                            size="small"
                            scroll={{ x: 600 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={10}>
                    <Card title="Upcoming Birthdays">
                        <Table
                            dataSource={upcomingBirthdays}
                            columns={birthdayColumns}
                            pagination={false}
                            rowKey="id"
                            size="small"
                        />
                    </Card>
                </Col>
            </Row>


            {/* Calendar Section */}
            <Row gutter={32}>
                <Col xs={24} lg={24}>
                    <CalendarView />
                </Col>


                <Col xs={24} lg={6}>
                    {/* Calendar sidebar with shortage tables will be rendered by CalendarViewForDashboard */}
                </Col>
            </Row>


            {/* Leave Action Modal */}
            <Modal
                title={
                    <Space>
                        {actionType === 'approve' ? (
                            <><CheckOutlined style={{ color: '#52c41a' }} /> Approve Leave</>
                        ) : actionType === 'hold' ? (
                            <><PauseOutlined style={{ color: '#faad14' }} /> Put On Hold</>
                        ) : (
                            <><CloseOutlined style={{ color: '#ff4d4f' }} /> Reject Leave</>
                        )}
                    </Space>
                }
                open={leaveModalVisible}
                onOk={handleAction}
                onCancel={() => setLeaveModalVisible(false)}
                okText={actionType === 'approve' ? 'Approve' : actionType === 'hold' ? 'Hold' : 'Reject'}
                confirmLoading={loading}
                okButtonProps={{
                    danger: actionType === 'reject',
                    type: actionType === 'approve' ? 'primary' : 'default',
                    style: actionType === 'hold' ? { backgroundColor: '#faad14', borderColor: '#faad14', color: 'white' } : {}
                }}
            >
                <div style={{ marginBottom: 16 }}>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <p><strong>Employee:</strong> {selectedLeave?.employee_name}</p>
                        <p><strong>Leave Type:</strong> {selectedLeave?.leave_name}</p>
                        <p><strong>Duration:</strong> {selectedLeave?.number_of_days} days</p>
                        <p><strong>From:</strong> {selectedLeave?.from_date && moment(selectedLeave.from_date).format('DD MMM YYYY')}</p>
                        <p><strong>To:</strong> {selectedLeave?.to_date && moment(selectedLeave.to_date).format('DD MMM YYYY')}</p>
                        {selectedLeave?.reason && <p><strong>Reason:</strong> {selectedLeave.reason}</p>}
                    </Space>
                </div>
                <TextArea
                    rows={3}
                    placeholder={
                        actionType === 'approve' 
                            ? 'Comments (optional)' 
                            : actionType === 'hold'
                            ? 'Hold reason (required)'
                            : 'Rejection reason (required)'
                    }
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                />
            </Modal>
        </div>
    );
};


export default HRDashboard;
