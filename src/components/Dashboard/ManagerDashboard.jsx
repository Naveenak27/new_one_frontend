// import React, { useEffect, useState } from 'react';
// import { Card, Row, Col, Statistic, Table, Tag } from 'antd';
// import {
//     TeamOutlined,
//     FileTextOutlined,
//     ClockCircleOutlined,
//     CheckCircleOutlined
// } from '@ant-design/icons';
// import { getPendingLeaves } from '../../services/leaveService';
// import { getFullEmployeeAttendance } from '../../services/attendanceService';
// import api from '../../services/api';
// import moment from 'moment';

// const ManagerDashboard = () => {
//     const [stats, setStats] = useState({
//         teamSize: 0,
//         pendingApprovals: 0,
//         approvedThisMonth: 0,
//         teamOnLeaveToday: 0
//     });
//     const [pendingLeaves, setPendingLeaves] = useState([]);
//     const [teamMembers, setTeamMembers] = useState([]);
//     const [lateComers, setLateComers] = useState([]);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         fetchDashboardData();
//         fetchLateComers();
//     }, []);

//     const fetchDashboardData = async () => {
//         try {
//             const pendingData = await getPendingLeaves();
//             const teamData = await api.get('/employees/my-team');
            
//             setStats({
//                 teamSize: teamData.data?.data?.length || 0,
//                 pendingApprovals: pendingData.data.length,
//                 approvedThisMonth: 0,
//                 teamOnLeaveToday: 0
//             });

//             setPendingLeaves(pendingData.data.slice(0, 10));
//             setTeamMembers(teamData.data?.data || []);

//         } catch (error) {
//             console.error('Error fetching dashboard data:', error);
//         }
//     };

//     const fetchLateComers = async () => {
//         try {
//             setLoading(true);
//             // Get last week's date range
//             const startDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
//             const endDate = moment().format('YYYY-MM-DD');
            
//             const response = await getFullEmployeeAttendance(startDate, endDate);
//             const attendanceData = response.data || [];

//             // Define late threshold (after 12:15 PM)
//             const lateThreshold = '12:15:00';

//             // Filter late comers - people who logged in after 12:15 PM
//             const lateEmployees = attendanceData.filter(record => {
//                 if (record.first_in && record.first_in > lateThreshold) {
//                     return true;
//                 }
//                 return false;
//             });

//             setLateComers(lateEmployees);
//         } catch (error) {
//             console.error('Error fetching late comers:', error);
//         } finally {
//             setLoading(false);
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
//             title: 'From',
//             dataIndex: 'from_date',
//             key: 'from_date',
//             render: (date) => new Date(date).toLocaleDateString()
//         },
//         {
//             title: 'Days',
//             dataIndex: 'number_of_days',
//             key: 'number_of_days'
//         },
//         {
//             title: 'Status',
//             dataIndex: 'status',
//             key: 'status',
//             render: (status) => <Tag color="orange">{status.toUpperCase()}</Tag>
//         }
//     ];

//     const lateComersColumns = [
//         {
//             title: 'Employee Code',
//             dataIndex: 'employee_code',
//             key: 'employee_code',
//             width: 150
//         },
//         {
//             title: 'Name',
//             dataIndex: 'employee_name',
//             key: 'employee_name',
//             width: 200
//         },
//         {
//             title: 'Date',
//             dataIndex: 'date',
//             key: 'date',
//             width: 120,
//             render: (date) => date ? moment(date).format('DD-MM-YYYY') : 'N/A'
//         },
//         {
//             title: 'First In Time',
//             dataIndex: 'first_in',
//             key: 'first_in',
//             width: 120,
//             render: (time) => (
//                 <Tag color="red">{time}</Tag>
//             )
//         }
//     ];

//     return (
//         <div>
//             <h1>Manager Dashboard</h1>
            
//             <Row gutter={16} style={{ marginBottom: 24 }}>
//                 <Col xs={24} sm={12} lg={6}>
//                     <Card>
//                         <Statistic
//                             title="Team Size"
//                             value={stats.teamSize}
//                             prefix={<TeamOutlined />}
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
//                             title="Approved This Month"
//                             value={stats.approvedThisMonth}
//                             prefix={<CheckCircleOutlined />}
//                             valueStyle={{ color: '#52c41a' }}
//                         />
//                     </Card>
//                 </Col>
//                 <Col xs={24} sm={12} lg={6}>
//                     <Card>
//                         <Statistic
//                             title="Team On Leave Today"
//                             value={stats.teamOnLeaveToday}
//                             prefix={<FileTextOutlined />}
//                             valueStyle={{ color: '#722ed1' }}
//                         />
//                     </Card>
//                 </Col>
//             </Row>

//             <Row gutter={16} style={{ marginBottom: 24 }}>
//                 <Col xs={24}>
//                     <Card title="Late Comers - Logged in After 12:15 PM (Last 7 Days)">
//                         <Table
//                             dataSource={lateComers}
//                             columns={lateComersColumns}
//                             rowKey={(record) => `${record.employee_code}-${record.date}`}
//                             size="small"
//                             pagination={{ pageSize: 10, showSizeChanger: true }}
//                             loading={loading}
//                         />
//                     </Card>
//                 </Col>
//             </Row>

//             <Row gutter={16}>
//                 <Col xs={24} lg={16}>
//                     <Card title="Pending Leave Approvals">
//                         <Table
//                             dataSource={pendingLeaves}
//                             columns={leaveColumns}
//                             rowKey="id"
//                             size="small"
//                         />
//                     </Card>
//                 </Col>
//                 <Col xs={24} lg={8}>
//                     <Card title="Team Members">
//                         <Table
//                             dataSource={teamMembers}
//                             columns={[
//                                 { title: 'Name', dataIndex: 'name', key: 'name' },
//                                 { title: 'Designation', dataIndex: 'designation', key: 'designation' }
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

// export default ManagerDashboard;


import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Space } from 'antd';
import {
    TeamOutlined,
    FileTextOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import { getPendingLeaves } from '../../services/leaveService';
import { gettotalhoursforcalendar } from '../../services/attendanceService';
import api from '../../services/api';
import moment from 'moment-timezone';
import CalendarView from '../Calendar/CalendarView';
const ManagerDashboard = () => {
    const [stats, setStats] = useState({
        teamSize: 0,
        pendingApprovals: 0,
        approvedThisMonth: 0,
        teamOnLeaveToday: 0
    });
    const [pendingLeaves, setPendingLeaves] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
    
    // Timer states
    const [employeeStats, setEmployeeStats] = useState({
        daily: 0,
        weekly: 0,
        monthly: 0
    });
    const [todayPunch, setTodayPunch] = useState(null);
    const [liveWorkingTime, setLiveWorkingTime] = useState('0:00:00');
    const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(false);

    const IST_TIMEZONE = 'Asia/Kolkata';

    useEffect(() => {
        moment.tz.setDefault(IST_TIMEZONE);
        fetchDashboardData();
    }, []);

    // Live timer effect
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

    const fetchDashboardData = async () => {
        try {
            const pendingData = await getPendingLeaves();
            const teamData = await api.get('/employees/my-team');
            
            setStats({
                teamSize: teamData.data?.data?.length || 0,
                pendingApprovals: pendingData.data.length,
                approvedThisMonth: 0,
                teamOnLeaveToday: 0
            });

            // Fetch upcoming birthdays from team members
            const employees = teamData.data?.data || [];
            const birthdays = employees
                .filter(e => e.date_of_birth)
                .map(e => ({
                    ...e,
                    birthday: moment(e.date_of_birth).month(moment().month()).year(moment().year())
                }))
                .filter(e => e.birthday.isAfter(moment()) && e.birthday.isBefore(moment().add(30, 'days')))
                .sort((a, b) => a.birthday - b.birthday)
                .slice(0, 5);

            setPendingLeaves(pendingData.data.slice(0, 10));
            setTeamMembers(employees);
            setUpcomingBirthdays(birthdays);

            // Fetch manager's attendance data for timer
            const startOfMonth = moment.tz(IST_TIMEZONE).startOf('month').format('YYYY-MM-DD');
            const endDate = moment.tz(IST_TIMEZONE).format('YYYY-MM-DD');
            const attendanceData = await gettotalhoursforcalendar(startOfMonth, endDate);
            calculateEmployeeStats(attendanceData.data);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    const leaveColumns = [
        {
            title: 'Employee',
            dataIndex: 'employee_name',
            key: 'employee_name'
        },
        {
            title: 'Leave Type',
            dataIndex: 'leave_name',
            key: 'leave_name'
        },
        {
            title: 'From',
            dataIndex: 'from_date',
            key: 'from_date',
            render: (date) => new Date(date).toLocaleDateString()
        },
        {
            title: 'Days',
            dataIndex: 'number_of_days',
            key: 'number_of_days'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => <Tag color="orange">{status.toUpperCase()}</Tag>
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

    return (
        <div>
            <h1>Manager Dashboard</h1>
            
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
                        <Statistic
                            title="Monthly Total"
                            value={convertDecimalToTime(employeeStats.monthly)}
                            prefix={<CalendarOutlined />}
                            valueStyle={{ color: '#722ed1', fontSize: 24 }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Team Statistics */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Team Size"
                            value={stats.teamSize}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Pending Approvals"
                            value={stats.pendingApprovals}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Approved This Month"
                            value={stats.approvedThisMonth}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Team On Leave Today"
                            value={stats.teamOnLeaveToday}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 24 }}>
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

            {/* <Row gutter={16}>
                <Col xs={24} lg={16}>
                    <Card title="Team Members">
                        <Table
                            dataSource={teamMembers}
                            columns={[
                                { title: 'Name', dataIndex: 'name', key: 'name' },
                                { title: 'Designation', dataIndex: 'designation', key: 'designation' }
                            ]}
                            pagination={{ pageSize: 10, showSizeChanger: true }}
                            rowKey="id"
                            size="small"
                        />
                    </Card>
                </Col>
            </Row> */}

                            <Col xs={24} lg={24}>       
                
                                <CalendarView/>

                         </Col>

        </div>
    );
};

export default ManagerDashboard;
