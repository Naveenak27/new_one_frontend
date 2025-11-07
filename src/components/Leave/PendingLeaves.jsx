// import React, { useState, useEffect } from 'react';
// import { Table, Button, Space, Modal, Input, message, Tag } from 'antd';
// import { CheckOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons';
// import { getPendingLeaves, approveLeave, rejectLeave } from '../../services/leaveService';


// const { TextArea } = Input;


// const PendingLeaves = () => {
//     const [leaves, setLeaves] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [modalVisible, setModalVisible] = useState(false);
//     const [selectedLeave, setSelectedLeave] = useState(null);
//     const [comments, setComments] = useState('');
//     const [actionType, setActionType] = useState('');
//     const [searchText, setSearchText] = useState('');
//     const [filteredData, setFilteredData] = useState([]);


//     useEffect(() => {
//         fetchLeaves();
//     }, []);


//     useEffect(() => {
//         handleSearch(searchText);
//     }, [leaves, searchText]);


//     const fetchLeaves = async () => {
//         setLoading(true);
//         try {
//             const data = await getPendingLeaves();
//             setLeaves(data.data);
//         } catch (error) {
//             console.error('Error fetching leaves:', error);
//             message.error('Failed to fetch pending leaves');
//         } finally {
//             setLoading(false);
//         }
//     };


//     const handleSearch = (value) => {
//         const filtered = leaves.filter((leave) => {
//             return (
//                 leave.employee_name?.toLowerCase().includes(value.toLowerCase()) ||
//                 leave.employee_id?.toString().toLowerCase().includes(value.toLowerCase()) ||
//                 leave.leave_name?.toLowerCase().includes(value.toLowerCase()) ||
//                 leave.reason?.toLowerCase().includes(value.toLowerCase()) ||
//                 leave.reporting_manager_name?.toLowerCase().includes(value.toLowerCase()) ||
//                 leave.from_date?.toLowerCase().includes(value.toLowerCase()) ||
//                 leave.to_date?.toLowerCase().includes(value.toLowerCase())
//             );
//         });
//         setFilteredData(filtered);
//     };


//     const showActionModal = (leave, type) => {
//         setSelectedLeave(leave);
//         setActionType(type);
//         setModalVisible(true);
//         setComments('');
//     };


//     const handleAction = async () => {
//         if (actionType === 'reject' && !comments.trim()) {
//             message.error('Rejection reason is required');
//             return;
//         }


//         try {
//             if (actionType === 'approve') {
//                 await approveLeave(selectedLeave.id, comments);
//                 message.success('Leave approved successfully');
//             } else {
//                 await rejectLeave(selectedLeave.id, comments);
//                 message.success('Leave rejected successfully');
//             }
//             setModalVisible(false);
//             fetchLeaves();
//         } catch (error) {
//             message.error(error.response?.data?.message || 'Action failed');
//         }
//     };


//     const columns = [
//         {
//             title: 'Employee',
//             dataIndex: 'employee_name',
//             key: 'employee_name',
//             sorter: (a, b) => (a.employee_name || '').localeCompare(b.employee_name || ''),
//             render: (name) => <Tag color="cyan">{name}</Tag>
//         },
//         {
//             title: 'Employee ID',
//             dataIndex: 'employee_id',
//             key: 'employee_id',
//             sorter: (a, b) => {
//                 const aVal = a.employee_id || '';
//                 const bVal = b.employee_id || '';
//                 return aVal.toString().localeCompare(bVal.toString());
//             },
//             render: (id) => <Tag color="blue">{id}</Tag>
//         },
//         {
//             title: 'Reporting To',
//             dataIndex: 'reporting_manager_name',
//             key: 'reporting_manager_name',
//             sorter: (a, b) => {
//                 const aVal = a.reporting_manager_name || 'Not Assigned';
//                 const bVal = b.reporting_manager_name || 'Not Assigned';
//                 return aVal.localeCompare(bVal);
//             },
//             render: (name) => (
//                 <Tag color={name ? "purple" : "default"}>
//                     {name || 'Not Assigned'}
//                 </Tag>
//             )
//         },
//         {
//             title: 'Leave Type',
//             dataIndex: 'leave_name',
//             key: 'leave_name',
//             sorter: (a, b) => (a.leave_name || '').localeCompare(b.leave_name || ''),
//             render: (type) => <Tag color="geekblue">{type}</Tag>
//         },
//         {
//             title: 'From Date',
//             dataIndex: 'from_date',
//             key: 'from_date',
//             sorter: (a, b) => new Date(a.from_date) - new Date(b.from_date),
//             render: (date) => new Date(date).toLocaleDateString('en-GB', {
//                 day: '2-digit',
//                 month: 'short',
//                 year: 'numeric'
//             })
//         },
//         {
//             title: 'To Date',
//             dataIndex: 'to_date',
//             key: 'to_date',
//             sorter: (a, b) => new Date(a.to_date) - new Date(b.to_date),
//             render: (date) => new Date(date).toLocaleDateString('en-GB', {
//                 day: '2-digit',
//                 month: 'short',
//                 year: 'numeric'
//             })
//         },
//         {
//             title: 'Days',
//             dataIndex: 'number_of_days',
//             key: 'number_of_days',
//             sorter: (a, b) => (a.number_of_days || 0) - (b.number_of_days || 0),
//             render: (days) => (
//                 <Tag color={days >= 5 ? 'orange' : 'green'}>
//                     {days} {days === 1 ? 'day' : 'days'}
//                 </Tag>
//             )
//         },
//         {
//             title: 'Reason',
//             dataIndex: 'reason',
//             key: 'reason',
//             ellipsis: true,
//             sorter: (a, b) => (a.reason || '').localeCompare(b.reason || '')
//         },
//         {
//             title: 'Applied Date',
//             dataIndex: 'applied_date',
//             key: 'applied_date',
//             sorter: (a, b) => new Date(a.applied_date) - new Date(b.applied_date),
//             render: (date) => new Date(date).toLocaleDateString('en-GB', {
//                 day: '2-digit',
//                 month: 'short',
//                 year: 'numeric'
//             })
//         },
//         {
//             title: 'Action',
//             key: 'action',
//             fixed: 'right',
//             width: 200,
//             align: 'center',
//             render: (_, record) => (
//                 <Space size="small" align="center">
//                     <Button
//                         type="primary"
//                         size="small"
//                         icon={<CheckOutlined />}
//                         onClick={() => showActionModal(record, 'approve')}
//                         style={{ 
//                             display: 'inline-flex', 
//                             alignItems: 'center',
//                             justifyContent: 'center'
//                         }}
//                     >
//                         Approve
//                     </Button>
//                     <Button
//                         danger
//                         size="small"
//                         icon={<CloseOutlined />}
//                         onClick={() => showActionModal(record, 'reject')}
//                         style={{ 
//                             display: 'inline-flex', 
//                             alignItems: 'center',
//                             justifyContent: 'center'
//                         }}
//                     >
//                         Reject
//                     </Button>
//                 </Space>
//             )
//         }
//     ];


//     return (
//         <div>
//             <div style={{ marginBottom: 16 }}>
//                 <Input
//                     placeholder="Search by employee name, ID, leave type, reason, or reporting manager"
//                     prefix={<SearchOutlined />}
//                     onChange={(e) => setSearchText(e.target.value)}
//                     allowClear
//                     style={{ width: '100%' }}
//                 />
//             </div>


//             <Table
//                 dataSource={searchText ? filteredData : leaves}
//                 columns={columns}
//                 loading={loading}
//                 rowKey="id"
//                 scroll={{ x: 1200 }}
//                 pagination={{
//                     pageSize: 10,
//                     showSizeChanger: true,
//                     showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} pending leaves`
//                 }}
//             />


//             <Modal
//                 title={
//                     <Space align="center">
//                         {actionType === 'approve' ? (
//                             <>
//                                 <CheckOutlined style={{ color: '#52c41a', fontSize: 18 }} />
//                                 <span>Approve Leave</span>
//                             </>
//                         ) : (
//                             <>
//                                 <CloseOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />
//                                 <span>Reject Leave</span>
//                             </>
//                         )}
//                     </Space>
//                 }
//                 open={modalVisible}
//                 onOk={handleAction}
//                 onCancel={() => setModalVisible(false)}
//                 okText={actionType === 'approve' ? 'Approve' : 'Reject'}
//                 okButtonProps={{ 
//                     danger: actionType === 'reject',
//                     type: actionType === 'approve' ? 'primary' : 'default'
//                 }}
//             >
//                 <div style={{ marginBottom: 16 }}>
//                     <Space direction="vertical" size="small" style={{ width: '100%' }}>
//                         <p style={{ margin: 0 }}>
//                             <strong>Employee:</strong> <Tag color="cyan">{selectedLeave?.employee_name}</Tag>
//                         </p>
//                         <p style={{ margin: 0 }}>
//                             <strong>Employee ID:</strong> <Tag color="blue">{selectedLeave?.employee_id}</Tag>
//                         </p>
//                         <p style={{ margin: 0 }}>
//                             <strong>Leave Type:</strong> <Tag color="geekblue">{selectedLeave?.leave_name}</Tag>
//                         </p>
//                         <p style={{ margin: 0 }}>
//                             <strong>Duration:</strong> <Tag color="green">{selectedLeave?.number_of_days} days</Tag>
//                         </p>
//                         <p style={{ margin: 0 }}>
//                             <strong>From:</strong> {selectedLeave?.from_date && new Date(selectedLeave.from_date).toLocaleDateString('en-GB')}
//                         </p>
//                         <p style={{ margin: 0 }}>
//                             <strong>To:</strong> {selectedLeave?.to_date && new Date(selectedLeave.to_date).toLocaleDateString('en-GB')}
//                         </p>
//                         <p style={{ margin: 0 }}>
//                             <strong>Reason:</strong> {selectedLeave?.reason}
//                         </p>
//                     </Space>
//                 </div>
//                 <TextArea
//                     rows={4}
//                     placeholder={actionType === 'approve' ? 'Add approval comments (optional)' : 'Add rejection reason (required)'}
//                     value={comments}
//                     onChange={(e) => setComments(e.target.value)}
//                 />
//             </Modal>
//         </div>
//     );
// };


// export default PendingLeaves;


// import React, { useState, useEffect } from 'react';
// import { Table, Button, Space, Modal, Input, message, Tag, Drawer, Row, Col, Divider, Typography } from 'antd';
// import { CheckOutlined, CloseOutlined, SearchOutlined, EyeOutlined, ClockCircleOutlined } from '@ant-design/icons';
// import { getPendingLeaves, approveLeave, rejectLeave } from '../../services/leaveService';

// const { TextArea } = Input;
// const { Text, Title } = Typography;

// const PendingLeaves = () => {
//     const [leaves, setLeaves] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [modalVisible, setModalVisible] = useState(false);
//     const [drawerVisible, setDrawerVisible] = useState(false);
//     const [selectedLeave, setSelectedLeave] = useState(null);
//     const [comments, setComments] = useState('');
//     const [actionType, setActionType] = useState('');
//     const [searchText, setSearchText] = useState('');
//     const [filteredData, setFilteredData] = useState([]);

//     useEffect(() => {
//         fetchLeaves();
//     }, []);

//     useEffect(() => {
//         handleSearch(searchText);
//     }, [leaves, searchText]);

//     const fetchLeaves = async () => {
//         setLoading(true);
//         try {
//             const data = await getPendingLeaves();
//             setLeaves(data.data);
//         } catch (error) {
//             console.error('Error fetching leaves:', error);
//             message.error('Failed to fetch pending leaves');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSearch = (value) => {
//         const filtered = leaves.filter((leave) => {
//             return (
//                 leave.employee_name?.toLowerCase().includes(value.toLowerCase()) ||
//                 leave.employee_id?.toString().toLowerCase().includes(value.toLowerCase()) ||
//                 leave.leave_name?.toLowerCase().includes(value.toLowerCase()) ||
//                 leave.reason?.toLowerCase().includes(value.toLowerCase()) ||
//                 leave.reporting_manager_name?.toLowerCase().includes(value.toLowerCase()) ||
//                 leave.from_date?.toLowerCase().includes(value.toLowerCase()) ||
//                 leave.to_date?.toLowerCase().includes(value.toLowerCase())
//             );
//         });
//         setFilteredData(filtered);
//     };

//     const showDrawer = (record) => {
//         setSelectedLeave(record);
//         setDrawerVisible(true);
//     };

//     const closeDrawer = () => {
//         setDrawerVisible(false);
//         setSelectedLeave(null);
//     };

//     const showActionModal = (leave, type) => {
//         setSelectedLeave(leave);
//         setActionType(type);
//         setModalVisible(true);
//         setComments('');
//         setDrawerVisible(false);
//     };

//     const handleAction = async () => {
//         if (actionType === 'reject' && !comments.trim()) {
//             message.error('Rejection reason is required');
//             return;
//         }

//         try {
//             if (actionType === 'approve') {
//                 await approveLeave(selectedLeave.id, comments);
//                 message.success('Leave approved successfully');
//             } else {
//                 await rejectLeave(selectedLeave.id, comments);
//                 message.success('Leave rejected successfully');
//             }
//             setModalVisible(false);
//             fetchLeaves();
//         } catch (error) {
//             message.error(error.response?.data?.message || 'Action failed');
//         }
//     };

//     const columns = [
//         {
//             title: 'Applied Date',
//             dataIndex: 'applied_date',
//             key: 'applied_date',
//             width: 120,
//             sorter: (a, b) => new Date(a.applied_date) - new Date(b.applied_date),
//             render: (date) => new Date(date).toLocaleDateString('en-GB', {
//                 day: '2-digit',
//                 month: 'short',
//                 year: 'numeric'
//             })
//         },
//         {
//             title: 'Employee',
//             dataIndex: 'employee_name',
//             key: 'employee_name',
//             width: 150,
//             sorter: (a, b) => (a.employee_name || '').localeCompare(b.employee_name || ''),
//             render: (name, record) => (
//                 <div>
//                     <div>{name}</div>
//                     <Text type="secondary" style={{ fontSize: '12px' }}>ID: {record.employee_id}</Text>
//                 </div>
//             )
//         },
//         {
//             title: 'Reporting To',
//             dataIndex: 'reporting_manager_name',
//             key: 'reporting_manager_name',
//             width: 140,
//             sorter: (a, b) => {
//                 const aVal = a.reporting_manager_name || 'Not Assigned';
//                 const bVal = b.reporting_manager_name || 'Not Assigned';
//                 return aVal.localeCompare(bVal);
//             },
//             render: (name) => name || <Text type="secondary">Not Assigned</Text>
//         },
//         {
//             title: 'Leave Type',
//             dataIndex: 'leave_name',
//             key: 'leave_name',
//             width: 130,
//             sorter: (a, b) => (a.leave_name || '').localeCompare(b.leave_name || '')
//         },
//         {
//             title: 'From Date',
//             dataIndex: 'from_date',
//             key: 'from_date',
//             width: 120,
//             sorter: (a, b) => new Date(a.from_date) - new Date(b.from_date),
//             render: (date) => new Date(date).toLocaleDateString('en-GB', {
//                 day: '2-digit',
//                 month: 'short',
//                 year: 'numeric'
//             })
//         },
//         {
//             title: 'To Date',
//             dataIndex: 'to_date',
//             key: 'to_date',
//             width: 120,
//             sorter: (a, b) => new Date(a.to_date) - new Date(b.to_date),
//             render: (date) => new Date(date).toLocaleDateString('en-GB', {
//                 day: '2-digit',
//                 month: 'short',
//                 year: 'numeric'
//             })
//         },
//         {
//             title: 'Days',
//             dataIndex: 'number_of_days',
//             key: 'number_of_days',
//             width: 100,
//             align: 'center',
//             sorter: (a, b) => (a.number_of_days || 0) - (b.number_of_days || 0),
//             render: (days, record) => {
//                 if (record.leave_code === 'OD') {
//                     return <Tag color="purple">OD</Tag>;
//                 }
//                 return (
//                     <Tag color={days >= 5 ? 'orange' : 'green'}>
//                         {days} {days === 1 ? 'day' : 'days'}
//                     </Tag>
//                 );
//             }
//         },
//         {
//             title: 'Action',
//             key: 'action',
//             fixed: 'right',
//             width: 250,
//             align: 'center',
//             render: (_, record) => (
//                 <Space size="small">
//                     <Button
//                         type="primary"
//                         ghost
//                         size="small"
//                         icon={<EyeOutlined />}
//                         onClick={() => showDrawer(record)}
//                     >
//                         View
//                     </Button>
//                     <Button
//                         type="primary"
//                         size="small"
//                         icon={<CheckOutlined />}
//                         onClick={() => showActionModal(record, 'approve')}
//                     >
//                         Approve
//                     </Button>
//                     <Button
//                         danger
//                         size="small"
//                         icon={<CloseOutlined />}
//                         onClick={() => showActionModal(record, 'reject')}
//                     >
//                         Reject
//                     </Button>
//                 </Space>
//             )
//         }
//     ];

//     return (
//         <div>
//             <div style={{ marginBottom: 16 }}>
//                 <Input
//                     placeholder="Search by employee name, ID, leave type, reason, or reporting manager"
//                     prefix={<SearchOutlined />}
//                     onChange={(e) => setSearchText(e.target.value)}
//                     allowClear
//                     style={{ width: '100%' }}
//                 />
//             </div>

//             <Table
//                 dataSource={searchText ? filteredData : leaves}
//                 columns={columns}
//                 loading={loading}
//                 rowKey="id"
//                 bordered
//                 size="middle"
//                 scroll={{ x: 1300 }}
//                 pagination={{
//                     pageSize: 10,
//                     showSizeChanger: true,
//                     pageSizeOptions: ['10', '20', '50'],
//                     showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} pending leaves`
//                 }}
//             />

//             {/* View Details Drawer */}
//             <Drawer
//                 title={
//                     <Space>
//                         <EyeOutlined style={{ fontSize: '20px' }} />
//                         <span>Leave Request Details</span>
//                     </Space>
//                 }
//                 placement="right"
//                 onClose={closeDrawer}
//                 open={drawerVisible}
//                 width={550}
//                 footer={
//                     <Space style={{ float: 'right' }}>
//                         <Button onClick={closeDrawer}>Close</Button>
//                         <Button
//                             type="primary"
//                             icon={<CheckOutlined />}
//                             onClick={() => showActionModal(selectedLeave, 'approve')}
//                         >
//                             Approve
//                         </Button>
//                         <Button
//                             danger
//                             icon={<CloseOutlined />}
//                             onClick={() => showActionModal(selectedLeave, 'reject')}
//                         >
//                             Reject
//                         </Button>
//                     </Space>
//                 }
//             >
//                 {selectedLeave && (
//                     <div>
//                         {/* Employee Information */}
//                         <div style={{
//                             backgroundColor: '#f5f5f5',
//                             padding: '16px',
//                             borderRadius: '8px',
//                             marginBottom: '20px',
//                             border: '1px solid #d9d9d9'
//                         }}>
//                             <Title level={5} style={{ marginTop: 0, marginBottom: '12px' }}>
//                                 Employee Information
//                             </Title>
//                             <Row gutter={[16, 12]}>
//                                 <Col span={12}>
//                                     <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
//                                         Employee Name
//                                     </Text>
//                                     <Text strong style={{ fontSize: '14px' }}>
//                                         {selectedLeave.employee_name}
//                                     </Text>
//                                 </Col>
//                                 <Col span={12}>
//                                     <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
//                                         Employee ID
//                                     </Text>
//                                     <Text strong style={{ fontSize: '14px' }}>
//                                         {selectedLeave.employee_id}
//                                     </Text>
//                                 </Col>
//                                 <Col span={24}>
//                                     <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
//                                         Reporting Manager
//                                     </Text>
//                                     <Text strong style={{ fontSize: '14px' }}>
//                                         {selectedLeave.reporting_manager_name || 'Not Assigned'}
//                                     </Text>
//                                 </Col>
//                             </Row>
//                         </div>

//                         <Divider />

//                         {/* Leave Details */}
//                         <Row gutter={[16, 20]}>
//                             <Col span={24}>
//                                 <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>
//                                     Leave Type
//                                 </Text>
//                                 <Text strong style={{ fontSize: '16px' }}>
//                                     {selectedLeave.leave_name}
//                                 </Text>
//                             </Col>

//                             <Col span={12}>
//                                 <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>
//                                     From Date
//                                 </Text>
//                                 <Text strong style={{ fontSize: '14px' }}>
//                                     {new Date(selectedLeave.from_date).toLocaleDateString('en-GB', {
//                                         day: '2-digit',
//                                         month: 'short',
//                                         year: 'numeric'
//                                     })}
//                                 </Text>
//                             </Col>

//                             <Col span={12}>
//                                 <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>
//                                     To Date
//                                 </Text>
//                                 <Text strong style={{ fontSize: '14px' }}>
//                                     {new Date(selectedLeave.to_date).toLocaleDateString('en-GB', {
//                                         day: '2-digit',
//                                         month: 'short',
//                                         year: 'numeric'
//                                     })}
//                                 </Text>
//                             </Col>

//                             <Col span={12}>
//                                 <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>
//                                     Number of Days
//                                 </Text>
//                                 <Text strong style={{ fontSize: '14px' }}>
//                                     {selectedLeave.number_of_days} {selectedLeave.number_of_days === 1 ? 'day' : 'days'}
//                                     {selectedLeave.is_half_day && ' (Half Day)'}
//                                 </Text>
//                             </Col>

//                             <Col span={12}>
//                                 <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>
//                                     Applied Date
//                                 </Text>
//                                 <Text style={{ fontSize: '14px' }}>
//                                     {new Date(selectedLeave.applied_date).toLocaleDateString('en-GB', {
//                                         day: '2-digit',
//                                         month: 'short',
//                                         year: 'numeric'
//                                     })}
//                                 </Text>
//                             </Col>
//                         </Row>

//                         {/* OD Time Details */}
//                         {(selectedLeave.od_start_time && selectedLeave.od_end_time) && (
//                             <>
//                                 <Divider />
//                                 <div style={{
//                                     backgroundColor: '#f5f5f5',
//                                     padding: '20px',
//                                     borderRadius: '8px',
//                                     border: '1px solid #d9d9d9'
//                                 }}>
//                                     <Title level={5} style={{ marginTop: 0, marginBottom: '16px' }}>
//                                         <ClockCircleOutlined style={{ marginRight: '8px', color: '#722ed1' }} />
//                                         On Duty Time Details
//                                     </Title>

//                                     <Row gutter={[16, 16]}>
//                                         <Col span={24}>
//                                             <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>
//                                                 Start Time
//                                             </Text>
//                                             <div style={{
//                                                 backgroundColor: '#fff',
//                                                 padding: '10px 12px',
//                                                 borderRadius: '4px',
//                                                 border: '1px solid #d9d9d9'
//                                             }}>
//                                                 <Text strong style={{ fontSize: '16px', color: '#722ed1' }}>
//                                                     {selectedLeave.od_start_time}
//                                                 </Text>
//                                             </div>
//                                         </Col>

//                                         <Col span={24}>
//                                             <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>
//                                                 End Time
//                                             </Text>
//                                             <div style={{
//                                                 backgroundColor: '#fff',
//                                                 padding: '10px 12px',
//                                                 borderRadius: '4px',
//                                                 border: '1px solid #d9d9d9'
//                                             }}>
//                                                 <Text strong style={{ fontSize: '16px', color: '#722ed1' }}>
//                                                     {selectedLeave.od_end_time}
//                                                 </Text>
//                                             </div>
//                                         </Col>

//                                         <Col span={24}>
//                                             <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>
//                                                 Total Duration
//                                             </Text>
//                                             <div style={{
//                                                 backgroundColor: '#fff',
//                                                 padding: '10px 12px',
//                                                 borderRadius: '4px',
//                                                 border: '1px solid #722ed1',
//                                                 textAlign: 'center'
//                                             }}>
//                                                 <Text strong style={{ fontSize: '18px', color: '#722ed1' }}>
//                                                     {selectedLeave.od_hours} hours
//                                                 </Text>
//                                             </div>
//                                         </Col>
//                                     </Row>
//                                 </div>
//                             </>
//                         )}

//                         {/* Reason */}
//                         {selectedLeave.reason && (
//                             <>
//                                 <Divider />
//                                 <div>
//                                     <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
//                                         Reason
//                                     </Text>
//                                     <div style={{
//                                         backgroundColor: '#f5f5f5',
//                                         padding: '12px',
//                                         borderRadius: '4px',
//                                         border: '1px solid #d9d9d9'
//                                     }}>
//                                         <Text style={{ fontSize: '14px' }}>
//                                             {selectedLeave.reason}
//                                         </Text>
//                                     </div>
//                                 </div>
//                             </>
//                         )}
//                     </div>
//                 )}
//             </Drawer>

//             {/* Approval/Rejection Modal */}
//             <Modal
//                 title={
//                     <Space align="center">
//                         {actionType === 'approve' ? (
//                             <>
//                                 <CheckOutlined style={{ color: '#52c41a', fontSize: 18 }} />
//                                 <span>Approve {selectedLeave?.leave_code === 'OD' ? 'Over Duty' : 'Leave'}</span>
//                             </>
//                         ) : (
//                             <>
//                                 <CloseOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />
//                                 <span>Reject {selectedLeave?.leave_code === 'OD' ? 'Over Duty' : 'Leave'}</span>
//                             </>
//                         )}
//                     </Space>
//                 }
//                 open={modalVisible}
//                 onOk={handleAction}
//                 onCancel={() => setModalVisible(false)}
//                 okText={actionType === 'approve' ? 'Approve' : 'Reject'}
//                 okButtonProps={{
//                     danger: actionType === 'reject',
//                     type: actionType === 'approve' ? 'primary' : 'default'
//                 }}
//             >
//                 <div style={{ marginBottom: 16 }}>
//                     <Space direction="vertical" size="small" style={{ width: '100%' }}>
//                         <p style={{ margin: 0 }}>
//                             <strong>Employee:</strong> {selectedLeave?.employee_name}
//                         </p>
//                         <p style={{ margin: 0 }}>
//                             <strong>Employee ID:</strong> {selectedLeave?.employee_id}
//                         </p>
//                         <p style={{ margin: 0 }}>
//                             <strong>Leave Type:</strong> {selectedLeave?.leave_name}
//                             {selectedLeave?.is_half_day && ' (Half Day)'}
//                             {selectedLeave?.leave_code === 'OD' && ' (Over Duty)'}
//                         </p>
//                         {selectedLeave?.leave_code !== 'OD' && (
//                             <p style={{ margin: 0 }}>
//                                 <strong>Duration:</strong> {selectedLeave?.number_of_days} days
//                             </p>
//                         )}
//                         <p style={{ margin: 0 }}>
//                             <strong>From:</strong> {selectedLeave?.from_date && new Date(selectedLeave.from_date).toLocaleDateString('en-GB')}
//                         </p>
//                         <p style={{ margin: 0 }}>
//                             <strong>To:</strong> {selectedLeave?.to_date && new Date(selectedLeave.to_date).toLocaleDateString('en-GB')}
//                         </p>
//                         {selectedLeave?.od_start_time && selectedLeave?.od_end_time && (
//                             <p style={{ margin: 0 }}>
//                                 <strong>OD Time:</strong> {selectedLeave.od_start_time} - {selectedLeave.od_end_time}
//                                 ({selectedLeave.od_hours} hrs)
//                             </p>
//                         )}
//                         {selectedLeave?.reason && (
//                             <p style={{ margin: 0 }}>
//                                 <strong>Reason:</strong> {selectedLeave.reason}
//                             </p>
//                         )}
//                     </Space>
//                 </div>
//                 <TextArea
//                     rows={4}
//                     placeholder={actionType === 'approve' ? 'Add approval comments (optional)' : 'Add rejection reason (required)'}
//                     value={comments}
//                     onChange={(e) => setComments(e.target.value)}
//                 />
//             </Modal>
//         </div>
//     );
// };

// export default PendingLeaves;

import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Input, message, Tag, Drawer, Row, Col, Divider, Typography, Dropdown, Menu, Tooltip } from 'antd';
import { CheckOutlined, CloseOutlined, SearchOutlined, EyeOutlined, ClockCircleOutlined, PauseOutlined, MoreOutlined, LockOutlined } from '@ant-design/icons';
import { getPendingLeaves, approveLeave, rejectLeave, holdLeave } from '../../services/leaveService';
import { useAuth } from '../../context/AuthContext';

const { TextArea } = Input;
const { Text, Title } = Typography;

const PendingLeaves = ({ onUpdate }) => {
    const { user } = useAuth();
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [comments, setComments] = useState('');
    const [actionType, setActionType] = useState('');
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        fetchLeaves();
    }, []);

    useEffect(() => {
        handleSearch(searchText);
    }, [leaves, searchText]);

    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const data = await getPendingLeaves();
            
            // ✅ Filter out own leaves (don't show them in pending approvals)
            const filtered = data.data.filter(leave => leave.employee_id !== user?.employee_id);
            
            setLeaves(filtered);
        } catch (error) {
            console.error('Error fetching leaves:', error);
            message.error('Failed to fetch pending leaves');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (value) => {
        const filtered = leaves.filter((leave) => {
            return (
                leave.employee_name?.toLowerCase().includes(value.toLowerCase()) ||
                leave.employee_id?.toString().toLowerCase().includes(value.toLowerCase()) ||
                leave.leave_name?.toLowerCase().includes(value.toLowerCase()) ||
                leave.reason?.toLowerCase().includes(value.toLowerCase()) ||
                leave.reporting_manager_name?.toLowerCase().includes(value.toLowerCase()) ||
                leave.from_date?.toLowerCase().includes(value.toLowerCase()) ||
                leave.to_date?.toLowerCase().includes(value.toLowerCase())
            );
        });
        setFilteredData(filtered);
    };

    const showDrawer = (record) => {
        setSelectedLeave(record);
        setDrawerVisible(true);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
        setSelectedLeave(null);
    };

    // ✅ Check if leave belongs to current user (with null safety)
    const isOwnLeave = (record) => {
        return record && user?.employee_id && record.employee_id === user?.employee_id;
    };

    const showActionModal = (leave, type) => {
        setSelectedLeave(leave);
        setActionType(type);
        setModalVisible(true);
        setComments('');
        setDrawerVisible(false);
    };

    const handleAction = async () => {
        if ((actionType === 'reject' || actionType === 'hold') && !comments.trim()) {
            message.error(actionType === 'reject' ? 'Rejection reason is required' : 'Hold reason is required');
            return;
        }

        try {
            if (actionType === 'approve') {
                await approveLeave(selectedLeave.id, comments);
                message.success('Leave approved successfully');
            } else if (actionType === 'reject') {
                await rejectLeave(selectedLeave.id, comments);
                message.success('Leave rejected successfully');
            } else if (actionType === 'hold') {
                await holdLeave(selectedLeave.id, comments);
                message.success('Leave put on hold successfully');
            }
            setModalVisible(false);
            fetchLeaves();
            if (onUpdate) onUpdate();
        } catch (error) {
            message.error(error.response?.data?.message || 'Action failed');
        }
    };

const getActionMenu = (record) => {
    return [
        {
            key: 'view',
            label: 'View Details',
            icon: <EyeOutlined />,
            onClick: () => showDrawer(record)
        },
        {
            type: 'divider'
        },
        {
            key: 'approve',
            label: 'Approve',
            icon: <CheckOutlined />,
            onClick: () => showActionModal(record, 'approve')
        },
        {
            key: 'hold',
            label: 'Put On Hold',
            icon: <PauseOutlined />,
            onClick: () => showActionModal(record, 'hold')
        },
        {
            key: 'reject',
            label: 'Reject',
            icon: <CloseOutlined />,
            danger: true,
            onClick: () => showActionModal(record, 'reject')
        }
    ];
};

    const columns = [
        {
            title: 'Applied Date',
            dataIndex: 'applied_date',
            key: 'applied_date',
            width: 120,
            sorter: (a, b) => new Date(a.applied_date) - new Date(b.applied_date),
            render: (date) => new Date(date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            })
        },
        {
            title: 'Employee',
            dataIndex: 'employee_name',
            key: 'employee_name',
            width: 150,
            sorter: (a, b) => (a.employee_name || '').localeCompare(b.employee_name || ''),
            render: (name, record) => (
                <div>
                    <div>
                        {name}
                        {isOwnLeave(record) && (
                            <Tag color="blue" style={{ marginLeft: '8px' }}>YOUR LEAVE</Tag>
                        )}
                    </div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>ID: {record.employee_id}</Text>
                </div>
            )
        },
        {
            title: 'Reporting To',
            dataIndex: 'reporting_manager_name',
            key: 'reporting_manager_name',
            width: 140,
            sorter: (a, b) => {
                const aVal = a.reporting_manager_name || 'Not Assigned';
                const bVal = b.reporting_manager_name || 'Not Assigned';
                return aVal.localeCompare(bVal);
            },
            render: (name) => name || <Text type="secondary">Not Assigned</Text>
        },
        {
            title: 'Leave Type',
            dataIndex: 'leave_name',
            key: 'leave_name',
            width: 130,
            sorter: (a, b) => (a.leave_name || '').localeCompare(b.leave_name || '')
        },
        {
            title: 'From Date',
            dataIndex: 'from_date',
            key: 'from_date',
            width: 120,
            sorter: (a, b) => new Date(a.from_date) - new Date(b.from_date),
            render: (date) => new Date(date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            })
        },
        {
            title: 'To Date',
            dataIndex: 'to_date',
            key: 'to_date',
            width: 120,
            sorter: (a, b) => new Date(a.to_date) - new Date(b.to_date),
            render: (date) => new Date(date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            })
        },
        {
            title: 'Days',
            dataIndex: 'number_of_days',
            key: 'number_of_days',
            width: 100,
            align: 'center',
            sorter: (a, b) => (a.number_of_days || 0) - (b.number_of_days || 0),
            render: (days, record) => {
                if (record.leave_code === 'OD') {
                    return <Tag color="purple">OD</Tag>;
                }
                return (
                    <Tag color={days >= 5 ? 'orange' : 'green'}>
                        {days} {days === 1 ? 'day' : 'days'}
                    </Tag>
                );
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            align: 'center',
            sorter: (a, b) => (a.status || '').localeCompare(b.status || ''),
            render: (status) => {
                let color = 'gold';
                let text = 'Pending';
                
                if (status) {
                    const statusLower = status.toLowerCase();
                    if (statusLower === 'approved') {
                        color = 'green';
                        text = 'Approved';
                    } else if (statusLower === 'rejected') {
                        color = 'red';
                        text = 'Rejected';
                    } else if (statusLower === 'hold' || statusLower === 'on hold') {
                        color = 'orange';
                        text = 'On Hold';
                    } else {
                        text = status;
                    }
                }
                
                return <Tag color={color}>{text}</Tag>;
            }
        },
{
    title: 'Action',
    key: 'action',
    fixed: 'right',
    width: 100,
    align: 'center',
    render: (_, record) => {
        const isUserOwnLeave = isOwnLeave(record);
        
        // ✅ Lock button if it's own leave
        if (isUserOwnLeave) {
            return (
                <Tooltip title="You cannot take action on your own leave">
                    <Button 
                        type="primary"
                        icon={<LockOutlined />}
                        disabled
                        style={{ cursor: 'not-allowed' }}
                    >
                        Locked
                    </Button>
                </Tooltip>
            );
        }
        
        // Show actions for others
        return (
            <Dropdown 
                menu={{ items: getActionMenu(record) }} 
                trigger={['click']} 
                placement="bottomRight"
            >
                <Button type="primary" icon={<MoreOutlined />}>
                    Actions
                </Button>
            </Dropdown>
        );
    }
}
    ];

    const displayData = searchText ? filteredData : leaves;

    // Show empty message if no leaves
    if (!loading && leaves.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <Title level={4}>No Pending Leaves</Title>
                <Text type="secondary">There are no pending leaves to approve</Text>
            </div>
        );
    }

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Search by employee name, ID, leave type, reason, or reporting manager"
                    prefix={<SearchOutlined />}
                    onChange={(e) => setSearchText(e.target.value)}
                    allowClear
                    style={{ width: '100%' }}
                />
            </div>

            <Table
                dataSource={displayData}
                columns={columns}
                loading={loading}
                rowKey="id"
                bordered
                size="middle"
                scroll={{ x: 1400 }}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50'],
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} pending leaves`
                }}
            />

            {/* View Details Drawer */}
            <Drawer
                title={
                    <Space>
                        <EyeOutlined style={{ fontSize: '20px' }} />
                        <span>Leave Request Details</span>
                    </Space>
                }
                placement="right"
                onClose={closeDrawer}
                open={drawerVisible}
                width={550}
                footer={
                    <Space style={{ float: 'right' }}>
                        <Button onClick={closeDrawer}>Close</Button>
                        {selectedLeave && !isOwnLeave(selectedLeave) && (
                            <>
                                <Button
                                    type="primary"
                                    icon={<CheckOutlined />}
                                    onClick={() => showActionModal(selectedLeave, 'approve')}
                                >
                                    Approve
                                </Button>
                                <Button
                                    style={{ backgroundColor: '#faad14', borderColor: '#faad14', color: 'white' }}
                                    icon={<PauseOutlined />}
                                    onClick={() => showActionModal(selectedLeave, 'hold')}
                                >
                                    Hold
                                </Button>
                                <Button
                                    danger
                                    icon={<CloseOutlined />}
                                    onClick={() => showActionModal(selectedLeave, 'reject')}
                                >
                                    Reject
                                </Button>
                            </>
                        )}
                    </Space>
                }
            >
                {selectedLeave && (
                    <div>
                        {/* Employee Information */}
                        <div style={{
                            backgroundColor: '#f5f5f5',
                            padding: '16px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            border: '1px solid #d9d9d9'
                        }}>
                            <Title level={5} style={{ marginTop: 0, marginBottom: '12px' }}>
                                Employee Information
                            </Title>
                            <Row gutter={[16, 12]}>
                                <Col span={12}>
                                    <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                                        Employee Name
                                    </Text>
                                    <Text strong style={{ fontSize: '14px' }}>
                                        {selectedLeave.employee_name}
                                    </Text>
                                </Col>
                                <Col span={12}>
                                    <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                                        Employee ID
                                    </Text>
                                    <Text strong style={{ fontSize: '14px' }}>
                                        {selectedLeave.employee_id}
                                    </Text>
                                </Col>
                                <Col span={24}>
                                    <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                                        Reporting Manager
                                    </Text>
                                    <Text strong style={{ fontSize: '14px' }}>
                                        {selectedLeave.reporting_manager_name || 'Not Assigned'}
                                    </Text>
                                </Col>
                            </Row>
                        </div>

                        <Divider />

                        {/* Leave Details */}
                        <Row gutter={[16, 20]}>
                            <Col span={24}>
                                <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                                    Leave Type
                                </Text>
                                <Text strong style={{ fontSize: '16px' }}>
                                    {selectedLeave.leave_name}
                                </Text>
                            </Col>

                            <Col span={12}>
                                <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                                    From Date
                                </Text>
                                <Text strong style={{ fontSize: '14px' }}>
                                    {new Date(selectedLeave.from_date).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </Text>
                            </Col>

                            <Col span={12}>
                                <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                                    To Date
                                </Text>
                                <Text strong style={{ fontSize: '14px' }}>
                                    {new Date(selectedLeave.to_date).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </Text>
                            </Col>

                            <Col span={12}>
                                <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                                    Number of Days
                                </Text>
                                <Text strong style={{ fontSize: '14px' }}>
                                    {selectedLeave.number_of_days} {selectedLeave.number_of_days === 1 ? 'day' : 'days'}
                                    {selectedLeave.is_half_day && ' (Half Day)'}
                                </Text>
                            </Col>

                            <Col span={12}>
                                <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                                    Applied Date
                                </Text>
                                <Text style={{ fontSize: '14px' }}>
                                    {new Date(selectedLeave.applied_date).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </Text>
                            </Col>
                        </Row>

                        {/* OD Time Details */}
                        {(selectedLeave.od_start_time && selectedLeave.od_end_time) && (
                            <>
                                <Divider />
                                <div style={{
                                    backgroundColor: '#f5f5f5',
                                    padding: '20px',
                                    borderRadius: '8px',
                                    border: '1px solid #d9d9d9'
                                }}>
                                    <Title level={5} style={{ marginTop: 0, marginBottom: '16px' }}>
                                        <ClockCircleOutlined style={{ marginRight: '8px', color: '#722ed1' }} />
                                        On Duty Time Details
                                    </Title>

                                    <Row gutter={[16, 16]}>
                                        <Col span={24}>
                                            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                                                Start Time
                                            </Text>
                                            <div style={{
                                                backgroundColor: '#fff',
                                                padding: '10px 12px',
                                                borderRadius: '4px',
                                                border: '1px solid #d9d9d9'
                                            }}>
                                                <Text strong style={{ fontSize: '16px', color: '#722ed1' }}>
                                                    {selectedLeave.od_start_time}
                                                </Text>
                                            </div>
                                        </Col>

                                        <Col span={24}>
                                            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                                                End Time
                                            </Text>
                                            <div style={{
                                                backgroundColor: '#fff',
                                                padding: '10px 12px',
                                                borderRadius: '4px',
                                                border: '1px solid #d9d9d9'
                                            }}>
                                                <Text strong style={{ fontSize: '16px', color: '#722ed1' }}>
                                                    {selectedLeave.od_end_time}
                                                </Text>
                                            </div>
                                        </Col>

                                        <Col span={24}>
                                            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                                                Total Duration
                                            </Text>
                                            <div style={{
                                                backgroundColor: '#fff',
                                                padding: '10px 12px',
                                                borderRadius: '4px',
                                                border: '1px solid #722ed1',
                                                textAlign: 'center'
                                            }}>
                                                <Text strong style={{ fontSize: '18px', color: '#722ed1' }}>
                                                    {selectedLeave.od_hours} hours
                                                </Text>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </>
                        )}

                        {/* Reason */}
                        {selectedLeave.reason && (
                            <>
                                <Divider />
                                <div>
                                    <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                                        Reason
                                    </Text>
                                    <div style={{
                                        backgroundColor: '#f5f5f5',
                                        padding: '12px',
                                        borderRadius: '4px',
                                        border: '1px solid #d9d9d9'
                                    }}>
                                        <Text style={{ fontSize: '14px' }}>
                                            {selectedLeave.reason}
                                        </Text>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </Drawer>

            {/* Approval/Rejection/Hold Modal */}
            <Modal
                title={
                    <Space align="center">
                        {actionType === 'approve' ? (
                            <>
                                <CheckOutlined style={{ color: '#52c41a', fontSize: 18 }} />
                                <span>Approve {selectedLeave?.leave_code === 'OD' ? 'Over Duty' : 'Leave'}</span>
                            </>
                        ) : actionType === 'hold' ? (
                            <>
                                <PauseOutlined style={{ color: '#faad14', fontSize: 18 }} />
                                <span>Put {selectedLeave?.leave_code === 'OD' ? 'Over Duty' : 'Leave'} On Hold</span>
                            </>
                        ) : (
                            <>
                                <CloseOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />
                                <span>Reject {selectedLeave?.leave_code === 'OD' ? 'Over Duty' : 'Leave'}</span>
                            </>
                        )}
                    </Space>
                }
                open={modalVisible}
                onOk={handleAction}
                onCancel={() => setModalVisible(false)}
                okText={actionType === 'approve' ? 'Approve' : actionType === 'hold' ? 'Put On Hold' : 'Reject'}
                okButtonProps={{
                    danger: actionType === 'reject',
                    type: actionType === 'approve' ? 'primary' : 'default',
                    style: actionType === 'hold' ? { backgroundColor: '#faad14', borderColor: '#faad14', color: 'white' } : {}
                }}
            >
                <div style={{ marginBottom: 16 }}>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <p style={{ margin: 0 }}>
                            <strong>Employee:</strong> {selectedLeave?.employee_name}
                        </p>
                        <p style={{ margin: 0 }}>
                            <strong>Employee ID:</strong> {selectedLeave?.employee_id}
                        </p>
                        <p style={{ margin: 0 }}>
                            <strong>Leave Type:</strong> {selectedLeave?.leave_name}
                            {selectedLeave?.is_half_day && ' (Half Day)'}
                            {selectedLeave?.leave_code === 'OD' && ' (Over Duty)'}
                        </p>
                        {selectedLeave?.leave_code !== 'OD' && (
                            <p style={{ margin: 0 }}>
                                <strong>Duration:</strong> {selectedLeave?.number_of_days} days
                            </p>
                        )}
                        <p style={{ margin: 0 }}>
                            <strong>From:</strong> {selectedLeave?.from_date && new Date(selectedLeave.from_date).toLocaleDateString('en-GB')}
                        </p>
                        <p style={{ margin: 0 }}>
                            <strong>To:</strong> {selectedLeave?.to_date && new Date(selectedLeave.to_date).toLocaleDateString('en-GB')}
                        </p>
                        {selectedLeave?.od_start_time && selectedLeave?.od_end_time && (
                            <p style={{ margin: 0 }}>
                                <strong>OD Time:</strong> {selectedLeave.od_start_time} - {selectedLeave.od_end_time}
                                ({selectedLeave.od_hours} hrs)
                            </p>
                        )}
                        {selectedLeave?.reason && (
                            <p style={{ margin: 0 }}>
                                <strong>Reason:</strong> {selectedLeave.reason}
                            </p>
                        )}
                    </Space>
                </div>
                <TextArea
                    rows={4}
                    placeholder={
                        actionType === 'approve' 
                            ? 'Add approval comments (optional)' 
                            : actionType === 'hold'
                            ? 'Add hold reason (required)'
                            : 'Add rejection reason (required)'
                    }
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                />
            </Modal>
        </div>
    );
};

export default PendingLeaves;
