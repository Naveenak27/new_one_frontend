import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Space, DatePicker, Input, message, Badge } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import api from '../services/api';

const statusColors = {
  pending: 'orange',
  approved: 'green',
  rejected: 'red',
  cancelled: 'default'
};

const AllLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [dateRange, setDateRange] = useState([null, null]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetchLeaves();
  }, [refreshKey, dateRange]);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [leaves, searchTerm]);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      let params = {};
      if (dateRange[0] && dateRange[1]) {
        params.from_date = dateRange[0].format('YYYY-MM-DD');
        params.to_date = dateRange[1].format('YYYY-MM-DD');
      }
      const response = await api.get('/leaves/all-leaves', { params });
      setLeaves(response.data.data || []);
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to fetch leaves');
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
        leave.status?.toLowerCase().includes(value.toLowerCase()) ||
        leave.approver_name?.toLowerCase().includes(value.toLowerCase()) ||
        leave.rejector_name?.toLowerCase().includes(value.toLowerCase())
      );
    });
    setFilteredData(filtered);
  };

  const getStatusCounts = () => {
    const dataToCount = searchTerm ? filteredData : leaves;
    return {
      pending: dataToCount.filter(l => l.status === 'pending').length,
      approved: dataToCount.filter(l => l.status === 'approved').length,
      rejected: dataToCount.filter(l => l.status === 'rejected').length,
      cancelled: dataToCount.filter(l => l.status === 'cancelled').length,
      total: dataToCount.length
    };
  };

  const columns = [
    {
      title: 'Applied Date',
      dataIndex: 'applied_date',
      key: 'applied_date',
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
      sorter: (a, b) => (a.employee_name || '').localeCompare(b.employee_name || ''),
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Tag color="cyan">{text}</Tag>
          <span style={{ color: '#888', fontSize: '12px' }}>ID: {record.employee_id}</span>
        </Space>
      )
    },
    {
      title: 'Leave Type',
      dataIndex: 'leave_name',
      key: 'leave_name',
      sorter: (a, b) => (a.leave_name || '').localeCompare(b.leave_name || ''),
      render: (type) => <Tag color="geekblue">{type}</Tag>
    },
    {
      title: 'From',
      dataIndex: 'from_date',
      key: 'from_date',
      sorter: (a, b) => new Date(a.from_date) - new Date(b.from_date),
      render: (date) => date ? new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) : '-'
    },
    {
      title: 'To',
      dataIndex: 'to_date',
      key: 'to_date',
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
      align: 'center',
      sorter: (a, b) => (a.number_of_days || 0) - (b.number_of_days || 0),
      render: (days) => (
        <Tag color={days >= 5 ? 'orange' : 'green'}>
          {days} {days === 1 ? 'day' : 'days'}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      sorter: (a, b) => (a.status || '').localeCompare(b.status || ''),
      render: (status) => <Tag color={statusColors[status] || 'default'}>{status?.toUpperCase()}</Tag>,
      filters: Object.keys(statusColors).map(s => ({ 
        text: s.charAt(0).toUpperCase() + s.slice(1), 
        value: s 
      })),
      onFilter: (value, record) => record.status === value
    },
    {
      title: 'Approver',
      dataIndex: 'approver_name',
      key: 'approver_name',
      sorter: (a, b) => {
        const aVal = a.approver_name || '';
        const bVal = b.approver_name || '';
        return aVal.localeCompare(bVal);
      },
      render: (name) => (
        <Tag color={name ? 'purple' : 'default'}>
          {name || 'N/A'}
        </Tag>
      )
    },
    {
      title: 'Rejector',
      dataIndex: 'rejector_name',
      key: 'rejector_name',
      sorter: (a, b) => {
        const aVal = a.rejector_name || '';
        const bVal = b.rejector_name || '';
        return aVal.localeCompare(bVal);
      },
      render: (name) => (
        <Tag color={name ? 'volcano' : 'default'}>
          {name || 'N/A'}
        </Tag>
      )
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true,
      sorter: (a, b) => (a.reason || '').localeCompare(b.reason || '')
    }
  ];

  const displayData = searchTerm ? filteredData : leaves;
  const statusCounts = getStatusCounts();

  return (
    <Card
      title={
        <Space>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={() => setRefreshKey(k => k + 1)}
            type="text"
            size="small"
          />
          <span>All Leaves</span>
          {/* <Badge count={statusCounts.total} showZero style={{ backgroundColor: '#1890ff' }} /> */}
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
            placeholder="Search by employee, leave type, status, or reason"
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
      {/* Status Summary */}
      {/* <Space style={{ marginBottom: 16 }} size="large">
        <Space>
          <span style={{ fontWeight: 500 }}>Pending:</span>
          <Badge count={statusCounts.pending} style={{ backgroundColor: statusColors.pending }} />
        </Space>
        <Space>
          <span style={{ fontWeight: 500 }}>Approved:</span>
          <Badge count={statusCounts.approved} style={{ backgroundColor: statusColors.approved }} />
        </Space>
        <Space>
          <span style={{ fontWeight: 500 }}>Rejected:</span>
          <Badge count={statusCounts.rejected} style={{ backgroundColor: statusColors.rejected }} />
        </Space>
        <Space>
          <span style={{ fontWeight: 500 }}>Cancelled:</span>
          <Badge count={statusCounts.cancelled} style={{ backgroundColor: statusColors.cancelled }} />
        </Space>
      </Space> */}

      <Table
        loading={loading}
        dataSource={displayData}
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: 15,
          showSizeChanger: true,
          pageSizeOptions: ['10', '15', '20', '50', '100'],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} leaves`
        }}
        bordered
        size="middle"
        scroll={{ x: 1200 }}
      />
    </Card>
  );
};

export default AllLeaves;
