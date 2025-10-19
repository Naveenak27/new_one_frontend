import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, message, Popconfirm, Input, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { getAllEmployees, deleteEmployee } from '../../services/employeeService';

const EmployeeList = ({ onShowForm }) => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        handleSearch(searchText);
    }, [employees, searchText]);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const data = await getAllEmployees();
            setEmployees(data.data);
        } catch (error) {
            message.error('Failed to fetch employees');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteEmployee(id);
            message.success('Employee deleted successfully');
            fetchEmployees();
        } catch (error) {
            message.error('Failed to delete employee');
        }
    };

    const handleSearch = (value) => {
        const filtered = employees.filter((employee) => {
            return (
                employee.employee_id?.toString().toLowerCase().includes(value.toLowerCase()) ||
                employee.name?.toLowerCase().includes(value.toLowerCase()) ||
                employee.email?.toLowerCase().includes(value.toLowerCase()) ||
                employee.mobile_number?.toString().toLowerCase().includes(value.toLowerCase()) ||
                employee.role_name?.toLowerCase().includes(value.toLowerCase()) ||
                employee.designation?.toLowerCase().includes(value.toLowerCase()) ||
                employee.department_name?.toLowerCase().includes(value.toLowerCase())
            );
        });
        setFilteredData(filtered);
    };

    const columns = [
        {
            title: 'Employee ID',
            dataIndex: 'employee_id',
            key: 'employee_id',
            width: 120,
            fixed: 'left',
            sorter: (a, b) => {
                const aVal = a.employee_id || '';
                const bVal = b.employee_id || '';
                return aVal.toString().localeCompare(bVal.toString());
            }
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 150,
            ellipsis: true,
            sorter: (a, b) => {
                const aVal = a.name || '';
                const bVal = b.name || '';
                return aVal.localeCompare(bVal);
            }
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 200,
            ellipsis: true,
            sorter: (a, b) => {
                const aVal = a.email || '';
                const bVal = b.email || '';
                return aVal.localeCompare(bVal);
            }
        },
        {
            title: 'Mobile',
            dataIndex: 'mobile_number',
            key: 'mobile_number',
            width: 130,
            sorter: (a, b) => {
                const aVal = a.mobile_number || '';
                const bVal = b.mobile_number || '';
                return aVal.toString().localeCompare(bVal.toString());
            }
        },
        {
            title: 'Role',
            dataIndex: 'role_name',
            key: 'role_name',
            width: 120,
            sorter: (a, b) => {
                const aVal = a.role_name || '';
                const bVal = b.role_name || '';
                return aVal.localeCompare(bVal);
            },
            render: (role) => (
                <Tag color="blue">{role}</Tag>
            )
        },
        {
            title: 'Designation',
            dataIndex: 'designation',
            key: 'designation',
            width: 150,
            ellipsis: true,
            sorter: (a, b) => {
                const aVal = a.designation || '';
                const bVal = b.designation || '';
                return aVal.localeCompare(bVal);
            },
            render: (designation) => (
                <Tag color="purple">{designation}</Tag>
            )
        },
        {
            title: 'Department',
            dataIndex: 'department_name',
            key: 'department_name',
            width: 150,
            ellipsis: true,
            sorter: (a, b) => {
                const aVal = a.department_name || '';
                const bVal = b.department_name || '';
                return aVal.localeCompare(bVal);
            },
            render: (department) => (
                <Tag color="cyan">{department}</Tag>
            )
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            width: 100,
            sorter: (a, b) => (a.is_active === b.is_active ? 0 : a.is_active ? -1 : 1),
            render: (active) => (
                <Tag color={active ? 'green' : 'red'}>
                    {active ? 'Active' : 'Inactive'}
                </Tag>
            )
        },
        {
            title: 'Action',
            key: 'action',
            width: 180,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => onShowForm(record)}
                        size="small"
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this employee?"
                        onConfirm={() => handleDelete(record.emp_id)}
                    >
                        <Button danger icon={<DeleteOutlined />} size="small">
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 16,
                flexWrap: 'wrap',
                gap: '16px'
            }}>
                <h1 style={{ margin: 0 }}>Employee Management</h1>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => onShowForm(null)}
                >
                    Add Employee
                </Button>
            </div>

            <Card>
                <div style={{ marginBottom: 16 }}>
                    <Input
                        placeholder="Search employees by name, email, mobile, role, designation, or department"
                        prefix={<SearchOutlined />}
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                        style={{ maxWidth: '100%' }}
                    />
                </div>

                <Table
                    dataSource={searchText ? filteredData : employees}
                    columns={columns}
                    loading={loading}
                    rowKey="emp_id"
                    scroll={{ x: 1300, y: 'calc(100vh - 400px)' }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} employees`
                    }}
                />
            </Card>
        </div>
    );
};

export default EmployeeList;
