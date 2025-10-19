import React, { useState, useEffect } from 'react';
import { 
    Card, 
    Table, 
    Tag, 
    Space, 
    Statistic, 
    Row, 
    Col, 
    Empty,
    Avatar,
    Badge,
    Descriptions,
    Divider,
    Typography,
    Alert
} from 'antd';
import { 
    TeamOutlined, 
    UserOutlined, 
    MailOutlined, 
    PhoneOutlined,
    IdcardOutlined,
    ApartmentOutlined,
    CalendarOutlined,
    CrownOutlined,
    UsergroupAddOutlined
} from '@ant-design/icons';
import api from '../services/api';

const { Text, Title } = Typography;

const MyTeamPage = () => {
    const [teamData, setTeamData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchMyTeam();
    }, []);

    const fetchMyTeam = async () => {
        setLoading(true);
        try {
            const response = await api.get('/teams/my-team');
            setTeamData(response.data.data);
        } catch (error) {
            console.error('Failed to fetch team');
        } finally {
            setLoading(false);
        }
    };

    const getRoleColor = (role) => {
        const colors = {
            'superadmin': 'red',
            'hr': 'volcano',
            'manager': 'purple',
            'tl': 'blue',
            'employee': 'green'
        };
        return colors[role?.toLowerCase()] || 'default';
    };

    const getAvatarColor = (index) => {
        const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#1890ff', '#52c41a'];
        return colors[index % colors.length];
    };

    const columns = [
        {
            title: 'Employee',
            key: 'employee',
            width: 280,
            fixed: 'left',
            render: (_, record, index) => (
                <Space size="middle">
                    <Avatar 
                        size={44} 
                        style={{ backgroundColor: getAvatarColor(index) }}
                    >
                        {record.name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <Space direction="vertical" size={0}>
                        <Text strong>{record.name}</Text>
                        <Space size="small">
                            <Tag icon={<IdcardOutlined />} color="blue" style={{ fontSize: 11 }}>
                                {record.employee_id}
                            </Tag>
                        </Space>
                    </Space>
                </Space>
            ),
        },
        {
            title: 'Designation',
            dataIndex: 'designation',
            key: 'designation',
            render: (designation) => (
                <Tag color="purple">{designation}</Tag>
            ),
        },
        {
            title: 'Role',
            dataIndex: 'role_name',
            key: 'role_name',
            render: (role) => (
                <Tag color={getRoleColor(role)}>{role}</Tag>
            ),
        },
        {
            title: 'Department',
            dataIndex: 'department_name',
            key: 'department_name',
            render: (dept) => dept ? (
                <Tag icon={<ApartmentOutlined />} color="cyan">{dept}</Tag>
            ) : (
                <Text type="secondary">Not Assigned</Text>
            ),
        },
        {
            title: 'Contact',
            key: 'contact',
            width: 220,
            render: (_, record) => (
                <Space direction="vertical" size={2}>
                    <Space size="small">
                        <MailOutlined style={{ color: '#1890ff' }} />
                        <Text copyable={{ text: record.email }} style={{ fontSize: 12 }}>
                            {record.email}
                        </Text>
                    </Space>
                    <Space size="small">
                        <PhoneOutlined style={{ color: '#52c41a' }} />
                        <Text style={{ fontSize: 12 }}>{record.phone || 'N/A'}</Text>
                    </Space>
                </Space>
            ),
        },
        {
            title: 'Joined Date',
            dataIndex: 'date_of_joining',
            key: 'date_of_joining',
            align: 'center',
            render: (date) => date ? (
                <Space direction="vertical" size={0}>
                    <CalendarOutlined style={{ color: '#faad14' }} />
                    <Text style={{ fontSize: 12 }}>
                        {new Date(date).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        })}
                    </Text>
                </Space>
            ) : (
                <Text type="secondary">-</Text>
            ),
        },
    ];

    if (loading) {
        return <Card loading={loading} />;
    }

    if (!teamData || teamData.team_size === 0) {
        return (
            <div>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Card bordered={false}>
                            <Space size="middle">
                                <Avatar 
                                    size={48} 
                                    icon={<TeamOutlined />} 
                                    style={{ backgroundColor: '#1890ff' }}
                                />
                                {/* <div>
                                    <Title level={3} style={{ margin: 0 }}>My Team</Title>
                                    <Text type="secondary">View your team members and structure</Text>
                                </div> */}
                            </Space>
                        </Card>
                    </Col>

                    <Col span={24}>
                        <Card bordered={false}>
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                    <Space direction="vertical" size="small">
                                        <Text strong>No Team Members Yet</Text>
                                        <Text type="secondary">
                                            You don't have any team members assigned at the moment
                                        </Text>
                                    </Space>
                                }
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }

    return (
        <div>
            <Row gutter={[16, 16]}>
                {/* Header */}
                <Col span={24}>
                    <Card bordered={false}>
                        <Space size="large" style={{ width: '100%', justifyContent: 'space-between' }}>
                            <Space size="middle">
                                <Avatar 
                                    size={48} 
                                    icon={<TeamOutlined />} 
                                    style={{ backgroundColor: '#1890ff' }}
                                />
                                <div>
                                    <Space align="center">
                                        <Title level={3} style={{ margin: 0 }}>My Team</Title>
                                        <Tag color="green" style={{ fontSize: 14, padding: '4px 12px' }}>
                                            {teamData.team_size} {teamData.team_size === 1 ? 'Member' : 'Members'}
                                        </Tag>
                                    </Space>
                                    {/* <Text type="secondary">View your team members and structure</Text> */}
                                </div>
                            </Space>
                        </Space>
                    </Card>
                </Col>

                {/* Manager Profile Card */}
                {teamData.manager && (
                    <Col span={24}>
                        <Card 
                            bordered={false}
                            title={
                                <Space>
                                    <CrownOutlined style={{ color: '#faad14' }} />
                                    <span>Team Leader Information</span>
                                </Space>
                            }
                        >
                            <Space size="large" align="start" style={{ width: '100%' }}>
                                <Avatar 
                                    size={80} 
                                    icon={<UserOutlined />}
                                    style={{ backgroundColor: '#722ed1' }}
                                >
                                    {teamData.manager.name?.charAt(0)?.toUpperCase()}
                                </Avatar>
                                <Descriptions column={{ xs: 1, sm: 2, md: 3 }} size="middle">
                                    <Descriptions.Item 
                                        label={<Text strong>Name</Text>}
                                    >
                                        <Space>
                                            <Text style={{ fontSize: 16 }}>{teamData.manager.name}</Text>
                                        </Space>
                                    </Descriptions.Item>
                                    <Descriptions.Item 
                                        label={<Text strong>Employee ID</Text>}
                                    >
                                        <Tag icon={<IdcardOutlined />} color="blue">
                                            {teamData.manager.employee_id}
                                        </Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item 
                                        label={<Text strong>Designation</Text>}
                                    >
                                        <Tag color="purple" style={{ fontSize: 13 }}>
                                            {teamData.manager.designation}
                                        </Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item 
                                        label={<Text strong>Email</Text>}
                                    >
                                        <Space size="small">
                                            <MailOutlined style={{ color: '#1890ff' }} />
                                            <Text copyable={{ text: teamData.manager.email }}>
                                                {teamData.manager.email}
                                            </Text>
                                        </Space>
                                    </Descriptions.Item>
                                    <Descriptions.Item 
                                        label={<Text strong>Phone</Text>}
                                    >
                                        <Space size="small">
                                            <PhoneOutlined style={{ color: '#52c41a' }} />
                                            <Text>{teamData.manager.phone || 'N/A'}</Text>
                                        </Space>
                                    </Descriptions.Item>
                                    <Descriptions.Item 
                                        label={<Text strong>Department</Text>}
                                    >
                                        {teamData.manager.department_name ? (
                                            <Tag icon={<ApartmentOutlined />} color="cyan">
                                                {teamData.manager.department_name}
                                            </Tag>
                                        ) : (
                                            <Text type="secondary">Not Assigned</Text>
                                        )}
                                    </Descriptions.Item>
                                </Descriptions>
                            </Space>
                        </Card>
                    </Col>
                )}

                {/* Team Statistics */}
                <Col span={24}>
                    <Row gutter={16}>
                        <Col xs={24} sm={12} lg={8}>
                            <Card bordered={false}>
                                <Statistic
                                    title="Total Team Members"
                                    value={teamData.team_size}
                                    prefix={<UsergroupAddOutlined />}
                                    valueStyle={{ color: '#1890ff' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Card bordered={false}>
                                <Statistic
                                    title="Active Members"
                                    value={teamData.team_members?.filter(m => m.role_name).length || 0}
                                    prefix={<UserOutlined />}
                                    valueStyle={{ color: '#52c41a' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Card bordered={false}>
                                <Statistic
                                    title="Team Status"
                                    value={teamData.team_size > 5 ? 'Large' : teamData.team_size > 2 ? 'Medium' : 'Small'}
                                    prefix={<TeamOutlined />}
                                    valueStyle={{ 
                                        color: teamData.team_size > 5 ? '#52c41a' : teamData.team_size > 2 ? '#1890ff' : '#faad14',
                                        fontSize: 20
                                    }}
                                />
                            </Card>
                        </Col>
                    </Row>
                </Col>

                {/* Team Members Table */}
                <Col span={24}>
                    <Card 
                        bordered={false}
                        title={
                            <Space>
                                <UsergroupAddOutlined />
                                <span>Team Members</span>
                            </Space>
                        }
                    >
                        {teamData.team_members?.length > 0 && (
                            <Alert
                                message={
                                    <Space size="large">
                                        <Space>
                                            <Avatar.Group maxCount={5} size="small">
                                                {teamData.team_members.slice(0, 5).map((member, idx) => (
                                                    <Avatar 
                                                        key={member.id}
                                                        style={{ backgroundColor: getAvatarColor(idx) }}
                                                    >
                                                        {member.name?.charAt(0)?.toUpperCase()}
                                                    </Avatar>
                                                ))}
                                            </Avatar.Group>
                                            <Text>{teamData.team_members.length} team members in total</Text>
                                        </Space>
                                    </Space>
                                }
                                type="info"
                                showIcon
                                style={{ marginBottom: 16 }}
                            />
                        )}

                        <Table
                            dataSource={teamData.team_members}
                            columns={columns}
                            rowKey="id"
                            pagination={{ 
                                pageSize: 8,
                                showSizeChanger: true,
                                showTotal: (total) => `Total ${total} members`,
                                size: 'default'
                            }}
                            size="middle"
                            scroll={{ x: 1000 }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default MyTeamPage;
