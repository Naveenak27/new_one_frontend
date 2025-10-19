// import React, { useState, useEffect } from 'react';
// import { Card, Table, Button, Modal, Form, Input, Checkbox, message, Space, Alert } from 'antd';
// import { PlusOutlined, EditOutlined } from '@ant-design/icons';
// import { getAllRoles, getModulesAndPermissions, getRolePermissions, updateRolePermissions, createRole } from '../services/roleService';

// const RolesPage = () => {
//     const [roles, setRoles] = useState([]);
//     const [modules, setModules] = useState([]);
//     const [permissions, setPermissions] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [modalVisible, setModalVisible] = useState(false);
//     const [editingRole, setEditingRole] = useState(null);
//     const [selectedPermissions, setSelectedPermissions] = useState([]);
//     const [form] = Form.useForm();

//     useEffect(() => {
//         fetchRoles();
//         fetchModulesAndPermissions();
//     }, []);

//     const fetchRoles = async () => {
//         setLoading(true);
//         try {
//             const data = await getAllRoles();
//             setRoles(data.data);
//         } catch (error) {
//             message.error('Failed to fetch roles');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchModulesAndPermissions = async () => {
//         try {
//             const data = await getModulesAndPermissions();
//             setModules(data.data.modules);
//             setPermissions(data.data.permissions);
//         } catch (error) {
//             message.error('Failed to fetch modules and permissions');
//         }
//     };

//     const showPermissionModal = async (role) => {
//         setEditingRole(role);
//         try {
//             const data = await getRolePermissions(role.id);
//             const selected = data.data.map(p => `${p.module_id}-${p.permission_id}`);
//             setSelectedPermissions(selected);
//         } catch (error) {
//             message.error('Failed to fetch role permissions');
//         }
//         setModalVisible(true);
//     };

//     const handlePermissionChange = (moduleId, permissionId, checked) => {
//         const key = `${moduleId}-${permissionId}`;
//         if (checked) {
//             setSelectedPermissions([...selectedPermissions, key]);
//         } else {
//             setSelectedPermissions(selectedPermissions.filter(p => p !== key));
//         }
//     };

//     const handleSavePermissions = async () => {
//         try {
//             const permissionArray = selectedPermissions.map(key => {
//                 const [module_id, permission_id] = key.split('-');
//                 return { module_id: parseInt(module_id), permission_id: parseInt(permission_id) };
//             });

//             await updateRolePermissions(editingRole.id, permissionArray);
            
//             Modal.success({
//                 title: 'Permissions Updated',
//                 content: 'Permissions have been updated successfully. Users with this role need to logout and login again to see the changes.',
//                 okText: 'Got it'
//             });
            
//             setModalVisible(false);
//         } catch (error) {
//             message.error('Failed to update permissions');
//         }
//     };

//     const columns = [
//         {
//             title: 'Role Name',
//             dataIndex: 'role_name',
//             key: 'role_name'
//         },
//         {
//             title: 'Description',
//             dataIndex: 'description',
//             key: 'description'
//         },
//         {
//             title: 'Action',
//             key: 'action',
//             render: (_, record) => (
//                 <Button
//                     type="primary"
//                     icon={<EditOutlined />}
//                     onClick={() => showPermissionModal(record)}
//                 >
//                     Manage Permissions
//                 </Button>
//             )
//         }
//     ];

//     return (
//         <div>
//             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
//                 <h1>Role Management</h1>
//             </div>

//             <Alert
//                 message="Important Note"
//                 description="After updating role permissions, users need to logout and login again for changes to take effect."
//                 type="info"
//                 showIcon
//                 style={{ marginBottom: 16 }}
//             />

//             <Card>
//                 <Table
//                     dataSource={roles}
//                     columns={columns}
//                     loading={loading}
//                     rowKey="id"
//                 />
//             </Card>

//             <Modal
//                 title={`Manage Permissions - ${editingRole?.role_name}`}
//                 open={modalVisible}
//                 onCancel={() => setModalVisible(false)}
//                 onOk={handleSavePermissions}
//                 width={900}
//                 okText="Save Permissions"
//             >
//                 <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
//                     <Table
//                         dataSource={modules}
//                         rowKey="id"
//                         pagination={false}
//                         size="small"
//                         columns={[
//                             {
//                                 title: 'Module',
//                                 dataIndex: 'module_name',
//                                 key: 'module_name',
//                                 fixed: 'left',
//                                 width: 150
//                             },
//                             ...permissions.map(perm => ({
//                                 title: perm.permission_name.charAt(0).toUpperCase() + perm.permission_name.slice(1),
//                                 key: perm.id,
//                                 width: 100,
//                                 align: 'center',
//                                 render: (_, module) => (
//                                     <Checkbox
//                                         checked={selectedPermissions.includes(`${module.id}-${perm.id}`)}
//                                         onChange={(e) => handlePermissionChange(module.id, perm.id, e.target.checked)}
//                                     />
//                                 )
//                             }))
//                         ]}
//                     />
//                 </div>
//             </Modal>
//         </div>
//     );
// };

// export default RolesPage;



import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, message, Space, Alert, Tabs, Tag } from 'antd';
import { EditOutlined, UserAddOutlined } from '@ant-design/icons';
import api from '../services/api';

const RolesPage = () => {
    const [roles, setRoles] = useState([]);
    const [modules, setModules] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [roleModalVisible, setRoleModalVisible] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [roleForm] = Form.useForm();

    useEffect(() => {
        fetchRoles();
        fetchModulesAndPermissions();
    }, []);

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const response = await api.get('/roles');
            setRoles(response.data.data || []);
        } catch (error) {
            message.error('Failed to fetch roles');
        } finally {
            setLoading(false);
        }
    };

    const fetchModulesAndPermissions = async () => {
        try {
            const [modulesRes, permissionsRes] = await Promise.all([
                api.get('/modules'),
                api.get('/permissions')
            ]);
            setModules(modulesRes.data.data || []);
            setPermissions(permissionsRes.data.data || []);
        } catch (error) {
            message.error('Failed to fetch modules and permissions');
        }
    };

    const showPermissionModal = async (role) => {
        setEditingRole(role);
        try {
            const response = await api.get(`/roles/${role.id}/permissions`);
            const selected = response.data.data.map(p => `${p.module_id}-${p.permission_id}`);
            setSelectedPermissions(selected);
        } catch (error) {
            message.error('Failed to fetch role permissions');
        }
        setModalVisible(true);
    };

    const handlePermissionChange = (moduleId, permissionId, checked) => {
        const key = `${moduleId}-${permissionId}`;
        if (checked) {
            setSelectedPermissions([...selectedPermissions, key]);
        } else {
            setSelectedPermissions(selectedPermissions.filter(p => p !== key));
        }
    };

    const handleSavePermissions = async () => {
        try {
            const permissionArray = selectedPermissions.map(key => {
                const [module_id, permission_id] = key.split('-');
                return { module_id: parseInt(module_id), permission_id: parseInt(permission_id) };
            });

            await api.put(`/roles/${editingRole.id}/permissions`, { permissions: permissionArray });
            
            Modal.success({
                title: 'Permissions Updated',
                content: 'Permissions have been updated successfully. Users with this role need to logout and login again to see the changes.',
                okText: 'Got it'
            });
            
            setModalVisible(false);
            fetchRoles();
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to update permissions');
        }
    };

    // Add/Edit Role
    const handleAddRole = async (values) => {
        try {
            if (editingRole) {
                await api.put(`/roles/${editingRole.id}`, values);
                message.success('Role updated successfully');
            } else {
                await api.post('/roles', values);
                message.success('Role created successfully');
            }
            setRoleModalVisible(false);
            setEditingRole(null);
            roleForm.resetFields();
            fetchRoles();
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to save role');
        }
    };

    // Show role modal
    const showRoleModal = (role = null) => {
        setEditingRole(role);
        if (role) {
            roleForm.setFieldsValue(role);
        } else {
            roleForm.resetFields();
        }
        setRoleModalVisible(true);
    };

    const roleColumns = [
        {
            title: 'Role Name',
            dataIndex: 'role_name',
            key: 'role_name',
            render: (text) => <Tag color="blue">{text}</Tag>
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'center',
            width: 150,
            render: (_, record) => (
                <Button
                    type="primary"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => showPermissionModal(record)}
                >
                    Permissions
                </Button>
            )
        }
    ];

    const moduleColumns = [
        {
            title: 'Module Name',
            dataIndex: 'module_name',
            key: 'module_name',
            render: (text) => <Tag color="green">{text}</Tag>
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true
        },
        {
            title: 'Created',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => date ? new Date(date).toLocaleDateString() : '-'
        }
    ];

    // Permission matrix columns
    const permissionColumns = [
        {
            title: 'Module',
            dataIndex: 'module_name',
            key: 'module_name',
            fixed: 'left',
            width: 150,
            render: (text) => <strong>{text}</strong>
        },
        ...permissions.map(perm => ({
            title: perm.permission_name.charAt(0).toUpperCase() + perm.permission_name.slice(1),
            key: perm.id,
            width: 100,
            align: 'center',
            render: (_, module) => (
                <input
                    type="checkbox"
                    checked={selectedPermissions.includes(`${module.id}-${perm.id}`)}
                    onChange={(e) => handlePermissionChange(module.id, perm.id, e.target.checked)}
                    style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                />
            )
        }))
    ];

    return (
        <div>
            <h1>Role & Permission Management</h1>

            <Alert
                message="Important Note"
                description="After updating role permissions, users need to logout and login again for changes to take effect."
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
            />

            <Tabs
                defaultActiveKey="1"
                items={[
                    {
                        key: '1',
                        label: 'Roles',
                        children: (
                            <Card
                                extra={
                                    <Button
                                        type="primary"
                                        icon={<UserAddOutlined />}
                                        onClick={() => showRoleModal()}
                                    >
                                        Add New Role
                                    </Button>
                                }
                            >
                                <Table
                                    dataSource={roles}
                                    columns={roleColumns}
                                    loading={loading}
                                    rowKey="id"
                                    pagination={{ pageSize: 10 }}
                                />
                            </Card>
                        )
                    },
                    {
                        key: '2',
                        label: 'Modules',
                        children: (
                            <Card>
                                <Table
                                    dataSource={modules}
                                    columns={moduleColumns}
                                    loading={loading}
                                    rowKey="id"
                                    pagination={{ pageSize: 10 }}
                                />
                            </Card>
                        )
                    }
                ]}
            />

            {/* Manage Permissions Modal */}
            <Modal
                title={`Manage Permissions - ${editingRole?.role_name}`}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={handleSavePermissions}
                width={900}
                okText="Save Permissions"
            >
                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    <Table
                        dataSource={modules}
                        columns={permissionColumns}
                        rowKey="id"
                        pagination={false}
                        size="small"
                        bordered
                    />
                </div>
            </Modal>

            {/* Add/Edit Role Modal */}
            <Modal
                title={editingRole ? 'Edit Role' : 'Add New Role'}
                open={roleModalVisible}
                onCancel={() => {
                    setRoleModalVisible(false);
                    setEditingRole(null);
                    roleForm.resetFields();
                }}
                footer={null}
            >
                <Form
                    form={roleForm}
                    layout="vertical"
                    onFinish={handleAddRole}
                >
                    <Form.Item
                        name="role_name"
                        label="Role Name"
                        rules={[
                            { required: true, message: 'Please enter role name' },
                            { pattern: /^[a-z]+$/, message: 'Only lowercase letters allowed' }
                        ]}
                    >
                        <Input 
                            placeholder="e.g., accountant, receptionist" 
                            disabled={!!editingRole}
                        />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                    >
                        <Input.TextArea rows={3} placeholder="Brief description of this role" />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {editingRole ? 'Update' : 'Create'}
                            </Button>
                            <Button onClick={() => {
                                setRoleModalVisible(false);
                                setEditingRole(null);
                                roleForm.resetFields();
                            }}>
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default RolesPage;
