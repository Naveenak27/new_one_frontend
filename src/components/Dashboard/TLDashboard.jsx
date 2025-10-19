import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag } from 'antd';
import {
    TeamOutlined,
    ClockCircleOutlined,
    FileTextOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import { getPendingLeaves } from '../../services/leaveService';

const TLDashboard = () => {
    const [stats, setStats] = useState({
        teamSize: 0,
        pendingApprovals: 0,
        approvedToday: 0
    });
    const [pendingLeaves, setPendingLeaves] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const pendingData = await getPendingLeaves();
            
            setStats({
                teamSize: 0, // Get from API
                pendingApprovals: pendingData.data.length,
                approvedToday: 0
            });

            setPendingLeaves(pendingData.data);

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
            render: (date) => new Date(date).toLocaleDateString()
        },
        {
            title: 'To Date',
            dataIndex: 'to_date',
            key: 'to_date',
            render: (date) => new Date(date).toLocaleDateString()
        },
        {
            title: 'Days',
            dataIndex: 'number_of_days',
            key: 'number_of_days'
        }
    ];

    return (
        <div>
            <h1>Team Lead Dashboard</h1>
            
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={8}>
                    <Card>
                        <Statistic
                            title="Team Members"
                            value={stats.teamSize}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card>
                        <Statistic
                            title="Pending Approvals"
                            value={stats.pendingApprovals}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card>
                        <Statistic
                            title="Approved Today"
                            value={stats.approvedToday}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24}>
                    <Card title="Leave Requests Pending Your Approval">
                        <Table
                            dataSource={pendingLeaves}
                            columns={leaveColumns}
                            rowKey="id"
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default TLDashboard;
