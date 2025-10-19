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


import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Input, message, Tag } from 'antd';
import { CheckOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons';
import { getPendingLeaves, approveLeave, rejectLeave } from '../../services/leaveService';

const { TextArea } = Input;

const PendingLeaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
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
            setLeaves(data.data);
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

    const showActionModal = (leave, type) => {
        setSelectedLeave(leave);
        setActionType(type);
        setModalVisible(true);
        setComments('');
    };

    const handleAction = async () => {
        if (actionType === 'reject' && !comments.trim()) {
            message.error('Rejection reason is required');
            return;
        }

        try {
            if (actionType === 'approve') {
                await approveLeave(selectedLeave.id, comments);
                message.success('Leave approved successfully');
            } else {
                await rejectLeave(selectedLeave.id, comments);
                message.success('Leave rejected successfully');
            }
            setModalVisible(false);
            fetchLeaves();
        } catch (error) {
            message.error(error.response?.data?.message || 'Action failed');
        }
    };

    const columns = [
        {
            title: 'Employee',
            dataIndex: 'employee_name',
            key: 'employee_name',
            sorter: (a, b) => (a.employee_name || '').localeCompare(b.employee_name || ''),
            render: (name) => <Tag color="cyan">{name}</Tag>
        },
        {
            title: 'Employee ID',
            dataIndex: 'employee_id',
            key: 'employee_id',
            sorter: (a, b) => {
                const aVal = a.employee_id || '';
                const bVal = b.employee_id || '';
                return aVal.toString().localeCompare(bVal.toString());
            },
            render: (id) => <Tag color="blue">{id}</Tag>
        },
        {
            title: 'Reporting To',
            dataIndex: 'reporting_manager_name',
            key: 'reporting_manager_name',
            sorter: (a, b) => {
                const aVal = a.reporting_manager_name || 'Not Assigned';
                const bVal = b.reporting_manager_name || 'Not Assigned';
                return aVal.localeCompare(bVal);
            },
            render: (name) => (
                <Tag color={name ? "purple" : "default"}>
                    {name || 'Not Assigned'}
                </Tag>
            )
        },
        {
            title: 'Leave Type',
            dataIndex: 'leave_name',
            key: 'leave_name',
            sorter: (a, b) => (a.leave_name || '').localeCompare(b.leave_name || ''),
            render: (type, record) => (
                <>
                    <Tag color="geekblue">{type}</Tag>
                    {record.is_half_day && <Tag color="blue">Half Day</Tag>}
                    {record.leave_code === 'OD' && <Tag color="purple">Over Duty</Tag>}
                </>
            )
        },
        {
            title: 'From Date',
            dataIndex: 'from_date',
            key: 'from_date',
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
            sorter: (a, b) => new Date(a.to_date) - new Date(b.to_date),
            render: (date) => new Date(date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            })
        },
        {
            title: 'OD Time',
            key: 'od_time',
            render: (_, record) => {
                if (record.od_start_time && record.od_end_time) {
                    return (
                        <span>
                            {record.od_start_time} - {record.od_end_time}
                            <br />
                            <Tag color="purple">{record.od_hours} hrs</Tag>
                        </span>
                    );
                }
                return '-';
            }
        },
        {
            title: 'Days',
            dataIndex: 'number_of_days',
            key: 'number_of_days',
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
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
            ellipsis: true,
            sorter: (a, b) => (a.reason || '').localeCompare(b.reason || '')
        },
        {
            title: 'Applied Date',
            dataIndex: 'applied_date',
            key: 'applied_date',
            sorter: (a, b) => new Date(a.applied_date) - new Date(b.applied_date),
            render: (date) => new Date(date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            })
        },
        {
            title: 'Action',
            key: 'action',
            fixed: 'right',
            width: 200,
            align: 'center',
            render: (_, record) => (
                <Space size="small" align="center">
                    <Button
                        type="primary"
                        size="small"
                        icon={<CheckOutlined />}
                        onClick={() => showActionModal(record, 'approve')}
                        style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        Approve
                    </Button>
                    <Button
                        danger
                        size="small"
                        icon={<CloseOutlined />}
                        onClick={() => showActionModal(record, 'reject')}
                        style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        Reject
                    </Button>
                </Space>
            )
        }
    ];

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
                dataSource={searchText ? filteredData : leaves}
                columns={columns}
                loading={loading}
                rowKey="id"
                scroll={{ x: 1600 }}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} pending leaves`
                }}
            />

            <Modal
                title={
                    <Space align="center">
                        {actionType === 'approve' ? (
                            <>
                                <CheckOutlined style={{ color: '#52c41a', fontSize: 18 }} />
                                <span>Approve {selectedLeave?.leave_code === 'OD' ? 'Over Duty' : 'Leave'}</span>
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
                okText={actionType === 'approve' ? 'Approve' : 'Reject'}
                okButtonProps={{ 
                    danger: actionType === 'reject',
                    type: actionType === 'approve' ? 'primary' : 'default'
                }}
            >
                <div style={{ marginBottom: 16 }}>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <p style={{ margin: 0 }}>
                            <strong>Employee:</strong> <Tag color="cyan">{selectedLeave?.employee_name}</Tag>
                        </p>
                        <p style={{ margin: 0 }}>
                            <strong>Employee ID:</strong> <Tag color="blue">{selectedLeave?.employee_id}</Tag>
                        </p>
                        <p style={{ margin: 0 }}>
                            <strong>Leave Type:</strong> <Tag color="geekblue">{selectedLeave?.leave_name}</Tag>
                            {selectedLeave?.is_half_day && <Tag color="blue">Half Day</Tag>}
                            {selectedLeave?.leave_code === 'OD' && <Tag color="purple">Over Duty</Tag>}
                        </p>
                        {selectedLeave?.leave_code !== 'OD' && (
                            <p style={{ margin: 0 }}>
                                <strong>Duration:</strong> <Tag color="green">{selectedLeave?.number_of_days} days</Tag>
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
                                <Tag color="purple" style={{ marginLeft: 8 }}>{selectedLeave.od_hours} hrs</Tag>
                            </p>
                        )}
                        <p style={{ margin: 0 }}>
                            <strong>Reason:</strong> {selectedLeave?.reason}
                        </p>
                    </Space>
                </div>
                <TextArea
                    rows={4}
                    placeholder={actionType === 'approve' ? 'Add approval comments (optional)' : 'Add rejection reason (required)'}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                />
            </Modal>
        </div>
    );
};

export default PendingLeaves;
