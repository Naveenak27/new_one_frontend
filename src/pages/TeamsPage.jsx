// import React, { useState, useEffect } from 'react';
// import { 
//     Card, 
//     Table, 
//     Button, 
//     Space, 
//     Modal, 
//     Form, 
//     Select, 
//     message, 
//     Tag, 
//     Badge,
//     Descriptions,
//     Avatar,
//     Statistic,
//     Row,
//     Col,
//     Divider,
//     Typography
// } from 'antd';
// import { 
//     TeamOutlined, 
//     UserAddOutlined, 
//     EyeOutlined,
//     UserOutlined,
//     MailOutlined,
//     PhoneOutlined,
//     IdcardOutlined,
//     ApartmentOutlined
// } from '@ant-design/icons';
// import api from '../services/api';
// import { useAuth } from '../context/AuthContext';

// const { Text, Title } = Typography;

// const TeamsPage = () => {
//     const [teams, setTeams] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [modalVisible, setModalVisible] = useState(false);
//     const [selectedTeam, setSelectedTeam] = useState(null);
//     const [teamMembers, setTeamMembers] = useState([]);
//     const [assignModalVisible, setAssignModalVisible] = useState(false);
//     const [employees, setEmployees] = useState([]);
//     const [managers, setManagers] = useState([]);
//     const [form] = Form.useForm();
//     const { user } = useAuth();

//     const isHR = ['hr', 'superadmin'].includes(user?.role_name);

//     useEffect(() => {
//         fetchTeams();
//         if (isHR) {
//             fetchEmployees();
//             fetchManagers();
//         }
//     }, []);

//     const fetchTeams = async () => {
//         setLoading(true);
//         try {
//             const response = await api.get('/teams');
//             setTeams(response.data.data || []);
//         } catch (error) {
//             message.error('Failed to fetch teams');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchTeamMembers = async (managerId) => {
//         try {
//             const response = await api.get(`/teams/${managerId}/members`);
//             setTeamMembers(response.data.data || []);
//             setSelectedTeam(managerId);
//             setModalVisible(true);
//         } catch (error) {
//             message.error('Failed to fetch team members');
//         }
//     };

//     const fetchEmployees = async () => {
//         try {
//             const response = await api.get('/employees');
//             setEmployees(response.data.data || []);
//         } catch (error) {
//             message.error('Failed to fetch employees');
//         }
//     };

//     const fetchManagers = async () => {
//         try {
//             const response = await api.get('/employees');
//             const managersList = response.data.data.filter(emp => 
//                 ['manager', 'tl', 'hr', 'superadmin'].includes(emp.role_name)
//             );
//             setManagers(managersList);
//         } catch (error) {
//             message.error('Failed to fetch managers');
//         }
//     };

//     const handleAssign = async (values) => {
//         try {
//             await api.post('/teams/assign', values);
//             message.success('Employee assigned successfully');
//             setAssignModalVisible(false);
//             form.resetFields();
//             fetchTeams();
//         } catch (error) {
//             message.error(error.response?.data?.message || 'Failed to assign employee');
//         }
//     };

//     const getRoleColor = (role) => {
//         const colors = {
//             'superadmin': 'red',
//             'hr': 'volcano',
//             'manager': 'purple',
//             'tl': 'blue',
//             'employee': 'green'
//         };
//         return colors[role?.toLowerCase()] || 'default';
//     };

//     const getTeamSizeStatus = (size) => {
//         if (size === 0) return 'default';
//         if (size <= 3) return 'warning';
//         if (size <= 7) return 'processing';
//         return 'success';
//     };

// const columns = [
//     {
//         title: 'Manager Details',
//         key: 'manager',
//         width: 350,
//         render: (_, record) => (
//             <Space size="middle">
//                 <Avatar 
//                     size={48} 
//                     icon={<UserOutlined />} 
//                     style={{ backgroundColor: '#1890ff' }}
//                 />
//                 <Space direction="vertical" size={0}>
//                     <Text strong>{record.manager_name}</Text>
//                     <Space size="small">
//                         <Tag icon={<IdcardOutlined />} color="blue">
//                             {record.manager_emp_id}
//                         </Tag>
//                         <Tag color={getRoleColor(record.manager_designation)}>
//                             {record.manager_designation}
//                         </Tag>
//                     </Space>
//                 </Space>
//             </Space>
//         ),
//     },
//     {
//         title: 'Department',
//         dataIndex: 'department_name',
//         key: 'department',
//         align: 'center',
//         render: (dept) => dept ? (
//             <Tag icon={<ApartmentOutlined />} color="cyan">{dept}</Tag>
//         ) : (
//             <Text type="secondary">Not Assigned</Text>
//         ),
//     },
//     {
//         title: 'Team Size',
//         dataIndex: 'team_size',
//         key: 'team_size',
//         align: 'center',
//         sorter: (a, b) => a.team_size - b.team_size,
//         render: (size) => (
//             <Tag 
//                 color={size > 5 ? 'success' : size > 2 ? 'processing' : 'warning'}
//                 style={{ fontSize: 14, fontWeight: 'bold', minWidth: 50, textAlign: 'center' }}
//             >
//                 {size} {size === 1 ? 'Member' : 'Members'}
//             </Tag>
//         ),
//     },
//     {
//         title: 'Status',
//         key: 'status',
//         align: 'center',
//         render: (_, record) => (
//             <Badge 
//                 status={getTeamSizeStatus(record.team_size)} 
//                 text={record.team_size === 0 ? 'Empty' : record.team_size <= 3 ? 'Small' : record.team_size <= 7 ? 'Medium' : 'Large'}
//             />
//         ),
//     },
//     {
//         title: 'Action',
//         key: 'actions',
//         align: 'center',
//         fixed: 'right',
//         width: 120,
//         render: (_, record) => (
//             <Button
//                 type="link"
//                 size="small"
//                 icon={<EyeOutlined />}
//                 onClick={() => fetchTeamMembers(record.manager_id)}
//             >
//                 View Team
//             </Button>
//         ),
//     },
// ];

//     const memberColumns = [
//         {
//             title: 'Employee',
//             key: 'employee',
//             width: 300,
//             render: (_, record) => (
//                 <Space size="middle">
//                     <Avatar 
//                         size={40} 
//                         icon={<UserOutlined />}
//                         style={{ 
//                             backgroundColor: ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'][record.id % 4]
//                         }}
//                     >
//                         {record.name?.charAt(0)}
//                     </Avatar>
//                     <Space direction="vertical" size={0}>
//                         <Text strong>{record.name}</Text>
//                         <Text type="secondary" style={{ fontSize: 12 }}>
//                             {record.employee_id}
//                         </Text>
//                     </Space>
//                 </Space>
//             ),
//         },
//         {
//             title: 'Designation',
//             dataIndex: 'designation',
//             key: 'designation',
//             render: (designation) => (
//                 <Tag color={getRoleColor(designation)}>{designation}</Tag>
//             ),
//         },
//         {
//             title: 'Department',
//             dataIndex: 'department_name',
//             key: 'department_name',
//             render: (dept) => dept ? (
//                 <Tag icon={<ApartmentOutlined />} color="cyan">{dept}</Tag>
//             ) : (
//                 <Text type="secondary">-</Text>
//             ),
//         },
//         {
//             title: 'Contact',
//             dataIndex: 'email',
//             key: 'email',
//             render: (email) => (
//                 <Space size="small">
//                     <MailOutlined style={{ color: '#1890ff' }} />
//                     <Text copyable={{ text: email }}>{email}</Text>
//                 </Space>
//             ),
//         },
//     ];

//     const currentTeamData = teams.find(t => t.manager_id === selectedTeam);

//     return (
//         <div>
//             <Row gutter={[16, 16]}>
//                 <Col span={24}>
//                     <Card bordered={false}>
//                         <Space size="large" style={{ width: '100%', justifyContent: 'space-between' }}>
//                             <Space size="middle">
//                                 <Avatar 
//                                     size={48} 
//                                     icon={<TeamOutlined />} 
//                                     style={{ backgroundColor: '#1890ff' }}
//                                 />
//                                 <div>
//                                     <Title level={3} style={{ margin: 0 }}>Teams Overview</Title>
//                                     <Text type="secondary">Manage teams and reporting structures</Text>
//                                 </div>
//                             </Space>
//                             {isHR && (
//                                 <Button
//                                     type="primary"
//                                     icon={<UserAddOutlined />}
//                                     onClick={() => setAssignModalVisible(true)}
//                                 >
//                                     Assign Employee
//                                 </Button>
//                             )}
//                         </Space>
//                     </Card>
//                 </Col>

//                 <Col span={24}>
//                     <Row gutter={16}>
//                         <Col xs={24} sm={8}>
//                             <Card bordered={false}>
//                                 <Statistic
//                                     title="Total Teams"
//                                     value={teams.length}
//                                     prefix={<TeamOutlined />}
//                                     valueStyle={{ color: '#1890ff' }}
//                                 />
//                             </Card>
//                         </Col>
//                         <Col xs={24} sm={8}>
//                             <Card bordered={false}>
//                                 <Statistic
//                                     title="Total Members"
//                                     value={teams.reduce((sum, team) => sum + team.team_size, 0)}
//                                     prefix={<UserOutlined />}
//                                     valueStyle={{ color: '#52c41a' }}
//                                 />
//                             </Card>
//                         </Col>
//                         <Col xs={24} sm={8}>
//                             <Card bordered={false}>
//                                 <Statistic
//                                     title="Average Team Size"
//                                     value={teams.length > 0 ? (teams.reduce((sum, team) => sum + team.team_size, 0) / teams.length).toFixed(1) : 0}
//                                     prefix={<ApartmentOutlined />}
//                                     valueStyle={{ color: '#faad14' }}
//                                 />
//                             </Card>
//                         </Col>
//                     </Row>
//                 </Col>

//                 <Col span={24}>
//                     <Card 
//                         bordered={false}
//                         title={
//                             <Space>
//                                 <TeamOutlined />
//                                 <span>All Teams</span>
//                                 <Badge count={teams.length} showZero style={{ backgroundColor: '#52c41a' }} />
//                             </Space>
//                         }
//                     >
//                         <Table
//                             dataSource={teams}
//                             columns={columns}
//                             loading={loading}
//                             rowKey="manager_id"
//                             pagination={{ 
//                                 pageSize: 10,
//                                 showSizeChanger: true,
//                                 showTotal: (total) => `Total ${total} teams`
//                             }}
//                             size="middle"
//                         />
//                     </Card>
//                 </Col>
//             </Row>

//             {/* View Team Members Modal */}
//             <Modal
//                 title={
//                     <Space>
//                         <TeamOutlined />
//                         <span>Team Members</span>
//                         {teamMembers.length > 0 && (
//                             <Badge count={teamMembers.length} showZero style={{ backgroundColor: '#52c41a' }} />
//                         )}
//                     </Space>
//                 }
//                 open={modalVisible}
//                 onCancel={() => setModalVisible(false)}
//                 footer={[
//                     <Button key="close" type="primary" onClick={() => setModalVisible(false)}>
//                         Close
//                     </Button>
//                 ]}
//                 width={1000}
//             >
//                 {currentTeamData && (
//                     <>
//                         <Card size="small" bordered={false} style={{ marginBottom: 16 }}>
//                             <Descriptions column={{ xs: 1, sm: 2, md: 3 }} size="small">
//                                 <Descriptions.Item 
//                                     label={<Text strong>Manager</Text>}
//                                 >
//                                     <Space>
//                                         <Avatar size="small" icon={<UserOutlined />} />
//                                         {currentTeamData.manager_name}
//                                     </Space>
//                                 </Descriptions.Item>
//                                 <Descriptions.Item 
//                                     label={<Text strong>Employee ID</Text>}
//                                 >
//                                     <Tag color="blue">{currentTeamData.manager_emp_id}</Tag>
//                                 </Descriptions.Item>
//                                 <Descriptions.Item 
//                                     label={<Text strong>Designation</Text>}
//                                 >
//                                     <Tag color={getRoleColor(currentTeamData.manager_designation)}>
//                                         {currentTeamData.manager_designation}
//                                     </Tag>
//                                 </Descriptions.Item>
//                                 <Descriptions.Item 
//                                     label={<Text strong>Department</Text>}
//                                 >
//                                     {currentTeamData.department_name ? (
//                                         <Tag icon={<ApartmentOutlined />} color="cyan">
//                                             {currentTeamData.department_name}
//                                         </Tag>
//                                     ) : (
//                                         <Text type="secondary">Not Assigned</Text>
//                                     )}
//                                 </Descriptions.Item>
//                                 <Descriptions.Item 
//                                     label={<Text strong>Team Size</Text>}
//                                 >
//                                     <Badge 
//                                         count={currentTeamData.team_size} 
//                                         showZero 
//                                         style={{ backgroundColor: '#52c41a' }}
//                                     />
//                                 </Descriptions.Item>
//                                 <Descriptions.Item 
//                                     label={<Text strong>Status</Text>}
//                                 >
//                                     <Badge 
//                                         status={getTeamSizeStatus(currentTeamData.team_size)} 
//                                         text={
//                                             currentTeamData.team_size === 0 ? 'Empty Team' : 
//                                             currentTeamData.team_size <= 3 ? 'Small Team' : 
//                                             currentTeamData.team_size <= 7 ? 'Medium Team' : 
//                                             'Large Team'
//                                         }
//                                     />
//                                 </Descriptions.Item>
//                             </Descriptions>
//                         </Card>
//                         <Divider orientation="left">Team Members List</Divider>
//                     </>
//                 )}
                
//                 <Table
//                     dataSource={teamMembers}
//                     columns={memberColumns}
//                     rowKey="id"
//                     pagination={{ 
//                         pageSize: 5,
//                         size: 'small',
//                         showTotal: (total) => `Total ${total} members`
//                     }}
//                     size="small"
//                     locale={{ emptyText: 'No team members assigned yet' }}
//                 />
//             </Modal>

//             {/* Assign Employee Modal */}
//             <Modal
//                 title={
//                     <Space>
//                         <UserAddOutlined />
//                         <span>Assign Employee to Manager</span>
//                     </Space>
//                 }
//                 open={assignModalVisible}
//                 onCancel={() => {
//                     setAssignModalVisible(false);
//                     form.resetFields();
//                 }}
//                 footer={null}
//                 width={500}
//             >
//                 <Form 
//                     form={form} 
//                     layout="vertical" 
//                     onFinish={handleAssign}
//                     size="large"
//                 >
//                     <Form.Item
//                         name="employee_id"
//                         label={
//                             <Space>
//                                 <UserOutlined />
//                                 <span>Select Employee</span>
//                             </Space>
//                         }
//                         rules={[{ required: true, message: 'Please select an employee' }]}
//                     >
//                         <Select
//                             showSearch
//                             placeholder="Choose an employee to assign"
//                             filterOption={(input, option) =>
//                                 option.children.toLowerCase().includes(input.toLowerCase())
//                             }
//                             optionLabelProp="label"
//                         >
//                             {employees.map(emp => (
//                                 <Select.Option 
//                                     key={emp.id} 
//                                     value={emp.id}
//                                     label={`${emp.name} (${emp.employee_id})`}
//                                 >
//                                     <Space>
//                                         <Avatar size="small" icon={<UserOutlined />} />
//                                         <div>
//                                             <div>{emp.name}</div>
//                                             <Text type="secondary" style={{ fontSize: 12 }}>
//                                                 {emp.employee_id} • {emp.designation}
//                                             </Text>
//                                         </div>
//                                     </Space>
//                                 </Select.Option>
//                             ))}
//                         </Select>
//                     </Form.Item>

//                     <Form.Item
//                         name="reporting_manager_id"
//                         label={
//                             <Space>
//                                 <TeamOutlined />
//                                 <span>Select Reporting Manager</span>
//                             </Space>
//                         }
//                         rules={[{ required: true, message: 'Please select a manager' }]}
//                     >
//                         <Select
//                             showSearch
//                             placeholder="Choose a manager"
//                             filterOption={(input, option) =>
//                                 option.children.toLowerCase().includes(input.toLowerCase())
//                             }
//                             optionLabelProp="label"
//                         >
//                             {managers.map(mgr => (
//                                 <Select.Option 
//                                     key={mgr.id} 
//                                     value={mgr.id}
//                                     label={`${mgr.name} (${mgr.employee_id})`}
//                                 >
//                                     <Space>
//                                         <Avatar 
//                                             size="small" 
//                                             icon={<UserOutlined />}
//                                             style={{ backgroundColor: '#722ed1' }}
//                                         />
//                                         <div>
//                                             <Space>
//                                                 <span>{mgr.name}</span>
//                                                 <Tag color={getRoleColor(mgr.designation)} style={{ marginLeft: 8 }}>
//                                                     {mgr.designation}
//                                                 </Tag>
//                                             </Space>
//                                             <div>
//                                                 <Text type="secondary" style={{ fontSize: 12 }}>
//                                                     {mgr.employee_id}
//                                                 </Text>
//                                             </div>
//                                         </div>
//                                     </Space>
//                                 </Select.Option>
//                             ))}
//                         </Select>
//                     </Form.Item>

//                     <Divider />

//                     <Form.Item style={{ marginBottom: 0 }}>
//                         <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
//                             <Button onClick={() => {
//                                 setAssignModalVisible(false);
//                                 form.resetFields();
//                             }}>
//                                 Cancel
//                             </Button>
//                             <Button type="primary" htmlType="submit" icon={<UserAddOutlined />}>
//                                 Assign Employee
//                             </Button>
//                         </Space>
//                     </Form.Item>
//                 </Form>
//             </Modal>
//         </div>
//     );
// };

// export default TeamsPage;


import React, { useState, useEffect } from 'react';
import { 
    Card, 
    Table, 
    Button, 
    Space, 
    Drawer, 
    Form, 
    Select, 
    message, 
    Tag, 
    Badge,
    Descriptions,
    Avatar,
    Statistic,
    Row,
    Col,
    Divider,
    Typography
} from 'antd';
import { 
    TeamOutlined, 
    UserAddOutlined, 
    EyeOutlined,
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    IdcardOutlined,
    ApartmentOutlined
} from '@ant-design/icons';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const { Text, Title } = Typography;

const TeamsPage = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [teamMembers, setTeamMembers] = useState([]);
    const [assignDrawerVisible, setAssignDrawerVisible] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [managers, setManagers] = useState([]);
    const [form] = Form.useForm();
    const { user } = useAuth();

    const isHR = ['hr', 'superadmin'].includes(user?.role_name);

    useEffect(() => {
        fetchTeams();
        if (isHR) {
            fetchEmployees();
            fetchManagers();
        }
    }, []);

    const fetchTeams = async () => {
        setLoading(true);
        try {
            const response = await api.get('/teams');
            setTeams(response.data.data || []);
        } catch (error) {
            message.error('Failed to fetch teams');
        } finally {
            setLoading(false);
        }
    };

    const fetchTeamMembers = async (managerId) => {
        try {
            const response = await api.get(`/teams/${managerId}/members`);
            setTeamMembers(response.data.data || []);
            setSelectedTeam(managerId);
            setDrawerVisible(true);
        } catch (error) {
            message.error('Failed to fetch team members');
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await api.get('/employees');
            setEmployees(response.data.data || []);
        } catch (error) {
            message.error('Failed to fetch employees');
        }
    };

    const fetchManagers = async () => {
        try {
            const response = await api.get('/employees');
            const managersList = response.data.data.filter(emp => 
                ['manager', 'tl', 'hr', 'superadmin'].includes(emp.role_name)
            );
            setManagers(managersList);
        } catch (error) {
            message.error('Failed to fetch managers');
        }
    };

    const handleAssign = async (values) => {
        try {
            await api.post('/teams/assign', values);
            message.success('Employee assigned successfully');
            setAssignDrawerVisible(false);
            form.resetFields();
            fetchTeams();
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to assign employee');
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

    const getTeamSizeStatus = (size) => {
        if (size === 0) return 'default';
        if (size <= 3) return 'warning';
        if (size <= 7) return 'processing';
        return 'success';
    };

    const columns = [
        {
            title: 'Manager Details',
            key: 'manager',
            width: 350,
            render: (_, record) => (
                <Space size="middle">
                    <Avatar 
                        size={48} 
                        icon={<UserOutlined />} 
                        style={{ backgroundColor: '#1890ff' }}
                    />
                    <Space direction="vertical" size={0}>
                        <Text strong>{record.manager_name}</Text>
                        <Space size="small">
                            <Tag icon={<IdcardOutlined />} color="blue">
                                {record.manager_emp_id}
                            </Tag>
                            <Tag color={getRoleColor(record.manager_designation)}>
                                {record.manager_designation}
                            </Tag>
                        </Space>
                    </Space>
                </Space>
            ),
        },
        {
            title: 'Department',
            dataIndex: 'department_name',
            key: 'department',
            align: 'center',
            render: (dept) => dept ? (
                <Tag icon={<ApartmentOutlined />} color="cyan">{dept}</Tag>
            ) : (
                <Text type="secondary">Not Assigned</Text>
            ),
        },
        {
            title: 'Team Size',
            dataIndex: 'team_size',
            key: 'team_size',
            align: 'center',
            sorter: (a, b) => a.team_size - b.team_size,
            render: (size) => (
                <Tag 
                    color={size > 5 ? 'success' : size > 2 ? 'processing' : 'warning'}
                    style={{ fontSize: 14, fontWeight: 'bold', minWidth: 50, textAlign: 'center' }}
                >
                    {size} {size === 1 ? 'Member' : 'Members'}
                </Tag>
            ),
        },
        {
            title: 'Status',
            key: 'status',
            align: 'center',
            render: (_, record) => (
                <Badge 
                    status={getTeamSizeStatus(record.team_size)} 
                    text={record.team_size === 0 ? 'Empty' : record.team_size <= 3 ? 'Small' : record.team_size <= 7 ? 'Medium' : 'Large'}
                />
            ),
        },
        {
            title: 'Action',
            key: 'actions',
            align: 'center',
            fixed: 'right',
            width: 120,
            render: (_, record) => (
                <Button
                    type="link"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => fetchTeamMembers(record.manager_id)}
                >
                    View Team
                </Button>
            ),
        },
    ];

    const memberColumns = [
        {
            title: 'Employee',
            key: 'employee',
            width: 300,
            render: (_, record) => (
                <Space size="middle">
                    <Avatar 
                        size={40} 
                        icon={<UserOutlined />}
                        style={{ 
                            backgroundColor: ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'][record.id % 4]
                        }}
                    >
                        {record.name?.charAt(0)}
                    </Avatar>
                    <Space direction="vertical" size={0}>
                        <Text strong>{record.name}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {record.employee_id}
                        </Text>
                    </Space>
                </Space>
            ),
        },
        {
            title: 'Designation',
            dataIndex: 'designation',
            key: 'designation',
            render: (designation) => (
                <Tag color={getRoleColor(designation)}>{designation}</Tag>
            ),
        },
        {
            title: 'Department',
            dataIndex: 'department_name',
            key: 'department_name',
            render: (dept) => dept ? (
                <Tag icon={<ApartmentOutlined />} color="cyan">{dept}</Tag>
            ) : (
                <Text type="secondary">-</Text>
            ),
        },
        {
            title: 'Contact',
            dataIndex: 'email',
            key: 'email',
            render: (email) => (
                <Space size="small">
                    <MailOutlined style={{ color: '#1890ff' }} />
                    <Text copyable={{ text: email }}>{email}</Text>
                </Space>
            ),
        },
    ];

    const currentTeamData = teams.find(t => t.manager_id === selectedTeam);

    return (
        <div>
            <Row gutter={[16, 16]}>
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
                                    <Title level={3} style={{ margin: 0 }}>Teams Overview</Title>
                                    <Text type="secondary">Manage teams and reporting structures</Text>
                                </div>
                            </Space>
                            {isHR && (
                                <Button
                                    type="primary"
                                    icon={<UserAddOutlined />}
                                    onClick={() => setAssignDrawerVisible(true)}
                                >
                                    Assign Employee
                                </Button>
                            )}
                        </Space>
                    </Card>
                </Col>

                <Col span={24}>
                    <Row gutter={16}>
                        <Col xs={24} sm={8}>
                            <Card bordered={false}>
                                <Statistic
                                    title="Total Teams"
                                    value={teams.length}
                                    prefix={<TeamOutlined />}
                                    valueStyle={{ color: '#1890ff' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Card bordered={false}>
                                <Statistic
                                    title="Total Members"
                                    value={teams.reduce((sum, team) => sum + team.team_size, 0)}
                                    prefix={<UserOutlined />}
                                    valueStyle={{ color: '#52c41a' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Card bordered={false}>
                                <Statistic
                                    title="Average Team Size"
                                    value={teams.length > 0 ? (teams.reduce((sum, team) => sum + team.team_size, 0) / teams.length).toFixed(1) : 0}
                                    prefix={<ApartmentOutlined />}
                                    valueStyle={{ color: '#faad14' }}
                                />
                            </Card>
                        </Col>
                    </Row>
                </Col>

                <Col span={24}>
                    <Card 
                        bordered={false}
                        title={
                            <Space>
                                <TeamOutlined />
                                <span>All Teams</span>
                                <Badge count={teams.length} showZero style={{ backgroundColor: '#52c41a' }} />
                            </Space>
                        }
                    >
                        <Table
                            dataSource={teams}
                            columns={columns}
                            loading={loading}
                            rowKey="manager_id"
                            pagination={{ 
                                pageSize: 10,
                                showSizeChanger: true,
                                showTotal: (total) => `Total ${total} teams`
                            }}
                            size="middle"
                        />
                    </Card>
                </Col>
            </Row>

            {/* View Team Members Drawer */}
            <Drawer
                title={
                    <Space>
                        <TeamOutlined />
                        <span>Team Members</span>
                        {teamMembers.length > 0 && (
                            <Badge count={teamMembers.length} showZero style={{ backgroundColor: '#52c41a' }} />
                        )}
                    </Space>
                }
                placement="right"
                width={900}
                open={drawerVisible}
                onClose={() => setDrawerVisible(false)}
            >
                {currentTeamData && (
                    <>
                        <Card size="small" bordered={false} style={{ marginBottom: 16, backgroundColor: '#f5f5f5' }}>
                            <Descriptions column={{ xs: 1, sm: 2, md: 2 }} size="small">
                                <Descriptions.Item 
                                    label={<Text strong>Manager</Text>}
                                >
                                    <Space>
                                        <Avatar size="small" icon={<UserOutlined />} />
                                        {currentTeamData.manager_name}
                                    </Space>
                                </Descriptions.Item>
                                <Descriptions.Item 
                                    label={<Text strong>Employee ID</Text>}
                                >
                                    <Tag color="blue">{currentTeamData.manager_emp_id}</Tag>
                                </Descriptions.Item>
                                <Descriptions.Item 
                                    label={<Text strong>Designation</Text>}
                                >
                                    <Tag color={getRoleColor(currentTeamData.manager_designation)}>
                                        {currentTeamData.manager_designation}
                                    </Tag>
                                </Descriptions.Item>
                                <Descriptions.Item 
                                    label={<Text strong>Department</Text>}
                                >
                                    {currentTeamData.department_name ? (
                                        <Tag icon={<ApartmentOutlined />} color="cyan">
                                            {currentTeamData.department_name}
                                        </Tag>
                                    ) : (
                                        <Text type="secondary">Not Assigned</Text>
                                    )}
                                </Descriptions.Item>
                                <Descriptions.Item 
                                    label={<Text strong>Team Size</Text>}
                                >
                                    <Badge 
                                        count={currentTeamData.team_size} 
                                        showZero 
                                        style={{ backgroundColor: '#52c41a' }}
                                    />
                                </Descriptions.Item>
                                <Descriptions.Item 
                                    label={<Text strong>Status</Text>}
                                >
                                    <Badge 
                                        status={getTeamSizeStatus(currentTeamData.team_size)} 
                                        text={
                                            currentTeamData.team_size === 0 ? 'Empty Team' : 
                                            currentTeamData.team_size <= 3 ? 'Small Team' : 
                                            currentTeamData.team_size <= 7 ? 'Medium Team' : 
                                            'Large Team'
                                        }
                                    />
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                        <Divider orientation="left">Team Members List</Divider>
                    </>
                )}
                
                <Table
                    dataSource={teamMembers}
                    columns={memberColumns}
                    rowKey="id"
                    pagination={{ 
                        pageSize: 8,
                        size: 'small',
                        showTotal: (total) => `Total ${total} members`
                    }}
                    size="small"
                    locale={{ emptyText: 'No team members assigned yet' }}
                />
            </Drawer>

            {/* Assign Employee Drawer */}
            <Drawer
                title={
                    <Space>
                        <UserAddOutlined />
                        <span>Assign Employee to Manager</span>
                    </Space>
                }
                placement="right"
                width={500}
                open={assignDrawerVisible}
                onClose={() => {
                    setAssignDrawerVisible(false);
                    form.resetFields();
                }}
                footer={
                    <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                        <Button onClick={() => {
                            setAssignDrawerVisible(false);
                            form.resetFields();
                        }}>
                            Cancel
                        </Button>
                        <Button type="primary" icon={<UserAddOutlined />} onClick={() => form.submit()}>
                            Assign Employee
                        </Button>
                    </Space>
                }
            >
                <Form 
                    form={form} 
                    layout="vertical" 
                    onFinish={handleAssign}
                    size="large"
                >
                    <Form.Item
                        name="employee_id"
                        label={
                            <Space>
                                <UserOutlined />
                                <span>Select Employee</span>
                            </Space>
                        }
                        rules={[{ required: true, message: 'Please select an employee' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Choose an employee to assign"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().includes(input.toLowerCase())
                            }
                            optionLabelProp="label"
                        >
                            {employees.map(emp => (
                                <Select.Option 
                                    key={emp.id} 
                                    value={emp.id}
                                    label={`${emp.name} (${emp.employee_id})`}
                                >
                                    <Space>
                                        <Avatar size="small" icon={<UserOutlined />} />
                                        <div>
                                            <div>{emp.name}</div>
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                {emp.employee_id} • {emp.designation}
                                            </Text>
                                        </div>
                                    </Space>
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="reporting_manager_id"
                        label={
                            <Space>
                                <TeamOutlined />
                                <span>Select Reporting Manager</span>
                            </Space>
                        }
                        rules={[{ required: true, message: 'Please select a manager' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Choose a manager"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().includes(input.toLowerCase())
                            }
                            optionLabelProp="label"
                        >
                            {managers.map(mgr => (
                                <Select.Option 
                                    key={mgr.id} 
                                    value={mgr.id}
                                    label={`${mgr.name} (${mgr.employee_id})`}
                                >
                                    <Space>
                                        <Avatar 
                                            size="small" 
                                            icon={<UserOutlined />}
                                            style={{ backgroundColor: '#722ed1' }}
                                        />
                                        <div>
                                            <Space>
                                                <span>{mgr.name}</span>
                                                <Tag color={getRoleColor(mgr.designation)} style={{ marginLeft: 8 }}>
                                                    {mgr.designation}
                                                </Tag>
                                            </Space>
                                            <div>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    {mgr.employee_id}
                                                </Text>
                                            </div>
                                        </div>
                                    </Space>
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default TeamsPage;
