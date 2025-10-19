import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, message, Switch, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const DepartmentPage = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState(null);
    const [form] = Form.useForm();
    const { user } = useAuth();

    const canCreate = ['hr', 'superadmin'].includes(user?.role_name);
    const canEdit = ['hr', 'superadmin'].includes(user?.role_name);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        setLoading(true);
        try {
            const response = await api.get('/departments');
            setDepartments(response.data.data || []);
        } catch (error) {
            message.error('Failed to fetch departments');
        } finally {
            setLoading(false);
        }
    };

    const showModal = (department = null) => {
        setEditingDepartment(department);
        if (department) {
            form.setFieldsValue(department);
        } else {
            form.resetFields();
            form.setFieldsValue({ is_active: true });
        }
        setModalVisible(true);
    };

    const handleSubmit = async (values) => {
        try {
            if (editingDepartment) {
                await api.put(`/departments/${editingDepartment.id}`, values);
                message.success('Department updated successfully');
            } else {
                await api.post('/departments', values);
                message.success('Department created successfully');
            }
            setModalVisible(false);
            fetchDepartments();
        } catch (error) {
            message.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        Modal.confirm({
            title: 'Confirm Deactivation',
            content: 'Are you sure you want to deactivate this department?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await api.delete(`/departments/${id}`);
                    message.success('Department deactivated successfully');
                    fetchDepartments();
                } catch (error) {
                    message.error('Failed to deactivate department');
                }
            }
        });
    };

    const columns = [
        {
            title: 'Department Name',
            dataIndex: 'department_name',
            key: 'department_name',
            sorter: (a, b) => a.department_name.localeCompare(b.department_name),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            align: 'center',
            render: (active) => (
                <Tag color={active ? 'green' : 'red'}>
                    {active ? 'Active' : 'Inactive'}
                </Tag>
            ),
            filters: [
                { text: 'Active', value: true },
                { text: 'Inactive', value: false }
            ],
            onFilter: (value, record) => record.is_active === value,
        },
        {
            title: 'Created',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => date ? new Date(date).toLocaleDateString() : '-',
        }
    ];

    if (canEdit) {
        columns.push({
            title: 'Actions',
            key: 'actions',
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => showModal(record)}
                    >
                        Edit
                    </Button>
                    {record.is_active && (
                        <Button
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record.id)}
                        >
                            Deactivate
                        </Button>
                    )}
                </Space>
            )
        });
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h1>Department Management</h1>
                {canCreate && (
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => showModal()}
                        size="large"
                    >
                        Add Department
                    </Button>
                )}
            </div>

            <Card>
                <Table
                    dataSource={departments}
                    columns={columns}
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            <Modal
                title={
                    <Space>
                        {editingDepartment ? <EditOutlined /> : <PlusOutlined />}
                        {editingDepartment ? 'Edit Department' : 'Add New Department'}
                    </Space>
                }
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="department_name"
                        label="Department Name"
                        rules={[{ required: true, message: 'Please enter department name' }]}
                    >
                        <Input placeholder="e.g., Human Resources, IT, Sales" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder="Brief description of the department"
                        />
                    </Form.Item>

                    {editingDepartment && (
                        <Form.Item
                            name="is_active"
                            label="Active Status"
                            valuePropName="checked"
                        >
                            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                        </Form.Item>
                    )}

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Space>
                            <Button type="primary" htmlType="submit" size="large">
                                {editingDepartment ? 'Update' : 'Create'}
                            </Button>
                            <Button onClick={() => setModalVisible(false)} size="large">
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DepartmentPage;
