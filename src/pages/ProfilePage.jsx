import React, { useState, useEffect } from 'react';
import { 
    Card, 
    Row, 
    Col, 
    Spin, 
    message, 
    Button, 
    Modal, 
    Form, 
    Select, 
    Typography,
    Divider,
    Space,
    Tag
} from 'antd';
import { 
    UserOutlined, 
    EditOutlined, 
    MailOutlined, 
    PhoneOutlined, 
    IdcardOutlined, 
    TeamOutlined, 
    CalendarOutlined, 
    SafetyOutlined 
} from '@ant-design/icons';
import { getProfile } from '../services/authService';
import { getReportingManagers, updateReportingManager } from '../services/employeeService';

const { Title, Text } = Typography;

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [managers, setManagers] = useState([]);
    const [updating, setUpdating] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchProfile();
        fetchManagers();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await getProfile();
            setProfile(data.data);
        } catch (error) {
            message.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const fetchManagers = async () => {
        try {
            const data = await getReportingManagers();
            setManagers(data.data);
        } catch (error) {
            console.error('Failed to fetch managers:', error);
            message.error('Failed to fetch reporting managers');
        }
    };

    const showModal = () => {
        form.setFieldsValue({
            reporting_manager_id: profile?.reporting_manager_id
        });
        setModalVisible(true);
    };

    const handleUpdate = async (values) => {
        setUpdating(true);
        try {
            await updateReportingManager(values.reporting_manager_id);
            message.success('Reporting person updated successfully');
            setModalVisible(false);
            fetchProfile();
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to update reporting person');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: 50 }}>
                <Spin size="large" />
            </div>
        );
    }

    const InfoItem = ({ icon, label, value }) => (
        <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
                <Space size={4}>
                    {icon}
                    {label}
                </Space>
            </Text>
            <Text strong style={{ fontSize: 14 }}>{value || 'N/A'}</Text>
        </Space>
    );

    return (
        <div>
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={2} style={{ margin: 0 }}>My Profile</Title>
                <Button 
                    type="primary" 
                    icon={<EditOutlined />}
                    onClick={showModal}
                >
                    Update Reporting Person
                </Button>
            </div>

            <Row gutter={[24, 24]}>
                {/* Profile Header Card */}
                <Col span={24}>
                    <Card>
                        <Row gutter={24} align="middle">
                            <Col>
                                <div
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 8,
                                        background: '#f0f2f5',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 32
                                    }}
                                >
                                    <UserOutlined />
                                </div>
                            </Col>
                            <Col flex="auto">
                                <Space direction="vertical" size={4}>
                                    <Title level={3} style={{ margin: 0 }}>{profile?.name}</Title>
                                    <Text type="secondary" style={{ fontSize: 16 }}>{profile?.designation || 'N/A'}</Text>
                                    <Tag>{profile?.role_name?.toUpperCase()}</Tag>
                                </Space>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* Basic Information */}
                <Col xs={24} lg={12}>
                    <Card title="Basic Information" bordered={false}>
                        <Space direction="vertical" size={24} style={{ width: '100%' }}>
                            <InfoItem 
                                icon={<IdcardOutlined />}
                                label="Employee ID" 
                                value={profile?.employee_id} 
                            />
                            <Divider style={{ margin: 0 }} />
                            <InfoItem 
                                icon={<MailOutlined />}
                                label="Email Address" 
                                value={profile?.email} 
                            />
                            <Divider style={{ margin: 0 }} />
                            <InfoItem 
                                icon={<PhoneOutlined />}
                                label="Mobile Number" 
                                value={profile?.mobile_number} 
                            />
                            <Divider style={{ margin: 0 }} />
                            <InfoItem 
                                icon={<SafetyOutlined />}
                                label="Role" 
                                value={profile?.role_name?.toUpperCase()} 
                            />
                        </Space>
                    </Card>
                </Col>

                {/* Work Information */}
                <Col xs={24} lg={12}>
                    <Card title="Work Information" bordered={false}>
                        <Space direction="vertical" size={24} style={{ width: '100%' }}>
                            <InfoItem 
                                icon={<TeamOutlined />}
                                label="Department" 
                                value={profile?.department_name} 
                            />
                            <Divider style={{ margin: 0 }} />
                            <InfoItem 
                                icon={<UserOutlined />}
                                label="Reporting Person" 
                                value={profile?.reporting_manager_name || 'Not Assigned'} 
                            />
                            <Divider style={{ margin: 0 }} />
                            <InfoItem 
                                icon={<CalendarOutlined />}
                                label="Date of Joining" 
                                value={profile?.date_of_joining ? new Date(profile.date_of_joining).toLocaleDateString('en-GB') : null} 
                            />
                            <Divider style={{ margin: 0 }} />
                            <InfoItem 
                                icon={<CalendarOutlined />}
                                label="Date of Birth" 
                                value={profile?.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString('en-GB') : null} 
                            />
                        </Space>
                    </Card>
                </Col>
            </Row>

            <Modal
                title="Update Reporting Person"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={500}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleUpdate}
                    style={{ marginTop: 24 }}
                >
                    <Form.Item
                        name="reporting_manager_id"
                        label="Select Reporting Person"
                        rules={[{ required: true, message: 'Please select a reporting person' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Select TL, Manager, or HR"
                            optionFilterProp="children"
                            size="large"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {managers.map(manager => (
                                <Select.Option key={manager.emp_id} value={manager.emp_id}>
                                    {manager.name} - {manager.role_name?.toUpperCase()} 
                                    {manager.designation && ` (${manager.designation})`}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={() => setModalVisible(false)}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit" loading={updating}>
                                Update
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProfilePage;
