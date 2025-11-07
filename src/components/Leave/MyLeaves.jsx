// // import React, { useState, useEffect } from 'react';
// // import { Table, Tag, Space } from 'antd';
// // import { getMyLeaves } from '../../services/leaveService';

// // const MyLeaves = () => {
// //     const [leaves, setLeaves] = useState([]);
// //     const [loading, setLoading] = useState(false);

// //     useEffect(() => {
// //         fetchLeaves();
// //     }, []);

// //     const fetchLeaves = async () => {
// //         setLoading(true);
// //         try {
// //             const data = await getMyLeaves();
// //             setLeaves(data.data);
// //         } catch (error) {
// //             console.error('Error fetching leaves:', error);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     const getStatusTag = (status) => {
// //         const statusConfig = {
// //             pending: { color: 'gold', text: 'Pending' },
// //             approved_by_tl: { color: 'blue', text: 'TL Approved' },
// //             approved_by_manager: { color: 'cyan', text: 'Manager Approved' },
// //             approved: { color: 'green', text: 'Approved' },
// //             rejected: { color: 'red', text: 'Rejected' }
// //         };

// //         const config = statusConfig[status] || { color: 'default', text: status };
// //         return <Tag color={config.color}>{config.text}</Tag>;
// //     };

// // const columns = [
// //     {
// //         title: 'Leave Type',
// //         dataIndex: 'leave_name',
// //         key: 'leave_name'
// //     },
// //     {
// //         title: 'From Date',
// //         dataIndex: 'from_date',
// //         key: 'from_date',
// //         render: (date) => new Date(date).toLocaleDateString()
// //     },
// //     {
// //         title: 'To Date',
// //         dataIndex: 'to_date',
// //         key: 'to_date',
// //         render: (date) => new Date(date).toLocaleDateString()
// //     },
// //     {
// //         title: 'Days',
// //         dataIndex: 'number_of_days',
// //         key: 'number_of_days'
// //     },
// //     {
// //         title: 'Status',
// //         dataIndex: 'status',
// //         key: 'status',
// //         render: (status) => {
// //             const colors = {
// //                 pending: 'gold',
// //                 approved: 'green',
// //                 rejected: 'red'
// //             };
// //             return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
// //         }
// //     },
// //     {
// //         title: 'Processed By',
// //         key: 'processed_by',
// //         render: (_, record) => {
// //             if (record.status === 'approved' && record.approver_name) {
// //                 return <span>{record.approver_name}</span>;
// //             } else if (record.status === 'rejected' && record.rejector_name) {
// //                 return <span>{record.rejector_name}</span>;
// //             }
// //             return '-';
// //         }
// //     },
// //     {
// //         title: 'Applied Date',
// //         dataIndex: 'applied_date',
// //         key: 'applied_date',
// //         render: (date) => new Date(date).toLocaleDateString()
// //     }
// // ];

// //     return (
// //         <Table
// //             dataSource={leaves}
// //             columns={columns}
// //             loading={loading}
// //             rowKey="id"
// //         />
// //     );
// // };

// // export default MyLeaves;


// import React, { useState, useEffect } from 'react';
// import { Table, Tag, Button, Modal, message } from 'antd';
// import { ExclamationCircleOutlined } from '@ant-design/icons';
// import { getMyLeaves, cancelLeave } from '../../services/leaveService';

// const { confirm } = Modal;

// const MyLeaves = () => {
//     const [leaves, setLeaves] = useState([]);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         fetchLeaves();
//     }, []);

//     const fetchLeaves = async () => {
//         setLoading(true);
//         try {
//             const data = await getMyLeaves();
//             setLeaves(data.data);
//         } catch (error) {
//             console.error('Error fetching leaves:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleCancelLeave = (leaveId) => {
//         confirm({
//             title: 'Cancel Leave Application',
//             icon: <ExclamationCircleOutlined />,
//             content: 'Are you sure you want to cancel this leave application?',
//             okText: 'Yes, Cancel',
//             okType: 'danger',
//             cancelText: 'No',
//             onOk: async () => {
//                 try {
//                     await cancelLeave(leaveId);
//                     message.success('Leave cancelled successfully');
//                     fetchLeaves();
//                 } catch (error) {
//                     message.error(error.response?.data?.message || 'Failed to cancel leave');
//                 }
//             }
//         });
//     };

//     const getStatusTag = (status) => {
//         const statusConfig = {
//             pending: { color: 'gold', text: 'Pending' },
//             approved: { color: 'green', text: 'Approved' },
//             rejected: { color: 'red', text: 'Rejected' },
//             cancelled: { color: 'default', text: 'Cancelled' }
//         };

//         const config = statusConfig[status] || { color: 'default', text: status };
//         return <Tag color={config.color}>{config.text}</Tag>;
//     };

//     const columns = [
//         {
//             title: 'Leave Type',
//             dataIndex: 'leave_name',
//             key: 'leave_name',
//             render: (text, record) => (
//                 <>
//                     {text}
//                     {record.is_half_day && <Tag color="blue" style={{ marginLeft: 8 }}>Half Day</Tag>}
//                     {record.leave_code === 'OD' && <Tag color="purple" style={{ marginLeft: 8 }}>Over Duty</Tag>}
//                 </>
//             )
//         },
//         {
//             title: 'From Date',
//             dataIndex: 'from_date',
//             key: 'from_date',
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
//             render: (date) => new Date(date).toLocaleDateString('en-GB', {
//                 day: '2-digit',
//                 month: 'short',
//                 year: 'numeric'
//             })
//         },
//         {
//             title: 'OD Time',
//             key: 'od_time',
//             render: (_, record) => {
//                 if (record.od_start_time && record.od_end_time) {
//                     return (
//                         <span>
//                             {record.od_start_time} - {record.od_end_time}
//                             <br />
//                             <Tag color="purple">{record.od_hours} hrs</Tag>
//                         </span>
//                     );
//                 }
//                 return '-';
//             }
//         },
//         {
//             title: 'Days',
//             dataIndex: 'number_of_days',
//             key: 'number_of_days',
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
//             title: 'Status',
//             dataIndex: 'status',
//             key: 'status',
//             render: (status) => getStatusTag(status)
//         },
//         {
//             title: 'Processed By',
//             key: 'processed_by',
//             render: (_, record) => {
//                 if (record.status === 'approved' && record.approver_name) {
//                     return <span>{record.approver_name}</span>;
//                 } else if (record.status === 'rejected' && record.rejector_name) {
//                     return <span>{record.rejector_name}</span>;
//                 }
//                 return '-';
//             }
//         },
//         {
//             title: 'Applied Date',
//             dataIndex: 'applied_date',
//             key: 'applied_date',
//             render: (date) => new Date(date).toLocaleDateString('en-GB', {
//                 day: '2-digit',
//                 month: 'short',
//                 year: 'numeric'
//             })
//         },
//         {
//             title: 'Action',
//             key: 'action',
//             render: (_, record) => {
//                 if (record.status === 'pending' || record.status === 'approved') {
//                     return (
//                         <Button 
//                             danger 
//                             size="small" 
//                             onClick={() => handleCancelLeave(record.id)}
//                         >
//                             Cancel
//                         </Button>
//                     );
//                 }
//                 return '-';
//             }
//         }
//     ];

//     return (
//         <Table
//             dataSource={leaves}
//             columns={columns}
//             loading={loading}
//             rowKey="id"
//             scroll={{ x: 1200 }}
//             pagination={{
//                 pageSize: 10,
//                 showSizeChanger: true,
//                 showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} leaves`
//             }}
//         />
//     );
// };

// export default MyLeaves;



import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, message, Drawer, Row, Col, Divider, Space, Typography, Tag } from 'antd';
import { ExclamationCircleOutlined, ClockCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { getMyLeaves, cancelLeave } from '../../services/leaveService';

const { confirm } = Modal;
const { Text, Title } = Typography;

const MyLeaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const data = await getMyLeaves();
            setLeaves(data.data);
        } catch (error) {
            console.error('Error fetching leaves:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelLeave = (leaveId) => {
        confirm({
            title: 'Cancel Leave Application',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure you want to cancel this leave application?',
            okText: 'Yes, Cancel',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await cancelLeave(leaveId);
                    message.success('Leave cancelled successfully');
                    fetchLeaves();
                } catch (error) {
                    message.error(error.response?.data?.message || 'Failed to cancel leave');
                }
            }
        });
    };

    const showDrawer = (record) => {
        setSelectedLeave(record);
        setDrawerVisible(true);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
        setSelectedLeave(null);
    };

    const getStatusTag = (status) => {
        const statusConfig = {
            pending: { color: 'gold', text: 'Pending' },
            approved: { color: 'green', text: 'Approved' },
            rejected: { color: 'red', text: 'Rejected' },
            cancelled: { color: 'default', text: 'Cancelled' }
        };

        const config = statusConfig[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    const columns = [
        {
            title: 'Leave Type',
            dataIndex: 'leave_name',
            key: 'leave_name',
            width: 150
        },
        {
            title: 'From Date',
            dataIndex: 'from_date',
            key: 'from_date',
            width: 120,
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
            width: 110,
            align: 'center',
            render: (status) => getStatusTag(status)
        },
        {
            title: 'Processed By',
            key: 'processed_by',
            width: 130,
            render: (_, record) => {
                if (record.status === 'approved' && record.approver_name) {
                    return <span>{record.approver_name}</span>;
                } else if (record.status === 'rejected' && record.rejector_name) {
                    return <span>{record.rejector_name}</span>;
                }
                return <Text type="secondary">-</Text>;
            }
        },
        {
            title: 'Applied Date',
            dataIndex: 'applied_date',
            key: 'applied_date',
            width: 120,
            render: (date) => new Date(date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            })
        },
        {
            title: 'Action',
            key: 'action',
            width: 150,
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Button 
                        type="primary"
                        ghost
                        size="small" 
                        icon={<EyeOutlined />}
                        onClick={() => showDrawer(record)}
                    >
                        View
                    </Button>
                    {(record.status === 'pending' || record.status === 'approved') && (
                        <Button 
                            danger 
                            size="small" 
                            onClick={() => handleCancelLeave(record.id)}
                        >
                            Cancel
                        </Button>
                    )}
                </Space>
            )
        }
    ];

    return (
        <div>
            <Table
                dataSource={leaves}
                columns={columns}
                loading={loading}
                rowKey="id"
                bordered
                size="middle"
                scroll={{ x: 1100 }}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50'],
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} leaves`
                }}
            />

            <Drawer
                title={
                    <Space>
                        <EyeOutlined style={{ fontSize: '20px' }} />
                        <span>Leave Details</span>
                    </Space>
                }
                placement="right"
                onClose={closeDrawer}
                open={drawerVisible}
                width={500}
            >
                {selectedLeave && (
                    <div>
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
                                    Status
                                </Text>
                                {getStatusTag(selectedLeave.status)}
                            </Col>
                        </Row>

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

                        <Divider />

                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                                    Processed By
                                </Text>
                                <Text style={{ fontSize: '14px' }}>
                                    {selectedLeave.status === 'approved' && selectedLeave.approver_name 
                                        ? selectedLeave.approver_name 
                                        : selectedLeave.status === 'rejected' && selectedLeave.rejector_name
                                        ? selectedLeave.rejector_name
                                        : '-'}
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
                    </div>
                )}
            </Drawer>
        </div>
    );
};

export default MyLeaves;
