// import React, { useEffect, useState } from 'react';
// import { Card, Row, Col, Statistic, Table, Tag } from 'antd';
// import {
//     TeamOutlined,
//     ClockCircleOutlined,
//     FileTextOutlined,
//     CheckCircleOutlined
// } from '@ant-design/icons';
// import { getPendingLeaves } from '../../services/leaveService';

// const TLDashboard = () => {
//     const [stats, setStats] = useState({
//         teamSize: 0,
//         pendingApprovals: 0,
//         approvedToday: 0
//     });
//     const [pendingLeaves, setPendingLeaves] = useState([]);

//     useEffect(() => {
//         fetchDashboardData();
//     }, []);

//     const fetchDashboardData = async () => {
//         try {
//             const pendingData = await getPendingLeaves();
            
//             setStats({
//                 teamSize: 0, // Get from API
//                 pendingApprovals: pendingData.data.length,
//                 approvedToday: 0
//             });

//             setPendingLeaves(pendingData.data);

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
//             render: (date) => new Date(date).toLocaleDateString()
//         },
//         {
//             title: 'To Date',
//             dataIndex: 'to_date',
//             key: 'to_date',
//             render: (date) => new Date(date).toLocaleDateString()
//         },
//         {
//             title: 'Days',
//             dataIndex: 'number_of_days',
//             key: 'number_of_days'
//         }
//     ];

//     return (
//         <div>
//             <h1>Team Lead Dashboard</h1>
            
//             <Row gutter={16} style={{ marginBottom: 24 }}>
//                 <Col xs={24} sm={12} lg={8}>
//                     <Card>
//                         <Statistic
//                             title="Team Members"
//                             value={stats.teamSize}
//                             prefix={<TeamOutlined />}
//                             valueStyle={{ color: '#1890ff' }}
//                         />
//                     </Card>
//                 </Col>
//                 <Col xs={24} sm={12} lg={8}>
//                     <Card>
//                         <Statistic
//                             title="Pending Approvals"
//                             value={stats.pendingApprovals}
//                             prefix={<ClockCircleOutlined />}
//                             valueStyle={{ color: '#fa8c16' }}
//                         />
//                     </Card>
//                 </Col>
//                 <Col xs={24} sm={12} lg={8}>
//                     <Card>
//                         <Statistic
//                             title="Approved Today"
//                             value={stats.approvedToday}
//                             prefix={<CheckCircleOutlined />}
//                             valueStyle={{ color: '#52c41a' }}
//                         />
//                     </Card>
//                 </Col>
//             </Row>

//             <Row gutter={16}>
//                 <Col xs={24}>
//                     <Card title="Leave Requests Pending Your Approval">
//                         <Table
//                             dataSource={pendingLeaves}
//                             columns={leaveColumns}
//                             rowKey="id"
//                         />
//                     </Card>
//                 </Col>
//             </Row>
//         </div>
//     );
// };

// export default TLDashboard;


import React, { useEffect, useState, useRef } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Space, Modal, Input, message, Dropdown, Button, Typography } from 'antd';
import {
    TeamOutlined,
    ClockCircleOutlined,
    FileTextOutlined,
    CheckCircleOutlined,
    CalendarOutlined,
    UserOutlined,
    CheckOutlined,
    CloseOutlined,
    PauseOutlined,
    DownOutlined
} from '@ant-design/icons';
import moment from 'moment-timezone';
import CalendarView from '../Calendar/CalendarView';
import { getPendingLeaves, approveLeave, rejectLeave, holdLeave } from '../../services/leaveService';
import { gettotalhoursforcalendar } from '../../services/attendanceService';
import { getAllEmployees } from '../../services/employeeService';

const { TextArea } = Input;
const { Text } = Typography;

const TLDashboard = () => {
    const [stats, setStats] = useState({
        teamSize: 0,
        pendingApprovals: 0,
        approvedToday: 0
    });
    const [pendingLeaves, setPendingLeaves] = useState([]);
    const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState(null);
    const [employeeStats, setEmployeeStats] = useState({
        daily: 0,
        weekly: 0,
        monthly: 0
    });
    const [todayPunch, setTodayPunch] = useState(null);
    const [liveWorkingTime, setLiveWorkingTime] = useState('0:00:00');
    const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(false);
    const pollingIntervalRef = useRef(null);

    // Leave modal states
    const [leaveModalVisible, setLeaveModalVisible] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [comments, setComments] = useState('');
    const [actionType, setActionType] = useState('');
    const [loading, setLoading] = useState(false);

    const IST_TIMEZONE = 'Asia/Kolkata';

    useEffect(() => {
        moment.tz.setDefault(IST_TIMEZONE);
        
        // Get user info from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            if (user.name) setUserName(user.name);
            if (user.id) setUserId(user.id);
        }

        // Fetch data immediately on mount
        fetchDashboardData();

        // Set up polling interval for live updates
        pollingIntervalRef.current = setInterval(() => {
            fetchDashboardData();
        }, 30000); // Poll every 30 seconds

        // Cleanup interval on unmount
        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, [userId]);

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

            setStats(prevStats => ({
                ...prevStats,
                pendingApprovals: pendingData.data.length
            }));

            setPendingLeaves(pendingData.data);

            // Fetch attendance data for today's hours
            const startOfMonth = moment.tz(IST_TIMEZONE).startOf('month').format('YYYY-MM-DD');
            const endDate = moment.tz(IST_TIMEZONE).format('YYYY-MM-DD');
            const attendanceData = await gettotalhoursforcalendar(startOfMonth, endDate);
            calculateEmployeeStats(attendanceData.data);

            // Fetch team members' birthdays if userId is available
            if (userId) {
                await fetchTeamBirthdays();
            }

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    const fetchTeamBirthdays = async () => {
        try {
            const employeesData = await getAllEmployees();
            const allEmployees = employeesData.data;

            // Filter employees who report to this TL (manager_id matches userId)
            const teamMembers = allEmployees.filter(emp => emp.manager_id === userId);

            const now = moment();
            const next30Days = moment().add(30, 'days');

            const birthdays = teamMembers
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

            setUpcomingBirthdays(birthdays);
            setStats(prevStats => ({
                ...prevStats,
                teamSize: teamMembers.length
            }));

        } catch (error) {
            console.error('Error fetching team birthdays:', error);
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
            title: 'From Date',
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

    return (
        <div>
            <h1>Welcome, {userName}!</h1>

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

            <Row gutter={16}>
                <Col xs={24} lg={14}>
                    <Card title="Leave Requests Pending Your Approval">
                        <Table
                            dataSource={pendingLeaves}
                            columns={leaveColumns}
                            rowKey="id"
                            size="small"
                            scroll={{ x: 600 }}
                            pagination={false}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={10}>
                    <Card title="Team Member Birthdays">
                        <Table
                            dataSource={upcomingBirthdays}
                            columns={birthdayColumns}
                            pagination={false}
                            rowKey="id"
                            size="small"
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={24}>       
                
                                <CalendarView/>

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

export default TLDashboard;
