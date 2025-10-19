// import React, { useState, useEffect } from 'react';
// import {
//     Form,
//     Input,
//     Button,
//     Card,
//     Select,
//     message,
//     Table,
//     Tag,
//     Modal,
//     Space,
//     Divider,
//     Row,
//     Col,
//     Typography
// } from 'antd';
// import {
//     MailOutlined,
//     SendOutlined,
//     FileTextOutlined,
//     DeleteOutlined,
//     PlusOutlined,
//     CloseCircleOutlined
// } from '@ant-design/icons';
// import { hasPermission } from '../services/authService';
// import { useAuth } from '../context/AuthContext';
// import { getAllEmployees, sendBulkAnnouncement } from '../services/announcementService';

// const { TextArea } = Input;
// const { Title, Text } = Typography;
// const { Option } = Select;

// const AnnouncementPage = () => {
//     const { user } = useAuth();
//     const [form] = Form.useForm();
//     const [loading, setLoading] = useState(false);
//     const [employees, setEmployees] = useState([]);
//     const [selectedEmployees, setSelectedEmployees] = useState([]);
//     const [previewModal, setPreviewModal] = useState(false);
//     const [emailPreview, setEmailPreview] = useState('');

//     // Permission checks
//     const canViewAnnouncements = hasPermission('announcements', 'view');
//     const canSendAnnouncements = hasPermission('announcements', 'create');

//     // Fetch employees on mount
//     useEffect(() => {
//         if (canViewAnnouncements) {
//             fetchEmployees();
//         }
//     }, [canViewAnnouncements]);

//     const fetchEmployees = async () => {
//         if (!canViewAnnouncements) {
//             message.error('You do not have permission to view announcements');
//             return;
//         }

//         try {
//             const response = await getAllEmployees();
            
//             if (response.success && Array.isArray(response.data)) {
//                 setEmployees(response.data);
//             } else {
//                 message.error('Invalid response format from server');
//             }
//         } catch (error) {
//             message.error(error.response?.data?.message || 'Failed to fetch employees');
//             console.error(error);
//         }
//     };

//     const handleSendBulkEmail = async (values) => {
//         if (!canSendAnnouncements) {
//             message.error('You do not have permission to send announcements');
//             return;
//         }

//         if (selectedEmployees.length === 0) {
//             message.warning('Please select at least one recipient');
//             return;
//         }

//         setLoading(true);
//         try {
//             const response = await sendBulkAnnouncement(
//                 values.subject,
//                 values.content,
//                 selectedEmployees,
//                 values.priority || 'normal'
//             );
            
//             if (response.success) {
//                 message.success(`Email sent successfully to ${response.sentCount} recipients`);
//                 form.resetFields();
//                 setSelectedEmployees([]);
//             } else {
//                 message.error('Failed to send some emails');
//             }
//         } catch (error) {
//             message.error(error.response?.data?.message || 'Failed to send bulk email');
//             console.error(error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSelectAll = () => {
//         setSelectedEmployees(employees.map(emp => ({
//             email: emp.email,
//             name: emp.name,
//             id: emp.id
//         })));
//         message.info(`Selected all ${employees.length} employees`);
//     };

//     const handleClearAll = () => {
//         setSelectedEmployees([]);
//         message.info('Cleared all selections');
//     };

//     const handleSelectByRole = (role) => {
//         const filtered = employees
//             .filter(emp => emp.role_name === role)
//             .map(emp => ({
//                 email: emp.email,
//                 name: emp.name,
//                 id: emp.id
//             }));
//         setSelectedEmployees(filtered);
//         message.info(`Selected ${filtered.length} employees with role: ${role}`);
//     };

//     const handlePreview = () => {
//         const values = form.getFieldsValue();
//         if (!values.subject || !values.content) {
//             message.warning('Please fill subject and content first');
//             return;
//         }
//         setEmailPreview(values.content);
//         setPreviewModal(true);
//     };

//     // Get unique roles for filter
//     const uniqueRoles = [...new Set(employees.map(emp => emp.role_name).filter(Boolean))];

//     const columns = [
//         {
//             title: 'Employee ID',
//             dataIndex: 'employee_id',
//             key: 'employee_id',
//             render: (text) => <Tag color="geekblue">{text}</Tag>
//         },
//         {
//             title: 'Name',
//             dataIndex: 'name',
//             key: 'name',
//             render: (text) => <Text strong>{text}</Text>
//         },
//         {
//             title: 'Email',
//             dataIndex: 'email',
//             key: 'email',
//         },
//         {
//             title: 'Designation',
//             dataIndex: 'designation',
//             key: 'designation',
//             render: (text) => <Tag color="cyan">{text}</Tag>
//         },
//         {
//             title: 'Role',
//             dataIndex: 'role_name',
//             key: 'role_name',
//             render: (role) => <Tag color={role === 'hr' ? 'gold' : 'blue'}>{role}</Tag>
//         },
//         {
//             title: 'Status',
//             dataIndex: 'is_active',
//             key: 'is_active',
//             render: (status) => (
//                 <Tag color={status === 1 ? 'green' : 'red'}>
//                     {status === 1 ? 'Active' : 'Inactive'}
//                 </Tag>
//             )
//         },
//         ...(canSendAnnouncements ? [{
//             title: 'Action',
//             key: 'action',
//             render: (_, record) => {
//                 const isSelected = selectedEmployees.some(emp => emp.id === record.id);
//                 return (
//                     <Button
//                         type={isSelected ? 'default' : 'primary'}
//                         size="small"
//                         onClick={() => {
//                             if (isSelected) {
//                                 setSelectedEmployees(prev => 
//                                     prev.filter(emp => emp.id !== record.id)
//                                 );
//                             } else {
//                                 setSelectedEmployees(prev => [...prev, {
//                                     email: record.email,
//                                     name: record.name,
//                                     id: record.id
//                                 }]);
//                             }
//                         }}
//                     >
//                         {isSelected ? 'Remove' : 'Add'}
//                     </Button>
//                 );
//             }
//         }] : [])
//     ];

//     if (!canViewAnnouncements) {
//         return (
//             <div style={{ padding: 24, textAlign: 'center' }}>
//                 <CloseCircleOutlined style={{ fontSize: 48, color: '#f5222d' }} />
//                 <h2>Access Denied</h2>
//                 <p>You do not have permission to view announcements.</p>
//             </div>
//         );
//     }

//     return (
//         <div style={{  background: '#f0f2f5', minHeight: '100vh' }}>
//             <Card>
//                 <Title level={2}>
//                     <MailOutlined /> Send Announcement
//                 </Title>
//                 <Text type="secondary">
//                     Send bulk emails to employees for announcements, updates, and notifications
//                 </Text>

//                 <Divider />

//                 {canSendAnnouncements ? (
//                     <Form
//                         form={form}
//                         layout="vertical"
//                         onFinish={handleSendBulkEmail}
//                     >
//                         <Row gutter={16}>
//                             <Col xs={24} lg={16}>
//                                 <Form.Item
//                                     label="Email Subject"
//                                     name="subject"
//                                     rules={[{ required: true, message: 'Please enter email subject' }]}
//                                 >
//                                     <Input
//                                         prefix={<FileTextOutlined />}
//                                         placeholder="Enter email subject"
//                                         size="large"
//                                     />
//                                 </Form.Item>

//                                 <Form.Item
//                                     label="Email Content"
//                                     name="content"
//                                     rules={[{ required: true, message: 'Please enter email content' }]}
//                                 >
//                                     <TextArea
//                                         rows={12}
//                                         placeholder="Enter announcement message here..."
//                                     />
//                                 </Form.Item>

//                                 <Form.Item
//                                     label="Priority"
//                                     name="priority"
//                                     initialValue="normal"
//                                 >
//                                     <Select size="large">
//                                         <Option value="high">High Priority</Option>
//                                         <Option value="normal">Normal Priority</Option>
//                                         <Option value="low">Low Priority</Option>
//                                     </Select>
//                                 </Form.Item>

//                                 <Space>
//                                     <Button
//                                         type="primary"
//                                         htmlType="submit"
//                                         icon={<SendOutlined />}
//                                         size="large"
//                                         loading={loading}
//                                         disabled={selectedEmployees.length === 0}
//                                     >
//                                         Send to {selectedEmployees.length} Recipients
//                                     </Button>
//                                     <Button
//                                         onClick={handlePreview}
//                                         size="large"
//                                     >
//                                         Preview Email
//                                     </Button>
//                                 </Space>
//                             </Col>

//                             <Col xs={24} lg={8}>
//                                 <Card
//                                     title="Recipients"
//                                     size="small"
//                                     extra={
//                                         <Text type="secondary">
//                                             {selectedEmployees.length} selected
//                                         </Text>
//                                     }
//                                 >
//                                     <Space direction="vertical" style={{ width: '100%' }}>
//                                         <Button
//                                             type="primary"
//                                             block
//                                             icon={<PlusOutlined />}
//                                             onClick={handleSelectAll}
//                                         >
//                                             Select All ({employees.length})
//                                         </Button>
//                                         <Button
//                                             danger
//                                             block
//                                             icon={<DeleteOutlined />}
//                                             onClick={handleClearAll}
//                                         >
//                                             Clear All
//                                         </Button>
//                                         <Divider>Quick Select by Role</Divider>
//                                         <Select
//                                             placeholder="Select by Role"
//                                             style={{ width: '100%' }}
//                                             onChange={handleSelectByRole}
//                                         >
//                                             {uniqueRoles.map(role => (
//                                                 <Option key={role} value={role}>
//                                                     {role.toUpperCase()}
//                                                 </Option>
//                                             ))}
//                                         </Select>
//                                     </Space>

//                                     <Divider />

//                                     <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
//                                         {selectedEmployees.map(emp => (
//                                             <Tag
//                                                 key={emp.id}
//                                                 closable
//                                                 onClose={() => {
//                                                     setSelectedEmployees(prev =>
//                                                         prev.filter(e => e.id !== emp.id)
//                                                     );
//                                                 }}
//                                                 style={{ marginBottom: '8px' }}
//                                             >
//                                                 {emp.name}
//                                             </Tag>
//                                         ))}
//                                     </div>
//                                 </Card>
//                             </Col>
//                         </Row>
//                     </Form>
//                 ) : (
//                     <div style={{ textAlign: 'center', padding: '40px' }}>
//                         <CloseCircleOutlined style={{ fontSize: 48, color: '#faad14' }} />
//                         <h3>Read-Only Access</h3>
//                         <p>You can view announcements but do not have permission to send them.</p>
//                     </div>
//                 )}

//                 <Divider />

//                 <Title level={4}>Employee List ({employees.length} Total)</Title>
//                 <Table
//                     columns={columns}
//                     dataSource={employees}
//                     rowKey="id"
//                     pagination={{ pageSize: 10 }}
//                     scroll={{ x: 1000 }}
//                 />
//             </Card>

//             <Modal
//                 title="Email Preview"
//                 open={previewModal}
//                 onCancel={() => setPreviewModal(false)}
//                 footer={[
//                     <Button key="close" onClick={() => setPreviewModal(false)}>
//                         Close
//                     </Button>
//                 ]}
//                 width={700}
//             >
//                 <div
//                     style={{
//                         background: '#f9f9f9',
//                         padding: '20px',
//                         borderRadius: '8px',
//                         whiteSpace: 'pre-wrap'
//                     }}
//                 >
//                     {emailPreview}
//                 </div>
//             </Modal>
//         </div>
//     );
// };

// export default AnnouncementPage;


import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    Button,
    Card,
    Select,
    message,
    Table,
    Tag,
    Modal,
    Space,
    Divider,
    Row,
    Col,
    Typography,
    Alert,
    Statistic,
    Tabs,
    Badge,
    Descriptions,
    Avatar,
    Segmented,
    Tooltip,
    Progress,
    Result
} from 'antd';
import {
    MailOutlined,
    SendOutlined,
    FileTextOutlined,
    DeleteOutlined,
    PlusOutlined,
    CloseCircleOutlined,
    UserOutlined,
    EyeOutlined,
    CheckCircleOutlined,
    TeamOutlined,
    FilterOutlined,
    ExportOutlined,
    HistoryOutlined,
    BellOutlined,
    SafetyOutlined,
    ThunderboltOutlined,
    ClockCircleOutlined,
    UserAddOutlined,
    UsergroupAddOutlined
} from '@ant-design/icons';
import { hasPermission } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { getAllEmployees, sendBulkAnnouncement } from '../services/announcementService';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const AnnouncementPage = () => {
    const { user } = useAuth();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [previewModal, setPreviewModal] = useState(false);
    const [emailPreview, setEmailPreview] = useState({});
    const [activeTab, setActiveTab] = useState('compose');
    const [filterStatus, setFilterStatus] = useState('all');

    const canViewAnnouncements = hasPermission('announcements', 'view');
    const canSendAnnouncements = hasPermission('announcements', 'create');

    useEffect(() => {
        if (canViewAnnouncements) {
            fetchEmployees();
        }
    }, [canViewAnnouncements]);

    const fetchEmployees = async () => {
        if (!canViewAnnouncements) {
            message.error('You do not have permission to view announcements');
            return;
        }

        try {
            const response = await getAllEmployees();
            
            if (response.success && Array.isArray(response.data)) {
                setEmployees(response.data);
            } else {
                message.error('Invalid response format from server');
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to fetch employees');
            console.error(error);
        }
    };

    const handleSendBulkEmail = async (values) => {
        if (!canSendAnnouncements) {
            message.error('You do not have permission to send announcements');
            return;
        }

        if (selectedEmployees.length === 0) {
            message.warning('Please select at least one recipient');
            return;
        }

        setLoading(true);
        try {
            const response = await sendBulkAnnouncement(
                values.subject,
                values.content,
                selectedEmployees,
                values.priority || 'normal'
            );
            
            if (response.success) {
                message.success({
                    content: `Email sent successfully to ${response.sentCount} recipients`,
                    duration: 5,
                    icon: <CheckCircleOutlined />
                });
                form.resetFields();
                setSelectedEmployees([]);
                setActiveTab('history');
            } else {
                message.error('Failed to send some emails');
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to send bulk email');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAll = () => {
        const filtered = filterStatus === 'all' 
            ? employees 
            : employees.filter(emp => emp.is_active === (filterStatus === 'active' ? 1 : 0));
        
        setSelectedEmployees(filtered.map(emp => ({
            email: emp.email,
            name: emp.name,
            id: emp.id
        })));
        message.success(`Selected ${filtered.length} employees`);
    };

    const handleClearAll = () => {
        setSelectedEmployees([]);
        message.info('Cleared all selections');
    };

    const handleSelectByRole = (role) => {
        const filtered = employees
            .filter(emp => emp.role_name === role)
            .map(emp => ({
                email: emp.email,
                name: emp.name,
                id: emp.id
            }));
        setSelectedEmployees(filtered);
        message.success(`Selected ${filtered.length} employees with role: ${role}`);
    };

    const handlePreview = () => {
        const values = form.getFieldsValue();
        if (!values.subject || !values.content) {
            message.warning('Please fill subject and content first');
            return;
        }
        setEmailPreview(values);
        setPreviewModal(true);
    };

    const uniqueRoles = [...new Set(employees.map(emp => emp.role_name).filter(Boolean))];
    const activeEmployees = employees.filter(emp => emp.is_active === 1).length;
    const inactiveEmployees = employees.filter(emp => emp.is_active === 0).length;

    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'high': return 'red';
            case 'normal': return 'blue';
            case 'low': return 'default';
            default: return 'blue';
        }
    };

    const getPriorityIcon = (priority) => {
        switch(priority) {
            case 'high': return <ThunderboltOutlined />;
            case 'normal': return <ClockCircleOutlined />;
            case 'low': return <ClockCircleOutlined />;
            default: return <ClockCircleOutlined />;
        }
    };

    const columns = [
        {
            title: 'Employee',
            key: 'employee',
            width: 250,
            fixed: 'left',
            render: (_, record) => (
                <Space>
                    <Avatar icon={<UserOutlined />} />
                    <Space direction="vertical" size={0}>
                        <Text strong>{record.name}</Text>
                        <Text type="secondary">{record.employee_id}</Text>
                    </Space>
                </Space>
            )
        },
        {
            title: 'Contact',
            dataIndex: 'email',
            key: 'email',
            ellipsis: true,
            width: 220,
        },
        {
            title: 'Designation',
            dataIndex: 'designation',
            key: 'designation',
            width: 150,
        },
        {
            title: 'Role',
            dataIndex: 'role_name',
            key: 'role_name',
            width: 120,
            filters: uniqueRoles.map(role => ({ text: role.toUpperCase(), value: role })),
            onFilter: (value, record) => record.role_name === value,
            render: (role) => (
                <Tag color={role === 'hr' ? 'gold' : role === 'manager' ? 'purple' : 'blue'}>
                    {role?.toUpperCase()}
                </Tag>
            )
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            width: 100,
            filters: [
                { text: 'Active', value: 1 },
                { text: 'Inactive', value: 0 }
            ],
            onFilter: (value, record) => record.is_active === value,
            render: (status) => (
                <Badge 
                    status={status === 1 ? 'success' : 'default'} 
                    text={status === 1 ? 'Active' : 'Inactive'} 
                />
            )
        },
        ...(canSendAnnouncements ? [{
            title: 'Action',
            key: 'action',
            width: 120,
            fixed: 'right',
            render: (_, record) => {
                const isSelected = selectedEmployees.some(emp => emp.id === record.id);
                return (
                    <Button
                        type={isSelected ? 'default' : 'primary'}
                        size="small"
                        icon={isSelected ? <CloseCircleOutlined /> : <UserAddOutlined />}
                        onClick={() => {
                            if (isSelected) {
                                setSelectedEmployees(prev => 
                                    prev.filter(emp => emp.id !== record.id)
                                );
                                message.info(`Removed ${record.name}`);
                            } else {
                                setSelectedEmployees(prev => [...prev, {
                                    email: record.email,
                                    name: record.name,
                                    id: record.id
                                }]);
                                message.success(`Added ${record.name}`);
                            }
                        }}
                    >
                        {isSelected ? 'Remove' : 'Add'}
                    </Button>
                );
            }
        }] : [])
    ];

    if (!canViewAnnouncements) {
        return (
            <Card bordered={false}>
                <Result
                    status="403"
                    title="403"
                    subTitle="Sorry, you are not authorized to access this page."
                    extra={
                        <Button type="primary" onClick={() => window.history.back()}>
                            Go Back
                        </Button>
                    }
                />
            </Card>
        );
    }

    const renderComposePage = () => (
        <Row gutter={[24, 24]}>
            <Col xs={24} xl={16}>
                <Card 
                    title={
                        <Space>
                            <FileTextOutlined />
                            <Text strong>Compose Announcement</Text>
                        </Space>
                    }
                    bordered={false}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSendBulkEmail}
                        requiredMark="optional"
                    >
                        <Form.Item
                            label={<Text strong>Subject Line</Text>}
                            name="subject"
                            rules={[
                                { required: true, message: 'Please enter email subject' },
                                { min: 5, message: 'Subject must be at least 5 characters' }
                            ]}
                            extra="Write a clear and concise subject line"
                        >
                            <Input
                                prefix={<MailOutlined />}
                                placeholder="e.g., Important Update: Office Policy Changes"
                                size="large"
                                showCount
                                maxLength={100}
                            />
                        </Form.Item>

                        <Form.Item
                            label={<Text strong>Message Content</Text>}
                            name="content"
                            rules={[
                                { required: true, message: 'Please enter email content' },
                                { min: 20, message: 'Content must be at least 20 characters' }
                            ]}
                            extra="Provide detailed information for your announcement"
                        >
                            <TextArea
                                rows={12}
                                placeholder="Enter your announcement message here..."
                                showCount
                                maxLength={5000}
                            />
                        </Form.Item>

                        <Form.Item
                            label={<Text strong>Priority Level</Text>}
                            name="priority"
                            initialValue="normal"
                            extra="Set the urgency level for this announcement"
                        >
                            <Segmented
                                size="large"
                                block
                                options={[
                                    {
                                        label: 'High Priority',
                                        value: 'high',
                                        icon: <ThunderboltOutlined />
                                    },
                                    {
                                        label: 'Normal',
                                        value: 'normal',
                                        icon: <ClockCircleOutlined />
                                    },
                                    {
                                        label: 'Low Priority',
                                        value: 'low',
                                        icon: <ClockCircleOutlined />
                                    }
                                ]}
                            />
                        </Form.Item>

                        <Divider />

                        <Space size="middle">
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<SendOutlined />}
                                size="large"
                                loading={loading}
                                disabled={selectedEmployees.length === 0}
                            >
                                Send to {selectedEmployees.length} Recipients
                            </Button>
                            <Button
                                icon={<EyeOutlined />}
                                onClick={handlePreview}
                                size="large"
                            >
                                Preview
                            </Button>
                            <Button
                                icon={<DeleteOutlined />}
                                onClick={() => {
                                    form.resetFields();
                                    message.info('Form cleared');
                                }}
                                size="large"
                            >
                                Clear
                            </Button>
                        </Space>
                    </Form>
                </Card>
            </Col>

            <Col xs={24} xl={8}>
                <Space direction="vertical" size="middle">
                    <Card 
                        title={
                            <Space>
                                <UsergroupAddOutlined />
                                <Text strong>Recipient Selection</Text>
                            </Space>
                        }
                        extra={
                            <Badge count={selectedEmployees.length} showZero>
                                <UserOutlined />
                            </Badge>
                        }
                        bordered={false}
                    >
                        <Space direction="vertical" size="middle">
                            <Descriptions column={1} size="small" bordered>
                                <Descriptions.Item label="Selected">
                                    <Text strong>{selectedEmployees.length}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Total Employees">
                                    {employees.length}
                                </Descriptions.Item>
                                <Descriptions.Item label="Coverage">
                                    <Progress 
                                        percent={Math.round((selectedEmployees.length / employees.length) * 100)} 
                                        size="small"
                                        status={selectedEmployees.length === 0 ? 'exception' : 'active'}
                                    />
                                </Descriptions.Item>
                            </Descriptions>

                            <Divider orientation="left" plain>Quick Actions</Divider>

                            <Space direction="vertical">
                                <Button
                                    type="primary"
                                    block
                                    icon={<UsergroupAddOutlined />}
                                    onClick={handleSelectAll}
                                >
                                    Select All Employees
                                </Button>
                                
                                <Button
                                    block
                                    icon={<FilterOutlined />}
                                    onClick={() => {
                                        const activeEmps = employees
                                            .filter(emp => emp.is_active === 1)
                                            .map(emp => ({ email: emp.email, name: emp.name, id: emp.id }));
                                        setSelectedEmployees(activeEmps);
                                        message.success(`Selected ${activeEmps.length} active employees`);
                                    }}
                                >
                                    Select Active Only
                                </Button>

                                <Button
                                    danger
                                    block
                                    icon={<DeleteOutlined />}
                                    onClick={handleClearAll}
                                    disabled={selectedEmployees.length === 0}
                                >
                                    Clear Selections
                                </Button>
                            </Space>

                            <Divider orientation="left" plain>Filter by Role</Divider>

                            <Select
                                placeholder="Select role to filter"
                                allowClear
                                onChange={handleSelectByRole}
                                size="large"
                                suffixIcon={<FilterOutlined />}
                            >
                                {uniqueRoles.map(role => (
                                    <Option key={role} value={role}>
                                        <Space>
                                            <Tag>{role.toUpperCase()}</Tag>
                                            <Text type="secondary">
                                                ({employees.filter(e => e.role_name === role).length})
                                            </Text>
                                        </Space>
                                    </Option>
                                ))}
                            </Select>

                            {selectedEmployees.length > 0 && (
                                <>
                                    <Divider orientation="left" plain>Selected Recipients</Divider>
                                    <Card size="small" bodyStyle={{ maxHeight: 300, overflowY: 'auto' }}>
                                        <Space size={[0, 8]} wrap>
                                            {selectedEmployees.map(emp => (
                                                <Tag
                                                    key={emp.id}
                                                    closable
                                                    color="blue"
                                                    onClose={() => {
                                                        setSelectedEmployees(prev =>
                                                            prev.filter(e => e.id !== emp.id)
                                                        );
                                                    }}
                                                >
                                                    {emp.name}
                                                </Tag>
                                            ))}
                                        </Space>
                                    </Card>
                                </>
                            )}
                        </Space>
                    </Card>

                    <Alert
                        message="Quick Tips"
                        description="Select recipients before composing your message. You can filter by role or status for targeted announcements."
                        type="info"
                        showIcon
                        icon={<BellOutlined />}
                    />
                </Space>
            </Col>
        </Row>
    );

    const renderEmployeeDirectory = () => (
        <Card 
            title={
                <Space>
                    <TeamOutlined />
                    <Text strong>Employee Directory</Text>
                </Space>
            }
            extra={
                <Space>
                    <Segmented
                        options={[
                            { label: 'All', value: 'all' },
                            { label: 'Active', value: 'active' },
                            { label: 'Inactive', value: 'inactive' }
                        ]}
                        value={filterStatus}
                        onChange={setFilterStatus}
                    />
                </Space>
            }
            bordered={false}
        >
            <Table
                columns={columns}
                dataSource={employees.filter(emp => {
                    if (filterStatus === 'all') return true;
                    return emp.is_active === (filterStatus === 'active' ? 1 : 0);
                })}
                rowKey="id"
                pagination={{ 
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} employees`,
                    pageSizeOptions: ['10', '20', '50', '100']
                }}
                scroll={{ x: 1200 }}
                size="middle"
            />
        </Card>
    );

    const renderHistoryPage = () => (
        <Card 
            title={
                <Space>
                    <HistoryOutlined />
                    <Text strong>Announcement History</Text>
                </Space>
            }
            bordered={false}
        >
            <Result
                icon={<HistoryOutlined />}
                title="No History Available"
                subTitle="Your sent announcements will appear here"
                extra={
                    <Button type="primary" onClick={() => setActiveTab('compose')}>
                        <SendOutlined /> Send New Announcement
                    </Button>
                }
            />
        </Card>
    );

    return (
        <Space direction="vertical" size="large">
            {/* Statistics Dashboard */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="Total Employees"
                            value={employees.length}
                            prefix={<TeamOutlined />}
                            suffix={<Text type="secondary">users</Text>}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="Active Employees"
                            value={activeEmployees}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="Selected Recipients"
                            value={selectedEmployees.length}
                            prefix={<UserAddOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="Department Roles"
                            value={uniqueRoles.length}
                            prefix={<SafetyOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Main Content */}
            <Card bordered={false}>
                {canSendAnnouncements ? (
                    <Tabs 
                        activeKey={activeTab} 
                        onChange={setActiveTab}
                        size="large"
                        tabBarGutter={32}
                    >
                        <TabPane
                            tab={
                                <Space>
                                    <SendOutlined />
                                    Compose
                                </Space>
                            }
                            key="compose"
                        >
                            {renderComposePage()}
                        </TabPane>
                        <TabPane
                            tab={
                                <Space>
                                    <TeamOutlined />
                                    Directory
                                </Space>
                            }
                            key="directory"
                        >
                            {renderEmployeeDirectory()}
                        </TabPane>
                        <TabPane
                            tab={
                                <Space>
                                    <HistoryOutlined />
                                    History
                                </Space>
                            }
                            key="history"
                        >
                            {renderHistoryPage()}
                        </TabPane>
                    </Tabs>
                ) : (
                    <>
                        <Alert
                            message="Limited Access"
                            description="You have read-only access to announcements. Contact your administrator for sending permissions."
                            type="warning"
                            showIcon
                            banner
                        />
                        <Divider />
                        {renderEmployeeDirectory()}
                    </>
                )}
            </Card>

            {/* Preview Modal */}
            <Modal
                title={
                    <Space>
                        <EyeOutlined />
                        <Text strong>Email Preview</Text>
                    </Space>
                }
                open={previewModal}
                onCancel={() => setPreviewModal(false)}
                width={900}
                footer={[
                    <Button key="close" type="primary" size="large" onClick={() => setPreviewModal(false)}>
                        Close Preview
                    </Button>
                ]}
            >
                <Card bordered={false}>
                    <Descriptions column={1} bordered size="middle">
                        <Descriptions.Item 
                            label={<Text strong>Subject</Text>}
                        >
                            <Text>{emailPreview.subject}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item 
                            label={<Text strong>Priority</Text>}
                        >
                            <Tag 
                                color={getPriorityColor(emailPreview.priority)} 
                                icon={getPriorityIcon(emailPreview.priority)}
                            >
                                {emailPreview.priority?.toUpperCase()}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item 
                            label={<Text strong>Recipients</Text>}
                        >
                            <Badge count={selectedEmployees.length} showZero />
                            <Text> employees</Text>
                        </Descriptions.Item>
                        <Descriptions.Item 
                            label={<Text strong>Message</Text>}
                        >
                            <Paragraph>{emailPreview.content}</Paragraph>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </Modal>
        </Space>
    );
};

export default AnnouncementPage;
