import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag } from 'antd';
import {
    TeamOutlined,
    FileTextOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import { getPendingLeaves } from '../../services/leaveService';
import { getFullEmployeeAttendance } from '../../services/attendanceService';
import api from '../../services/api';
import moment from 'moment';

const ManagerDashboard = () => {
    const [stats, setStats] = useState({
        teamSize: 0,
        pendingApprovals: 0,
        approvedThisMonth: 0,
        teamOnLeaveToday: 0
    });
    const [pendingLeaves, setPendingLeaves] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [lateComers, setLateComers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDashboardData();
        fetchLateComers();
    }, []);

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

            setPendingLeaves(pendingData.data.slice(0, 10));
            setTeamMembers(teamData.data?.data || []);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    const fetchLateComers = async () => {
        try {
            setLoading(true);
            // Get last week's date range
            const startDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
            const endDate = moment().format('YYYY-MM-DD');
            
            const response = await getFullEmployeeAttendance(startDate, endDate);
            const attendanceData = response.data || [];

            // Define late threshold (after 12:15 PM)
            const lateThreshold = '12:15:00';

            // Filter late comers - people who logged in after 12:15 PM
            const lateEmployees = attendanceData.filter(record => {
                if (record.first_in && record.first_in > lateThreshold) {
                    return true;
                }
                return false;
            });

            setLateComers(lateEmployees);
        } catch (error) {
            console.error('Error fetching late comers:', error);
        } finally {
            setLoading(false);
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

    const lateComersColumns = [
        {
            title: 'Employee Code',
            dataIndex: 'employee_code',
            key: 'employee_code',
            width: 150
        },
        {
            title: 'Name',
            dataIndex: 'employee_name',
            key: 'employee_name',
            width: 200
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            width: 120,
            render: (date) => date ? moment(date).format('DD-MM-YYYY') : 'N/A'
        },
        {
            title: 'First In Time',
            dataIndex: 'first_in',
            key: 'first_in',
            width: 120,
            render: (time) => (
                <Tag color="red">{time}</Tag>
            )
        }
    ];

    return (
        <div>
            <h1>Manager Dashboard</h1>
            
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
                <Col xs={24}>
                    <Card title="Late Comers - Logged in After 12:15 PM (Last 7 Days)">
                        <Table
                            dataSource={lateComers}
                            columns={lateComersColumns}
                            rowKey={(record) => `${record.employee_code}-${record.date}`}
                            size="small"
                            pagination={{ pageSize: 10, showSizeChanger: true }}
                            loading={loading}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} lg={16}>
                    <Card title="Pending Leave Approvals">
                        <Table
                            dataSource={pendingLeaves}
                            columns={leaveColumns}
                            rowKey="id"
                            size="small"
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Team Members">
                        <Table
                            dataSource={teamMembers}
                            columns={[
                                { title: 'Name', dataIndex: 'name', key: 'name' },
                                { title: 'Designation', dataIndex: 'designation', key: 'designation' }
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

export default ManagerDashboard;
