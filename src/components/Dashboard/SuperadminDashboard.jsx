import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag } from 'antd';
import {
    UserOutlined,
    TeamOutlined,
    FileTextOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import { getAllEmployees } from '../../services/employeeService';
import { getAllLeaves } from '../../services/leaveService';
import { getAllRoles } from '../../services/roleService';
import api from '../../services/api';

const SuperadminDashboard = () => {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        activeEmployees: 0,
        totalRoles: 0,
        totalLeaves: 0,
        pendingLeaves: 0,
        approvedLeaves: 0,
        rejectedLeaves: 0
    });
    const [recentLeaves, setRecentLeaves] = useState([]);
    const [employeesByRole, setEmployeesByRole] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Get employees
            const employeesData = await getAllEmployees();
            const employees = employeesData.data;
            
            // Get roles
            const rolesData = await getAllRoles();
            
            // Get all leaves
            const leavesData = await getAllLeaves();
            const leaves = leavesData.data;

            // Calculate stats
            setStats({
                totalEmployees: employees.length,
                activeEmployees: employees.filter(e => e.is_active).length,
                totalRoles: rolesData.data.length,
                totalLeaves: leaves.length,
                pendingLeaves: leaves.filter(l => l.status === 'pending' || l.status === 'approved_by_tl' || l.status === 'approved_by_manager').length,
                approvedLeaves: leaves.filter(l => l.status === 'approved').length,
                rejectedLeaves: leaves.filter(l => l.status === 'rejected').length
            });

            // Recent leaves
            setRecentLeaves(leaves.slice(0, 5));

            // Group employees by role
            const roleGroups = employees.reduce((acc, emp) => {
                const role = emp.role_name;
                if (!acc[role]) {
                    acc[role] = { role_name: role, count: 0 };
                }
                acc[role].count++;
                return acc;
            }, {});
            setEmployeesByRole(Object.values(roleGroups));

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

    return (
        <div>
            <h1>Superadmin Dashboard</h1>
            
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
                            title="Active Employees"
                            value={stats.activeEmployees}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Roles"
                            value={stats.totalRoles}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Leaves"
                            value={stats.totalLeaves}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#13c2c2' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={8}>
                    <Card>
                        <Statistic
                            title="Pending Approvals"
                            value={stats.pendingLeaves}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card>
                        <Statistic
                            title="Approved Leaves"
                            value={stats.approvedLeaves}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card>
                        <Statistic
                            title="Rejected Leaves"
                            value={stats.rejectedLeaves}
                            prefix={<CloseCircleOutlined />}
                            valueStyle={{ color: '#f5222d' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} lg={12}>
                    <Card title="Employees by Role">
                        <Table
                            dataSource={employeesByRole}
                            columns={[
                                { title: 'Role', dataIndex: 'role_name', key: 'role_name' },
                                { title: 'Count', dataIndex: 'count', key: 'count' }
                            ]}
                            pagination={false}
                            rowKey="role_name"
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

export default SuperadminDashboard;
