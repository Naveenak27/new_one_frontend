// import React, { useState, useEffect } from 'react';
// import { Table, Button, Space, Modal, Form, Input, message, Switch, InputNumber, Tag, Popconfirm } from 'antd';
// import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
// import api from '../services/api';


// const LeaveTypesManagement = () => {
//     const [leaveTypes, setLeaveTypes] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [modalVisible, setModalVisible] = useState(false);
//     const [editingLeaveType, setEditingLeaveType] = useState(null);
//     const [submitting, setSubmitting] = useState(false);
//     const [form] = Form.useForm();


//     useEffect(() => {
//         fetchLeaveTypes();
//     }, []);


//     const fetchLeaveTypes = async () => {
//         setLoading(true);
//         try {
//             const response = await api.get('/leave-types');
//             setLeaveTypes(response.data.data);
//         } catch (error) {
//             message.error('Failed to fetch leave types: ' + (error.response?.data?.message || error.message));
//         } finally {
//             setLoading(false);
//         }
//     };


//     const showModal = (leaveType = null) => {
//         setEditingLeaveType(leaveType);
//         if (leaveType) {
//             form.setFieldsValue({
//                 leave_code: leaveType.leave_code,
//                 leave_name: leaveType.leave_name,
//                 description: leaveType.description,
//                 max_days_per_year: leaveType.max_days_per_year,
//                 is_carry_forward: Boolean(leaveType.is_carry_forward),
//                 is_active: Boolean(leaveType.is_active)
//             });
//         } else {
//             form.resetFields();
//             form.setFieldsValue({
//                 is_carry_forward: false,
//                 is_active: true
//             });
//         }
//         setModalVisible(true);
//     };


//     const handleSubmit = async (values) => {
//         setSubmitting(true);
//         try {
//             if (editingLeaveType) {
//                 await api.put(`/leave-types/${editingLeaveType.id}`, values);
//                 message.success('Leave type updated successfully');
//             } else {
//                 await api.post('/leave-types', values);
//                 message.success('Leave type created successfully');
//             }
//             setModalVisible(false);
//             form.resetFields();
//             fetchLeaveTypes();
//         } catch (error) {
//             message.error(error.response?.data?.message || 'Operation failed');
//         } finally {
//             setSubmitting(false);
//         }
//     };


//     const handleDelete = async (id) => {
//         try {
//             const response = await api.delete(`/leave-types/${id}`);
//             message.success(response.data.message || 'Leave type deleted successfully');
//             fetchLeaveTypes();
//         } catch (error) {
//             message.error(error.response?.data?.message || 'Failed to delete leave type');
//         }
//     };


//     const columns = [
//         {
//             title: 'Code',
//             dataIndex: 'leave_code',
//             key: 'leave_code',
//             width: 100,
//             render: (code) => <Tag color="blue" style={{ fontSize: '13px', fontWeight: 'bold' }}>{code}</Tag>
//         },
//         {
//             title: 'Leave Name',
//             dataIndex: 'leave_name',
//             key: 'leave_name',
//             width: 200,
//             render: (name) => <strong>{name}</strong>
//         },
//         {
//             title: 'Description',
//             dataIndex: 'description',
//             key: 'description',
//             ellipsis: true,
//             render: (text) => text || <span style={{ color: '#999' }}>-</span>
//         },
//         {
//             title: 'Max Days/Year',
//             dataIndex: 'max_days_per_year',
//             key: 'max_days_per_year',
//             width: 140,
//             align: 'center',
//             render: (days) => {
//                 if (!days) return <Tag color="purple">Unlimited</Tag>;
//                 return <Tag color="green">{days} days</Tag>;
//             }
//         },
//         {
//             title: 'Carry Forward',
//             dataIndex: 'is_carry_forward',
//             key: 'is_carry_forward',
//             width: 140,
//             align: 'center',
//             render: (carry) => (
//                 <Tag 
//                     color={carry ? 'green' : 'orange'} 
//                     icon={carry ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
//                 >
//                     {carry ? 'Yes' : 'No'}
//                 </Tag>
//             )
//         },
//         {
//             title: 'Status',
//             dataIndex: 'is_active',
//             key: 'is_active',
//             width: 100,
//             align: 'center',
//             render: (active) => (
//                 <Tag color={active ? 'success' : 'error'}>
//                     {active ? 'Active' : 'Inactive'}
//                 </Tag>
//             )
//         },
//         {
//             title: 'Action',
//             key: 'action',
//             width: 180,
//             align: 'center',
//             fixed: 'right',
//             render: (_, record) => (
//                 <Space size={4} align="center">
//                     <Button
//                         type="primary"
//                         size="small"
//                         icon={<EditOutlined />}
//                         onClick={() => showModal(record)}
//                         style={{ 
//                             display: 'inline-flex', 
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             fontSize: '13px',
//                             padding: '0 8px',
//                             height: '28px'
//                         }}
//                     >
//                         Edit
//                     </Button>
//                     <Popconfirm
//                         title="Delete Leave Type"
//                         description="Are you sure you want to delete this leave type?"
//                         onConfirm={() => handleDelete(record.id)}
//                         okText="Yes"
//                         cancelText="No"
//                         okButtonProps={{ danger: true }}
//                     >
//                         <Button
//                             danger
//                             size="small"
//                             icon={<DeleteOutlined />}
//                             style={{ 
//                                 display: 'inline-flex', 
//                                 alignItems: 'center',
//                                 justifyContent: 'center',
//                                 fontSize: '13px',
//                                 padding: '0 8px',
//                                 height: '28px'
//                             }}
//                         >
//                             Delete
//                         </Button>
//                     </Popconfirm>
//                 </Space>
//             )
//         }
//     ];


//     return (
//         <div>
//             <div style={{ 
//                 display: 'flex', 
//                 justifyContent: 'space-between', 
//                 alignItems: 'center', 
//                 marginBottom: 16,
//                 flexWrap: 'wrap',
//                 gap: 16
//             }}>
//                 <h3 style={{ margin: 0 }}>Leave Types Configuration</h3>
//                 <Button
//                     type="primary"
//                     icon={<PlusOutlined />}
//                     onClick={() => showModal()}
//                 >
//                     Add Leave Type
//                 </Button>
//             </div>


//             <Table
//                 dataSource={leaveTypes}
//                 columns={columns}
//                 loading={loading}
//                 rowKey="id"
//                 pagination={{ pageSize: 10 }}
//                 bordered
//                 scroll={{ x: 1000 }}
//             />


//             <Modal
//                 title={
//                     <Space align="center">
//                         {editingLeaveType ? <EditOutlined /> : <PlusOutlined />}
//                         {editingLeaveType ? 'Edit Leave Type' : 'Add New Leave Type'}
//                     </Space>
//                 }
//                 open={modalVisible}
//                 onCancel={() => {
//                     setModalVisible(false);
//                     form.resetFields();
//                 }}
//                 footer={null}
//                 width={600}
//                 destroyOnClose
//             >
//                 <Form
//                     form={form}
//                     layout="vertical"
//                     onFinish={handleSubmit}
//                     autoComplete="off"
//                 >
//                     {!editingLeaveType && (
//                         <Form.Item
//                             name="leave_code"
//                             label="Leave Code"
//                             rules={[
//                                 { required: true, message: 'Please enter leave code' },
//                                 { max: 10, message: 'Code must be max 10 characters' },
//                                 { pattern: /^[A-Z]+$/, message: 'Only uppercase letters allowed' }
//                             ]}
//                             tooltip="Use uppercase letters only (e.g., CL, EL, ML)"
//                         >
//                             <Input 
//                                 placeholder="e.g., CL, EL, ML" 
//                                 maxLength={10}
//                                 style={{ textTransform: 'uppercase' }}
//                                 onChange={(e) => {
//                                     const value = e.target.value.toUpperCase();
//                                     form.setFieldsValue({ leave_code: value });
//                                 }}
//                             />
//                         </Form.Item>
//                     )}


//                     <Form.Item
//                         name="leave_name"
//                         label="Leave Name"
//                         rules={[
//                             { required: true, message: 'Please enter leave name' },
//                             { max: 100, message: 'Name must be max 100 characters' }
//                         ]}
//                     >
//                         <Input placeholder="e.g., Casual Leave" />
//                     </Form.Item>


//                     <Form.Item
//                         name="description"
//                         label="Description"
//                         rules={[
//                             { max: 255, message: 'Description must be max 255 characters' }
//                         ]}
//                     >
//                         <Input.TextArea 
//                             rows={3} 
//                             placeholder="Brief description of the leave type" 
//                         />
//                     </Form.Item>


//                     <Form.Item
//                         name="max_days_per_year"
//                         label="Maximum Days Per Year"
//                         tooltip="Leave empty or 0 for unlimited days"
//                     >
//                         <InputNumber 
//                             min={0} 
//                             max={365}
//                             style={{ width: '100%' }} 
//                             placeholder="e.g., 12 (0 or empty = unlimited)"
//                         />
//                     </Form.Item>


//                     <Form.Item
//                         name="is_carry_forward"
//                         label="Carry Forward to Next Month"
//                         valuePropName="checked"
//                         tooltip="If enabled, unused leaves will be added to next month's balance"
//                     >
//                         <Switch 
//                             checkedChildren="Yes" 
//                             unCheckedChildren="No"
//                         />
//                     </Form.Item>


//                     {editingLeaveType && (
//                         <Form.Item
//                             name="is_active"
//                             label="Active Status"
//                             valuePropName="checked"
//                             tooltip="Inactive leave types won't be available for application"
//                         >
//                             <Switch 
//                                 checkedChildren="Active" 
//                                 unCheckedChildren="Inactive"
//                             />
//                         </Form.Item>
//                     )}


//                     <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
//                         <Space>
//                             <Button 
//                                 type="primary" 
//                                 htmlType="submit" 
//                                 loading={submitting}
//                             >
//                                 {editingLeaveType ? 'Update' : 'Create'}
//                             </Button>
//                             <Button 
//                                 onClick={() => {
//                                     setModalVisible(false);
//                                     form.resetFields();
//                                 }} 
//                                 disabled={submitting}
//                             >
//                                 Cancel
//                             </Button>
//                         </Space>
//                     </Form.Item>
//                 </Form>
//             </Modal>
//         </div>
//     );
// };


// export default LeaveTypesManagement;


import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Drawer, Form, Input, message, Switch, InputNumber, Tag, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import api from '../services/api';

const LeaveTypesManagement = () => {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [editingLeaveType, setEditingLeaveType] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchLeaveTypes();
    }, []);

    const fetchLeaveTypes = async () => {
        setLoading(true);
        try {
            const response = await api.get('/leave-types');
            setLeaveTypes(response.data.data);
        } catch (error) {
            message.error('Failed to fetch leave types: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const showDrawer = (leaveType = null) => {
        setEditingLeaveType(leaveType);
        if (leaveType) {
            form.setFieldsValue({
                leave_code: leaveType.leave_code,
                leave_name: leaveType.leave_name,
                description: leaveType.description,
                max_days_per_year: leaveType.max_days_per_year,
                is_carry_forward: Boolean(leaveType.is_carry_forward),
                is_active: Boolean(leaveType.is_active)
            });
        } else {
            form.resetFields();
            form.setFieldsValue({
                is_carry_forward: false,
                is_active: true
            });
        }
        setDrawerVisible(true);
    };
const codeColorMap = {
  CL: 'blue',
  EL: 'green',
  LOP: 'red',
  OD: 'purple',
  WFH: 'gold',
  // Add more as needed
};

    const onCloseDrawer = () => {
        setDrawerVisible(false);
        form.resetFields();
        setEditingLeaveType(null);
    };

    const handleSubmit = async (values) => {
        setSubmitting(true);
        try {
            if (editingLeaveType) {
                await api.put(`/leave-types/${editingLeaveType.id}`, values);
                message.success('Leave type updated successfully');
            } else {
                await api.post('/leave-types', values);
                message.success('Leave type created successfully');
            }
            onCloseDrawer();
            fetchLeaveTypes();
        } catch (error) {
            message.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await api.delete(`/leave-types/${id}`);
            message.success(response.data.message || 'Leave type deleted successfully');
            fetchLeaveTypes();
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to delete leave type');
        }
    };

    const columns = [
{
    title: 'Code',
    dataIndex: 'leave_code',
    key: 'leave_code',
    width: 100,
    render: (code) => {
      const color = codeColorMap[code] || 'default';
      return (
        <Tag color={color} style={{ fontSize: '13px', fontWeight: 'bold' }}>
          {code}
        </Tag>
      );
    },
  },        {
            title: 'Leave Name',
            dataIndex: 'leave_name',
            key: 'leave_name',
            width: 200,
            render: (name) => <strong>{name}</strong>
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            render: (text) => text || <span style={{ color: '#999' }}>-</span>
        },
        {
            title: 'Max Days/Year',
            dataIndex: 'max_days_per_year',
            key: 'max_days_per_year',
            width: 140,
            align: 'center',
            render: (days) => {
                if (!days) return <Tag color="purple">Unlimited</Tag>;
                return <Tag color="green">{days} days</Tag>;
            }
        },
        {
            title: 'Carry Forward',
            dataIndex: 'is_carry_forward',
            key: 'is_carry_forward',
            width: 140,
            align: 'center',
            render: (carry) => (
                <Tag 
                    color={carry ? 'green' : 'orange'} 
                    icon={carry ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                >
                    {carry ? 'Yes' : 'No'}
                </Tag>
            )
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            width: 100,
            align: 'center',
            render: (active) => (
                <Tag color={active ? 'success' : 'error'}>
                    {active ? 'Active' : 'Inactive'}
                </Tag>
            )
        },
        {
            title: 'Action',
            key: 'action',
            width: 180,
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
                <Space size={4} align="center">
                    <Button
                        type="primary"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => showDrawer(record)}
                        style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '13px',
                            padding: '0 8px',
                            height: '28px'
                        }}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete Leave Type"
                        description="Are you sure you want to delete this leave type?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            style={{ 
                                display: 'inline-flex', 
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '13px',
                                padding: '0 8px',
                                height: '28px'
                            }}
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: 16,
                flexWrap: 'wrap',
                gap: 16
            }}>
                <h3 style={{ margin: 0 }}>Leave Types Configuration</h3>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => showDrawer()}
                >
                    Add Leave Type
                </Button>
            </div>

            <Table
                dataSource={leaveTypes}
                columns={columns}
                loading={loading}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                bordered
                scroll={{ x: 1000 }}
            />

            <Drawer
                title={
                    <Space align="center">
                        {editingLeaveType ? <EditOutlined /> : <PlusOutlined />}
                        {editingLeaveType ? 'Edit Leave Type' : 'Add New Leave Type'}
                    </Space>
                }
                placement="right"
                width={600}
                onClose={onCloseDrawer}
                open={drawerVisible}
                bodyStyle={{ paddingBottom: 80 }}
                destroyOnClose
                footer={
                    <div style={{ textAlign: 'right' }}>
                        <Space>
                            <Button 
                                onClick={onCloseDrawer} 
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="primary" 
                                onClick={() => form.submit()} 
                                loading={submitting}
                            >
                                {editingLeaveType ? 'Update' : 'Create'}
                            </Button>
                        </Space>
                    </div>
                }
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    autoComplete="off"
                >
                    {!editingLeaveType && (
                        <Form.Item
                            name="leave_code"
                            label="Leave Code"
                            rules={[
                                { required: true, message: 'Please enter leave code' },
                                { max: 10, message: 'Code must be max 10 characters' },
                                { pattern: /^[A-Z]+$/, message: 'Only uppercase letters allowed' }
                            ]}
                            tooltip="Use uppercase letters only (e.g., CL, EL, ML)"
                        >
                            <Input 
                                placeholder="e.g., CL, EL, ML" 
                                maxLength={10}
                                style={{ textTransform: 'uppercase' }}
                                onChange={(e) => {
                                    const value = e.target.value.toUpperCase();
                                    form.setFieldsValue({ leave_code: value });
                                }}
                            />
                        </Form.Item>
                    )}

                    <Form.Item
                        name="leave_name"
                        label="Leave Name"
                        rules={[
                            { required: true, message: 'Please enter leave name' },
                            { max: 100, message: 'Name must be max 100 characters' }
                        ]}
                    >
                        <Input placeholder="e.g., Casual Leave" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[
                            { max: 255, message: 'Description must be max 255 characters' }
                        ]}
                    >
                        <Input.TextArea 
                            rows={3} 
                            placeholder="Brief description of the leave type" 
                        />
                    </Form.Item>

                    <Form.Item
                        name="max_days_per_year"
                        label="Maximum Days Per Year"
                        tooltip="Leave empty or 0 for unlimited days"
                    >
                        <InputNumber 
                            min={0} 
                            max={365}
                            style={{ width: '100%' }} 
                            placeholder="e.g., 12 (0 or empty = unlimited)"
                        />
                    </Form.Item>

                    <Form.Item
                        name="is_carry_forward"
                        label="Carry Forward to Next Month"
                        valuePropName="checked"
                        tooltip="If enabled, unused leaves will be added to next month's balance"
                    >
                        <Switch 
                            checkedChildren="Yes" 
                            unCheckedChildren="No"
                        />
                    </Form.Item>

                    {editingLeaveType && (
                        <Form.Item
                            name="is_active"
                            label="Active Status"
                            valuePropName="checked"
                            tooltip="Inactive leave types won't be available for application"
                        >
                            <Switch 
                                checkedChildren="Active" 
                                unCheckedChildren="Inactive"
                            />
                        </Form.Item>
                    )}
                </Form>
            </Drawer>
        </div>
    );
};

export default LeaveTypesManagement;
