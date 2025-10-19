import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Calendar, Badge } from 'antd';
import {
    UserOutlined,
    FileTextOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import { getAllEmployees } from '../../services/employeeService';
import { getPendingLeaves, getAllLeaves } from '../../services/leaveService';
import { getCalendarEvents } from '../../services/calendarService';
import moment from 'moment';

const HRDashboard = () => {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        pendingApprovals: 0,
        todayOnLeave: 0,
        monthLeaves: 0
    });
    const [pendingLeaves, setPendingLeaves] = useState([]);
    const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
    const [calendarEvents, setCalendarEvents] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const employeesData = await getAllEmployees();
            const pendingData = await getPendingLeaves();
            const allLeavesData = await getAllLeaves();
            const allLeaves = allLeavesData.data;

            // Get calendar events for current month
            const currentMonth = moment().month() + 1;
            const currentYear = moment().year();
            const eventsData = await getCalendarEvents(currentMonth, currentYear);

            // Calculate stats
            const today = moment().format('YYYY-MM-DD');
            const todayLeaves = allLeaves.filter(l => 
                l.status === 'approved' && 
                moment(today).isBetween(moment(l.from_date), moment(l.to_date), null, '[]')
            );

            const monthStart = moment().startOf('month').format('YYYY-MM-DD');
            const monthEnd = moment().endOf('month').format('YYYY-MM-DD');
            const monthLeaves = allLeaves.filter(l =>
                l.status === 'approved' &&
                (moment(l.from_date).isBetween(monthStart, monthEnd, null, '[]') ||
                 moment(l.to_date).isBetween(monthStart, monthEnd, null, '[]'))
            );

            // Upcoming birthdays
            const employees = employeesData.data;
            const birthdays = employees
                .filter(e => e.date_of_birth)
                .map(e => ({
                    ...e,
                    birthday: moment(e.date_of_birth).month(moment().month()).year(moment().year())
                }))
                .filter(e => e.birthday.isAfter(moment()) && e.birthday.isBefore(moment().add(30, 'days')))
                .sort((a, b) => a.birthday - b.birthday)
                .slice(0, 5);

            setStats({
                totalEmployees: employees.length,
                pendingApprovals: pendingData.data.length,
                todayOnLeave: todayLeaves.length,
                monthLeaves: monthLeaves.length
            });

            setPendingLeaves(pendingData.data.slice(0, 5));
            setUpcomingBirthdays(birthdays);
            setCalendarEvents(eventsData.data);

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
            title: 'From Date',
            dataIndex: 'from_date',
            key: 'from_date',
            render: (date) => moment(date).format('DD MMM YYYY')
        },
        {
            title: 'Days',
            dataIndex: 'number_of_days',
            key: 'number_of_days'
        }
    ];

    return (
        <div>
            <h1>HR Dashboard</h1>
            
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Employees"
                            value={stats.totalEmployees}
                            prefix={<UserOutlined />}
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
                            title="On Leave Today"
                            value={stats.todayOnLeave}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="This Month Leaves"
                            value={stats.monthLeaves}
                            prefix={<CalendarOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} lg={12}>
                    <Card title="Upcoming Birthdays">
                        <Table
                            dataSource={upcomingBirthdays}
                            columns={[
                                { title: 'Employee', dataIndex: 'name', key: 'name' },
                                { 
                                    title: 'Date', 
                                    dataIndex: 'date_of_birth', 
                                    key: 'date_of_birth',
                                    render: (date) => moment(date).format('DD MMM')
                                }
                            ]}
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

export default HRDashboard;
