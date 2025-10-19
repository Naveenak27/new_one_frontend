// import React, { useEffect, useState } from 'react';
// import { Card, Row, Col, Statistic, Table, Tag, Progress } from 'antd';
// import {
//     FileTextOutlined,
//     CheckCircleOutlined,
//     ClockCircleOutlined,
//     CalendarOutlined
// } from '@ant-design/icons';
// import { getMyLeaves, getLeaveBalance } from '../../services/leaveService';
// import moment from 'moment';

// const EmployeeDashboard = () => {
//     const [stats, setStats] = useState({
//         totalLeaves: 0,
//         pendingLeaves: 0,
//         approvedLeaves: 0,
//         rejectedLeaves: 0
//     });
//     const [leaveBalance, setLeaveBalance] = useState([]);
//     const [recentLeaves, setRecentLeaves] = useState([]);

//     useEffect(() => {
//         fetchDashboardData();
//     }, []);

//     const fetchDashboardData = async () => {
//         try {
//             const leavesData = await getMyLeaves();
//             const leaves = leavesData.data;

//             const balanceData = await getLeaveBalance();
            
//             setStats({
//                 totalLeaves: leaves.length,
//                 pendingLeaves: leaves.filter(l => l.status.includes('pending') || l.status.includes('approved_by')).length,
//                 approvedLeaves: leaves.filter(l => l.status === 'approved').length,
//                 rejectedLeaves: leaves.filter(l => l.status === 'rejected').length
//             });

//             setLeaveBalance(balanceData.data);
//             setRecentLeaves(leaves.slice(0, 5));

//         } catch (error) {
//             console.error('Error fetching dashboard data:', error);
//         }
//     };

//     const leaveColumns = [
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
//             title: 'To Date',
//             dataIndex: 'to_date',
//             key: 'to_date',
//             render: (date) => moment(date).format('DD MMM YYYY')
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
//             render: (status) => {
//                 const colors = {
//                     pending: 'orange',
//                     approved_by_tl: 'blue',
//                     approved_by_manager: 'cyan',
//                     approved: 'green',
//                     rejected: 'red'
//                 };
//                 return <Tag color={colors[status]}>{status.replace(/_/g, ' ').toUpperCase()}</Tag>;
//             }
//         }
//     ];

//     const balanceColumns = [
//         {
//             title: 'Leave Type',
//             dataIndex: 'leave_name',
//             key: 'leave_name'
//         },
//         {
//             title: 'Credited',
//             dataIndex: 'credited',
//             key: 'credited'
//         },
//         {
//             title: 'Used',
//             dataIndex: 'used',
//             key: 'used'
//         },
//         {
//             title: 'Balance',
//             dataIndex: 'balance',
//             key: 'balance',
//             render: (balance, record) => (
//                 <div>
//                     <div>{balance}</div>
//                     <Progress 
//                         percent={((record.credited - balance) / record.credited * 100).toFixed(0)} 
//                         size="small"
//                         status={balance > 0 ? 'normal' : 'exception'}
//                     />
//                 </div>
//             )
//         }
//     ];

//     return (
//         <div>
//             <h1>My Dashboard</h1>
            
//             <Row gutter={16} style={{ marginBottom: 24 }}>
//                 <Col xs={24} sm={12} lg={6}>
//                     <Card>
//                         <Statistic
//                             title="Total Applications"
//                             value={stats.totalLeaves}
//                             prefix={<FileTextOutlined />}
//                             valueStyle={{ color: '#1890ff' }}
//                         />
//                     </Card>
//                 </Col>
//                 <Col xs={24} sm={12} lg={6}>
//                     <Card>
//                         <Statistic
//                             title="Pending"
//                             value={stats.pendingLeaves}
//                             prefix={<ClockCircleOutlined />}
//                             valueStyle={{ color: '#fa8c16' }}
//                         />
//                     </Card>
//                 </Col>
//                 <Col xs={24} sm={12} lg={6}>
//                     <Card>
//                         <Statistic
//                             title="Approved"
//                             value={stats.approvedLeaves}
//                             prefix={<CheckCircleOutlined />}
//                             valueStyle={{ color: '#52c41a' }}
//                         />
//                     </Card>
//                 </Col>
//                 <Col xs={24} sm={12} lg={6}>
//                     <Card>
//                         <Statistic
//                             title="Rejected"
//                             value={stats.rejectedLeaves}
//                             prefix={<CalendarOutlined />}
//                             valueStyle={{ color: '#f5222d' }}
//                         />
//                     </Card>
//                 </Col>
//             </Row>

//             <Row gutter={16}>
//                 <Col xs={24} lg={12}>
//                     <Card title="My Leave Balance">
//                         <Table
//                             dataSource={leaveBalance}
//                             columns={balanceColumns}
//                             pagination={false}
//                             rowKey="id"
//                         />
//                     </Card>
//                 </Col>
//                 <Col xs={24} lg={12}>
//                     <Card title="Recent Leave Applications">
//                         <Table
//                             dataSource={recentLeaves}
//                             columns={leaveColumns}
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

// export default EmployeeDashboard;
import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Progress, Space, Typography } from 'antd';
import {
    FileTextOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
    LoginOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { getMyLeaves, getLeaveBalance } from '../../services/leaveService';
import { getMyAttendance } from '../../services/attendanceService';
import moment from 'moment-timezone';

const { Text } = Typography;

const EmployeeDashboard = () => {
    const [stats, setStats] = useState({
        totalLeaves: 0,
        pendingLeaves: 0,
        approvedLeaves: 0,
        rejectedLeaves: 0
    });
    const [leaveBalance, setLeaveBalance] = useState([]);
    const [recentLeaves, setRecentLeaves] = useState([]);
    const [employeeStats, setEmployeeStats] = useState({
        daily: 0,
        weekly: 0,
        monthly: 0
    });
    const [todayPunch, setTodayPunch] = useState(null);
    const [liveWorkingTime, setLiveWorkingTime] = useState('0:00:00');
    const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(false);

    // Set default timezone to IST
    const IST_TIMEZONE = 'Asia/Kolkata';

    useEffect(() => {
        // Set default timezone for all moment operations
        moment.tz.setDefault(IST_TIMEZONE);
        fetchDashboardData();
    }, []);

    // Helper function to convert 24-hour time to 12-hour AM/PM format
    const convertTo12Hour = (time24) => {
        if (!time24) return '-';
        
        const [hourString, minute, second] = time24.split(':');
        let hour = parseInt(hourString);
        
        const period = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12; // Convert to 12-hour format, 0 becomes 12
        
        return `${hour}:${minute}:${second} ${period}`;
    };

    // Live timer effect
    useEffect(() => {
        let interval;

        if (isCurrentlyWorking && todayPunch) {
            interval = setInterval(() => {
                const calculatedTime = calculateLiveWorkingTime();
                setLiveWorkingTime(calculatedTime);
            }, 1000); // Update every second
        } else if (todayPunch && !isCurrentlyWorking) {
            // If not currently working, just show the total hours
            setLiveWorkingTime(convertDecimalToTimeWithSeconds(todayPunch.total_hours));
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isCurrentlyWorking, todayPunch]);

    // Calculate live working time in IST with seconds
    const calculateLiveWorkingTime = () => {
        if (!todayPunch || !todayPunch.pairs) return '0:00:00';

        let totalSeconds = 0;
        const now = moment.tz(IST_TIMEZONE);

        todayPunch.pairs.forEach((pair) => {
            if (pair.in && pair.out) {
                // Completed pair - use the stored duration (convert minutes to seconds)
                totalSeconds += (pair.duration || 0) * 60;
            } else if (pair.in && !pair.out) {
                // Currently active pair - calculate live time in IST with seconds
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

    // Helper function to convert decimal hours to HH:MM:SS format
    const convertDecimalToTimeWithSeconds = (decimalHours) => {
        if (!decimalHours || isNaN(decimalHours)) return '0:00:00';
        
        const totalSeconds = Math.round(decimalHours * 3600);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Helper function to convert decimal hours to HH:MM format (for weekly/monthly display)
    const convertDecimalToTime = (decimalHours) => {
        if (!decimalHours || isNaN(decimalHours)) return '0:00';
        
        const hours = Math.floor(decimalHours);
        const minutes = Math.round((decimalHours - hours) * 60);
        
        return `${hours}:${minutes.toString().padStart(2, '0')}`;
    };

    // Calculate employee statistics in IST
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

            // Daily total (today)
            if (recordDate.isSame(today, 'day')) {
                dailyTotal += hours;
                todayRecord = record;
            }

            // Weekly total (current week)
            if (recordDate.isSameOrAfter(startOfWeek, 'day') && recordDate.isSameOrBefore(today, 'day')) {
                weeklyTotal += hours;
            }

            // Monthly total (current month)
            if (recordDate.isSameOrAfter(startOfMonth, 'day') && recordDate.isSameOrBefore(today, 'day')) {
                monthlyTotal += hours;
            }
        });

        setEmployeeStats({
            daily: dailyTotal,
            weekly: weeklyTotal,
            monthly: monthlyTotal
        });

        setTodayPunch(todayRecord);

        // Check if currently working (last pair has IN but no OUT)
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
            // Fetch leave data
            const leavesData = await getMyLeaves();
            const leaves = leavesData.data;

            const balanceData = await getLeaveBalance();
            
            setStats({
                totalLeaves: leaves.length,
                pendingLeaves: leaves.filter(l => l.status.includes('pending') || l.status.includes('approved_by')).length,
                approvedLeaves: leaves.filter(l => l.status === 'approved').length,
                rejectedLeaves: leaves.filter(l => l.status === 'rejected').length
            });

            setLeaveBalance(balanceData.data);
            setRecentLeaves(leaves.slice(0, 5));

            // Fetch attendance data in IST
            const startOfMonth = moment.tz(IST_TIMEZONE).startOf('month').format('YYYY-MM-DD');
            const endDate = moment.tz(IST_TIMEZONE).format('YYYY-MM-DD');
            const attendanceData = await getMyAttendance(startOfMonth, endDate);
            
            calculateEmployeeStats(attendanceData.data);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    const leaveColumns = [
        {
            title: 'Leave Type',
            dataIndex: 'leave_name',
            key: 'leave_name'
        },
        {
            title: 'From Date',
            dataIndex: 'from_date',
            key: 'from_date',
            render: (date) => moment.tz(date, IST_TIMEZONE).format('DD MMM YYYY')
        },
        {
            title: 'To Date',
            dataIndex: 'to_date',
            key: 'to_date',
            render: (date) => moment.tz(date, IST_TIMEZONE).format('DD MMM YYYY')
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
            render: (status) => {
                const colors = {
                    pending: 'orange',
                    approved_by_tl: 'blue',
                    approved_by_manager: 'cyan',
                    approved: 'green',
                    rejected: 'red'
                };
                return <Tag color={colors[status]}>{status.replace(/_/g, ' ').toUpperCase()}</Tag>;
            }
        }
    ];

    const balanceColumns = [
        {
            title: 'Leave Type',
            dataIndex: 'leave_name',
            key: 'leave_name'
        },
        {
            title: 'Credited',
            dataIndex: 'credited',
            key: 'credited'
        },
        {
            title: 'Used',
            dataIndex: 'used',
            key: 'used'
        },
        {
            title: 'Balance',
            dataIndex: 'balance',
            key: 'balance',
            render: (balance, record) => (
                <div>
                    <div>{balance}</div>
                    <Progress 
                        percent={((record.credited - balance) / record.credited * 100).toFixed(0)} 
                        size="small"
                        status={balance > 0 ? 'normal' : 'exception'}
                    />
                </div>
            )
        }
    ];

    const punchColumns = [
        {
            title: '#',
            key: 'index',
            width: 60,
            render: (_, __, index) => index + 1
        },
        {
            title: 'IN Time',
            dataIndex: 'in',
            key: 'in',
            render: (time) => time ? (
                <Space>
                    <LoginOutlined style={{ color: '#52c41a' }} />
                    <Text strong>{convertTo12Hour(time)}</Text>
                </Space>
            ) : <Text type="secondary">-</Text>
        },
        {
            title: 'OUT Time',
            dataIndex: 'out',
            key: 'out',
            render: (time) => time ? (
                <Space>
                    <LogoutOutlined style={{ color: '#f5222d' }} />
                    <Text strong>{convertTo12Hour(time)}</Text>
                </Space>
            ) : (
                <Tag color="processing" icon={<ClockCircleOutlined />}>
                    Active
                </Tag>
            )
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
            key: 'duration',
            render: (duration, record) => {
                if (!record.in) return <Text type="secondary">-</Text>;
                
                if (!record.out) {
                    // Currently active - show live duration
                    return (
                        <Tag color="processing" icon={<ClockCircleOutlined />}>
                            In Progress
                        </Tag>
                    );
                }
                
                const hours = Math.floor(duration / 60);
                const minutes = Math.round(duration % 60);
                return (
                    <Tag color="blue">
                        {hours}h {minutes}m
                    </Tag>
                );
            }
        }
    ];

    return (
        <div>
            <h1>My Dashboard</h1>
            
            {/* Attendance Statistics */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title={
                                <Space>
                                    <span>Today's Working Hours</span>
                                    {isCurrentlyWorking && (
                                        <Tag color="success" icon={<ClockCircleOutlined />}>
                                            Live
                                        </Tag>
                                    )}
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
                            title="This Week's Total"
                            value={convertDecimalToTime(employeeStats.weekly)}
                            prefix={<CalendarOutlined />}
                            valueStyle={{ color: '#52c41a', fontSize: 24 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="This Month's Total"
                            value={convertDecimalToTime(employeeStats.monthly)}
                            prefix={<CalendarOutlined />}
                            valueStyle={{ color: '#722ed1', fontSize: 24 }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Today's Punch Details */}
            {todayPunch && (
                <Card 
                    title={
                        <Space direction="vertical" size={0}>
                            <Text strong style={{ fontSize: 16 }}>Today's Attendance</Text>
                            <Space>
                                <Text type="secondary" style={{ fontSize: 14 }}>
                                    {moment.tz(todayPunch.date, IST_TIMEZONE).format('DD MMM YYYY')}
                                </Text>
                                <Text type="secondary">•</Text>
                                <Text type="secondary" style={{ fontSize: 14 }}>
                                    {moment.tz(todayPunch.date, IST_TIMEZONE).format('dddd')}
                                </Text>
                            </Space>
                        </Space>
                    }
                    style={{ marginBottom: 24 }}
                    extra={
                        <Space size="large">
                            {todayPunch.first_in && (
                                <Space direction="vertical" size={0}>
                                    <Text type="secondary" style={{ fontSize: 12 }}>First IN</Text>
                                    <Tag color="green" icon={<LoginOutlined />}>
                                        {convertTo12Hour(todayPunch.first_in)}
                                    </Tag>
                                </Space>
                            )}
                            {todayPunch.last_out && (
                                <Space direction="vertical" size={0}>
                                    <Text type="secondary" style={{ fontSize: 12 }}>Last OUT</Text>
                                    <Tag color="red" icon={<LogoutOutlined />}>
                                        {convertTo12Hour(todayPunch.last_out)}
                                    </Tag>
                                </Space>
                            )}
                            <Space direction="vertical" size={0}>
                                <Text type="secondary" style={{ fontSize: 12 }}>Total Hours</Text>
                                <Tag color="blue" style={{ fontSize: 14 }}>
                                    <ClockCircleOutlined /> {liveWorkingTime}
                                </Tag>
                            </Space>
                        </Space>
                    }
                >
                    {todayPunch.pairs && todayPunch.pairs.length > 0 ? (
                        <Table
                            dataSource={todayPunch.pairs}
                            columns={punchColumns}
                            pagination={false}
                            size="small"
                            rowKey={(item, index) => `punch_${index}`}
                        />
                    ) : (
                        <Text type="secondary">No punch details available for today</Text>
                    )}
                </Card>
            )}

            {/* Leave Statistics */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Applications"
                            value={stats.totalLeaves}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Pending"
                            value={stats.pendingLeaves}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Approved"
                            value={stats.approvedLeaves}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Rejected"
                            value={stats.rejectedLeaves}
                            prefix={<CalendarOutlined />}
                            valueStyle={{ color: '#f5222d' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Leave Tables */}
            <Row gutter={16}>
                <Col xs={24} lg={12}>
                    <Card title="My Leave Balance">
                        <Table
                            dataSource={leaveBalance}
                            columns={balanceColumns}
                            pagination={false}
                            rowKey="id"
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="Recent Leave Applications">
                        <Table
                            dataSource={recentLeaves}
                            columns={leaveColumns}
                            pagination={false}
                            rowKey="id"
                            size="small"
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default EmployeeDashboard;

