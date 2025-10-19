// import React, { useState, useEffect } from 'react';
// import { Table, Tag, Space } from 'antd';
// import { getMyLeaves } from '../../services/leaveService';

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

//     const getStatusTag = (status) => {
//         const statusConfig = {
//             pending: { color: 'gold', text: 'Pending' },
//             approved_by_tl: { color: 'blue', text: 'TL Approved' },
//             approved_by_manager: { color: 'cyan', text: 'Manager Approved' },
//             approved: { color: 'green', text: 'Approved' },
//             rejected: { color: 'red', text: 'Rejected' }
//         };

//         const config = statusConfig[status] || { color: 'default', text: status };
//         return <Tag color={config.color}>{config.text}</Tag>;
//     };

// const columns = [
//     {
//         title: 'Leave Type',
//         dataIndex: 'leave_name',
//         key: 'leave_name'
//     },
//     {
//         title: 'From Date',
//         dataIndex: 'from_date',
//         key: 'from_date',
//         render: (date) => new Date(date).toLocaleDateString()
//     },
//     {
//         title: 'To Date',
//         dataIndex: 'to_date',
//         key: 'to_date',
//         render: (date) => new Date(date).toLocaleDateString()
//     },
//     {
//         title: 'Days',
//         dataIndex: 'number_of_days',
//         key: 'number_of_days'
//     },
//     {
//         title: 'Status',
//         dataIndex: 'status',
//         key: 'status',
//         render: (status) => {
//             const colors = {
//                 pending: 'gold',
//                 approved: 'green',
//                 rejected: 'red'
//             };
//             return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
//         }
//     },
//     {
//         title: 'Processed By',
//         key: 'processed_by',
//         render: (_, record) => {
//             if (record.status === 'approved' && record.approver_name) {
//                 return <span>{record.approver_name}</span>;
//             } else if (record.status === 'rejected' && record.rejector_name) {
//                 return <span>{record.rejector_name}</span>;
//             }
//             return '-';
//         }
//     },
//     {
//         title: 'Applied Date',
//         dataIndex: 'applied_date',
//         key: 'applied_date',
//         render: (date) => new Date(date).toLocaleDateString()
//     }
// ];

//     return (
//         <Table
//             dataSource={leaves}
//             columns={columns}
//             loading={loading}
//             rowKey="id"
//         />
//     );
// };

// export default MyLeaves;


import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { getMyLeaves, cancelLeave } from '../../services/leaveService';

const { confirm } = Modal;

const MyLeaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(false);

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
            render: (text, record) => (
                <>
                    {text}
                    {record.is_half_day && <Tag color="blue" style={{ marginLeft: 8 }}>Half Day</Tag>}
                    {record.leave_code === 'OD' && <Tag color="purple" style={{ marginLeft: 8 }}>Over Duty</Tag>}
                </>
            )
        },
        {
            title: 'From Date',
            dataIndex: 'from_date',
            key: 'from_date',
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
            render: (status) => getStatusTag(status)
        },
        {
            title: 'Processed By',
            key: 'processed_by',
            render: (_, record) => {
                if (record.status === 'approved' && record.approver_name) {
                    return <span>{record.approver_name}</span>;
                } else if (record.status === 'rejected' && record.rejector_name) {
                    return <span>{record.rejector_name}</span>;
                }
                return '-';
            }
        },
        {
            title: 'Applied Date',
            dataIndex: 'applied_date',
            key: 'applied_date',
            render: (date) => new Date(date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            })
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                if (record.status === 'pending' || record.status === 'approved') {
                    return (
                        <Button 
                            danger 
                            size="small" 
                            onClick={() => handleCancelLeave(record.id)}
                        >
                            Cancel
                        </Button>
                    );
                }
                return '-';
            }
        }
    ];

    return (
        <Table
            dataSource={leaves}
            columns={columns}
            loading={loading}
            rowKey="id"
            scroll={{ x: 1200 }}
            pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} leaves`
            }}
        />
    );
};

export default MyLeaves;
