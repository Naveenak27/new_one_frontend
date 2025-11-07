// components/Leave/TeamLeaves.jsx
import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Space, DatePicker, Input, message, Drawer, Row, Col, Divider, Typography, Dropdown, Modal, Menu, Tooltip, Spin } from 'antd';
import { ReloadOutlined, SearchOutlined, EyeOutlined, ClockCircleOutlined, CheckOutlined, CloseOutlined, PauseOutlined, MoreOutlined, LockOutlined } from '@ant-design/icons';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const { TextArea } = Input;
const { Text, Title } = Typography;

const statusColors = {
  pending: 'blue',
  approved: 'green',
  rejected: 'red',
  cancelled: 'default',
  on_hold: 'orange'
};

const TeamLeaves = () => {
  const { user } = useAuth();
  const [allLeaves, setAllLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [dateRange, setDateRange] = useState([null, null]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [comments, setComments] = useState('');

  useEffect(() => {
    fetchLeaves();
  }, [refreshKey, dateRange]);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [allLeaves, searchTerm]);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      let params = {};
      if (dateRange[0] && dateRange[1]) {
        params.from_date = dateRange[0].format('YYYY-MM-DD');
        params.to_date = dateRange[1].format('YYYY-MM-DD');
      }
      
      // ✅ Fetch ALL leaves using existing endpoint
      const response = await api.get('/leaves/all-leaves', { params });
      let leaves = response.data.data || [];
      
      // ✅ Filter on frontend: Only show team members' leaves
      // Keep leaves where employee_id is NOT the manager/TL's own ID
      leaves = leaves.filter(leave => leave.employee_id !== user?.employee_id);
      
      setAllLeaves(leaves);
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to fetch leaves');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    const filtered = allLeaves.filter((leave) => {
      return (
        leave.employee_name?.toLowerCase().includes(value.toLowerCase()) ||
        leave.employee_id?.toString().toLowerCase().includes(value.toLowerCase()) ||
        leave.leave_name?.toLowerCase().includes(value.toLowerCase()) ||
        leave.reason?.toLowerCase().includes(value.toLowerCase()) ||
        leave.status?.toLowerCase().includes(value.toLowerCase())
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

  const getStatusTag = (status) => {
    const statusText = status === 'on_hold' ? 'ON HOLD' : status?.toUpperCase();
    return <Tag color={statusColors[status] || 'default'}>{statusText}</Tag>;
  };

  // ✅ Check if leave belongs to current user
  const isOwnLeave = (record) => {
    return record.employee_id === user?.employee_id;
  };

  const handleStatusChange = (status, record) => {
    setSelectedRecord(record);
    setNewStatus(status);
    setComments('');
    setStatusModalVisible(true);
  };

  const handleStatusUpdate = async () => {
    if ((newStatus === 'rejected' || newStatus === 'on_hold') && !comments.trim()) {
      message.error(`${newStatus === 'rejected' ? 'Rejection' : 'Hold'} reason is required`);
      return;
    }

    try {
      let endpoint = '';
      let payload = {};

      switch (newStatus) {
        case 'approved':
          endpoint = `/leaves/${selectedRecord.id}/approve`;
          payload = { comments };
          break;
        case 'rejected':
          endpoint = `/leaves/${selectedRecord.id}/reject`;
          payload = { comments };
          break;
        case 'on_hold':
          endpoint = `/leaves/${selectedRecord.id}/hold`;
          payload = { comments };
          break;
        default:
          message.error('Invalid status');
          return;
      }

      await api.put(endpoint, payload);
      message.success(`Leave status updated to ${newStatus.replace('_', ' ')} successfully`);
      setStatusModalVisible(false);
      setRefreshKey(k => k + 1);
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const getActionMenuItems = (record) => {
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
        onClick: () => handleStatusChange('approved', record)
      },
      {
        key: 'hold',
        label: 'Put On Hold',
        icon: <PauseOutlined />,
        onClick: () => handleStatusChange('on_hold', record)
      },
      {
        key: 'reject',
        label: 'Reject',
        icon: <CloseOutlined />,
        danger: true,
        onClick: () => handleStatusChange('rejected', record)
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
      render: (date) => date ? new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) : '-'
    },
    {
      title: 'Employee',
      dataIndex: 'employee_name',
      key: 'employee_name',
      width: 150,
      sorter: (a, b) => (a.employee_name || '').localeCompare(b.employee_name || ''),
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>ID: {record.employee_id}</Text>
        </div>
      )
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
      render: (date) => date ? new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) : '-'
    },
    {
      title: 'To Date',
      dataIndex: 'to_date',
      key: 'to_date',
      width: 120,
      sorter: (a, b) => new Date(a.to_date) - new Date(b.to_date),
      render: (date) => date ? new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) : '-'
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
      width: 130,
      align: 'center',
      sorter: (a, b) => (a.status || '').localeCompare(b.status || ''),
      render: (status) => getStatusTag(status),
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Approved', value: 'approved' },
        { text: 'Rejected', value: 'rejected' },
        { text: 'On Hold', value: 'on_hold' },
        { text: 'Cancelled', value: 'cancelled' }
      ],
      onFilter: (value, record) => record.status === value
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      align: 'center',
      fixed: 'right',
      render: (_, record) => {
        // Only show Actions dropdown for pending and on_hold status
        const showActions = record.status === 'pending' || record.status === 'on_hold';
        
        if (showActions) {
          return (
            <Dropdown
              menu={{ items: getActionMenuItems(record) }}
              trigger={['click']}
              placement="bottomRight"
            >
              <Button type="primary" icon={<MoreOutlined />}>
                Actions
              </Button>
            </Dropdown>
          );
        } else {
          return (
            <Button 
              type="primary"
              ghost
              size="small" 
              icon={<EyeOutlined />}
              onClick={() => showDrawer(record)}
            >
              View
            </Button>
          );
        }
      }
    }
  ];

  const displayData = searchTerm ? filteredData : allLeaves;

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Spin size="large" tip="Loading team leaves..." />
      </div>
    );
  }

  if (allLeaves.length === 0) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Title level={4}>No Team Leaves Found</Title>
          <Text type="secondary">Your team members have not applied any leaves yet</Text>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card
        title={
          <Space>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={() => setRefreshKey(k => k + 1)}
              type="text"
              size="small"
            />
            <span>Team Leaves</span>
          </Space>
        }
        extra={
          <Space>
            <DatePicker.RangePicker
              value={dateRange}
              onChange={dates => setDateRange(dates)}
              style={{ width: 260 }}
              format="DD MMM YYYY"
              placeholder={['Start Date', 'End Date']}
            />
            <Input
              placeholder="Search by employee, leave type, status..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              allowClear
              style={{ width: 350 }}
            />
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Table
          loading={loading}
          dataSource={displayData}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 15,
            showSizeChanger: true,
            pageSizeOptions: ['10', '15', '20', '50', '100'],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} team leaves`
          }}
          bordered
          size="middle"
          scroll={{ x: 1300 }}
        />
      </Card>

      {/* Status Change Modal */}
      <Modal
        title={
          <Space align="center">
            {newStatus === 'approved' ? (
              <>
                <CheckOutlined style={{ color: '#52c41a', fontSize: 18 }} />
                <span>Approve Leave</span>
              </>
            ) : newStatus === 'on_hold' ? (
              <>
                <PauseOutlined style={{ color: '#faad14', fontSize: 18 }} />
                <span>Put Leave On Hold</span>
              </>
            ) : (
              <>
                <CloseOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />
                <span>Reject Leave</span>
              </>
            )}
          </Space>
        }
        open={statusModalVisible}
        onOk={handleStatusUpdate}
        onCancel={() => setStatusModalVisible(false)}
        okText={
          newStatus === 'approved' ? 'Approve' : 
          newStatus === 'on_hold' ? 'Put On Hold' : 'Reject'
        }
        okButtonProps={{
          danger: newStatus === 'rejected',
          type: newStatus === 'approved' ? 'primary' : 'default',
          style: newStatus === 'on_hold' ? { backgroundColor: '#faad14', borderColor: '#faad14', color: 'white' } : {}
        }}
      >
        {selectedRecord && (
          <div style={{ marginBottom: 16 }}>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <p style={{ margin: 0 }}>
                <strong>Employee:</strong> {selectedRecord.employee_name}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Employee ID:</strong> {selectedRecord.employee_id}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Leave Type:</strong> {selectedRecord.leave_name}
                {selectedRecord.is_half_day && ' (Half Day)'}
                {selectedRecord.leave_code === 'OD' && ' (Over Duty)'}
              </p>
              {selectedRecord.leave_code !== 'OD' && (
                <p style={{ margin: 0 }}>
                  <strong>Duration:</strong> {selectedRecord.number_of_days} days
                </p>
              )}
              <p style={{ margin: 0 }}>
                <strong>From:</strong> {selectedRecord.from_date && new Date(selectedRecord.from_date).toLocaleDateString('en-GB')}
              </p>
              <p style={{ margin: 0 }}>
                <strong>To:</strong> {selectedRecord.to_date && new Date(selectedRecord.to_date).toLocaleDateString('en-GB')}
              </p>
              {selectedRecord.od_start_time && selectedRecord.od_end_time && (
                <p style={{ margin: 0 }}>
                  <strong>OD Time:</strong> {selectedRecord.od_start_time} - {selectedRecord.od_end_time}
                  ({selectedRecord.od_hours} hrs)
                </p>
              )}
              {selectedRecord.reason && (
                <p style={{ margin: 0 }}>
                  <strong>Reason:</strong> {selectedRecord.reason}
                </p>
              )}
              <p style={{ margin: 0 }}>
                <strong>Current Status:</strong> {getStatusTag(selectedRecord.status)}
              </p>
            </Space>
          </div>
        )}
        <TextArea
          rows={4}
          placeholder={
            newStatus === 'approved' 
              ? 'Add approval comments (optional)' 
              : newStatus === 'on_hold'
              ? 'Add hold reason (required)'
              : 'Add rejection reason (required)'
          }
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
      </Modal>

      {/* View Details Drawer */}
      <Drawer
        title={
          <Space>
            <EyeOutlined style={{ fontSize: '20px' }} />
            <span>Leave Application Details</span>
          </Space>
        }
        placement="right"
        onClose={closeDrawer}
        open={drawerVisible}
        width={550}
      >
        {selectedLeave && (
          <div>
            {/* Status Badge */}
            <div style={{ marginBottom: 16 }}>
              {getStatusTag(selectedLeave.status)}
            </div>

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
                  {selectedLeave.from_date ? new Date(selectedLeave.from_date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  }) : '-'}
                </Text>
              </Col>

              <Col span={12}>
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                  To Date
                </Text>
                <Text strong style={{ fontSize: '14px' }}>
                  {selectedLeave.to_date ? new Date(selectedLeave.to_date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  }) : '-'}
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
                  {selectedLeave.applied_date ? new Date(selectedLeave.applied_date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  }) : '-'}
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
    </>
  );
};

export default TeamLeaves;
