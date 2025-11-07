// import React, { useState, useEffect } from 'react';
// import { Card, Table, Button, Space, Modal, Form, Input, DatePicker, message, Popconfirm, Switch, Tag, Badge } from 'antd';
// import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, CalendarOutlined } from '@ant-design/icons';
// import { getHolidays, createHoliday, updateHoliday, deleteHoliday } from '../services/calendarService';
// import moment from 'moment';
// import { hasPermission } from '../services/authService';
// import { useAuth } from '../context/AuthContext';

// const HolidaysPage = () => {
//     const [holidays, setHolidays] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [modalVisible, setModalVisible] = useState(false);
//     const [editingHoliday, setEditingHoliday] = useState(null);
//     const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//     const [searchText, setSearchText] = useState('');
//     const [filteredData, setFilteredData] = useState([]);
//     const [form] = Form.useForm();
//     const { user } = useAuth();

//     const canCreate = user?.role_name === 'superadmin' || user?.role_name === 'hr' || hasPermission('holidays', 'create');
//     const canEdit = user?.role_name === 'superadmin' || user?.role_name === 'hr' || hasPermission('holidays', 'edit');
//     const canDelete = user?.role_name === 'superadmin' || user?.role_name === 'hr' || hasPermission('holidays', 'delete');

//     useEffect(() => {
//         fetchHolidays();
//     }, [selectedYear]);

//     useEffect(() => {
//         handleSearch(searchText);
//     }, [holidays, searchText]);

//     const fetchHolidays = async () => {
//         setLoading(true);
//         try {
//             const data = await getHolidays(selectedYear);
//             setHolidays(data.data);
//         } catch (error) {
//             message.error('Failed to fetch holidays');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSearch = (value) => {
//         const filtered = holidays.filter((holiday) => {
//             const holidayDate = moment(holiday.holiday_date);
//             const dayName = holidayDate.format('dddd');
//             const monthName = holidayDate.format('MMMM');
            
//             return (
//                 holiday.holiday_name?.toLowerCase().includes(value.toLowerCase()) ||
//                 holiday.description?.toLowerCase().includes(value.toLowerCase()) ||
//                 dayName.toLowerCase().includes(value.toLowerCase()) ||
//                 monthName.toLowerCase().includes(value.toLowerCase()) ||
//                 holidayDate.format('DD MMM YYYY').toLowerCase().includes(value.toLowerCase())
//             );
//         });
//         setFilteredData(filtered);
//     };

//     const showModal = (holiday = null) => {
//         setEditingHoliday(holiday);
//         if (holiday) {
//             form.setFieldsValue({
//                 ...holiday,
//                 holiday_date: moment(holiday.holiday_date)
//             });
//         } else {
//             form.resetFields();
//             form.setFieldsValue({
//                 is_mandatory: true
//             });
//         }
//         setModalVisible(true);
//     };

//     const handleSubmit = async (values) => {
//         try {
//             const holidayData = {
//                 ...values,
//                 holiday_date: values.holiday_date.format('YYYY-MM-DD')
//             };

//             if (editingHoliday) {
//                 await updateHoliday(editingHoliday.id, holidayData);
//                 message.success('Holiday updated successfully');
//             } else {
//                 await createHoliday(holidayData);
//                 message.success('Holiday created successfully');
//             }
//             setModalVisible(false);
//             fetchHolidays();
//         } catch (error) {
//             message.error(error.response?.data?.message || 'Operation failed');
//         }
//     };

//     const handleDelete = async (id) => {
//         try {
//             await deleteHoliday(id);
//             message.success('Holiday deleted successfully');
//             fetchHolidays();
//         } catch (error) {
//             message.error('Failed to delete holiday');
//         }
//     };

//     const getMonthColor = (date) => {
//         const month = moment(date).month();
//         const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple', 'magenta'];
//         return colors[month];
//     };

//     const getDayColor = (date) => {
//         const day = moment(date).format('dddd');
//         if (day === 'Saturday' || day === 'Sunday') return 'red';
//         return 'blue';
//     };

//     const columns = [
//         {
//             title: 'Holiday Name',
//             dataIndex: 'holiday_name',
//             key: 'holiday_name',
//             sorter: (a, b) => (a.holiday_name || '').localeCompare(b.holiday_name || ''),
//             render: (name) => (
//                 <Space>
//                     <CalendarOutlined style={{ color: '#1890ff' }} />
//                     <Tag color="cyan" style={{ fontSize: '14px' }}>{name}</Tag>
//                 </Space>
//             )
//         },
//         {
//             title: 'Date',
//             dataIndex: 'holiday_date',
//             key: 'holiday_date',
//             sorter: (a, b) => moment(a.holiday_date).unix() - moment(b.holiday_date).unix(),
//             render: (date) => (
//                 <Tag color={getMonthColor(date)}>
//                     {moment(date).format('DD MMM YYYY')}
//                 </Tag>
//             )
//         },
//         {
//             title: 'Day',
//             dataIndex: 'holiday_date',
//             key: 'day',
//             sorter: (a, b) => {
//                 const dayA = moment(a.holiday_date).day();
//                 const dayB = moment(b.holiday_date).day();
//                 return dayA - dayB;
//             },
//             render: (date) => {
//                 const day = moment(date).format('dddd');
//                 return <Tag color={getDayColor(date)}>{day}</Tag>;
//             }
//         },
//         {
//             title: 'Month',
//             dataIndex: 'holiday_date',
//             key: 'month',
//             sorter: (a, b) => moment(a.holiday_date).month() - moment(b.holiday_date).month(),
//             render: (date) => (
//                 <Tag color={getMonthColor(date)}>
//                     {moment(date).format('MMMM')}
//                 </Tag>
//             )
//         },
//         {
//             title: 'Description',
//             dataIndex: 'description',
//             key: 'description',
//             ellipsis: true,
//             sorter: (a, b) => (a.description || '').localeCompare(b.description || ''),
//             render: (text) => text || '-'
//         },
//         {
//             title: 'Type',
//             dataIndex: 'is_mandatory',
//             key: 'is_mandatory',
//             align: 'center',
//             sorter: (a, b) => (a.is_mandatory === b.is_mandatory ? 0 : a.is_mandatory ? -1 : 1),
//             render: (mandatory) => (
//                 <Tag color={mandatory ? 'green' : 'gold'} icon={mandatory ? '✓' : '○'}>
//                     {mandatory ? 'Mandatory' : 'Optional'}
//                 </Tag>
//             ),
//             filters: [
//                 { text: 'Mandatory', value: true },
//                 { text: 'Optional', value: false }
//             ],
//             onFilter: (value, record) => record.is_mandatory === value
//         }
//     ];

//     if (canEdit || canDelete) {
//         columns.push({
//             title: 'Action',
//             key: 'action',
//             fixed: 'right',
//             width: 180,
//             render: (_, record) => (
//                 <Space>
//                     {canEdit && (
//                         <Button
//                             type="primary"
//                             size="small"
//                             icon={<EditOutlined />}
//                             onClick={() => showModal(record)}
//                         >
//                             Edit
//                         </Button>
//                     )}
//                     {canDelete && (
//                         <Popconfirm
//                             title="Are you sure to delete this holiday?"
//                             onConfirm={() => handleDelete(record.id)}
//                         >
//                             <Button danger size="small" icon={<DeleteOutlined />}>
//                                 Delete
//                             </Button>
//                         </Popconfirm>
//                     )}
//                 </Space>
//             )
//         });
//     }

//     const displayData = searchText ? filteredData : holidays;
//     const mandatoryCount = displayData.filter(h => h.is_mandatory).length;
//     const optionalCount = displayData.filter(h => !h.is_mandatory).length;

//     return (
//         <div>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
//                 <Space>
//                     <h1>Public Holidays - {selectedYear}</h1>
//                     {/* <Badge count={displayData.length} showZero style={{ backgroundColor: '#1890ff' }} /> */}
//                 </Space>
//                 <Space>
//                     <Button onClick={() => setSelectedYear(selectedYear - 1)}>
//                         Previous Year
//                     </Button>
//                     <Button type="default" onClick={() => setSelectedYear(new Date().getFullYear())}>
//                         Current Year
//                     </Button>
//                     <Button onClick={() => setSelectedYear(selectedYear + 1)}>
//                         Next Year
//                     </Button>
//                     {canCreate && (
//                         <Button
//                             type="primary"
//                             icon={<PlusOutlined />}
//                             onClick={() => showModal()}
//                         >
//                             Add Holiday
//                         </Button>
//                     )}
//                 </Space>
//             </div>

//             <Card>
//                 {/* Summary Section */}
//                 {/* <Space style={{ marginBottom: 16 }} size="large">
//                     <Space>
//                         <span style={{ fontWeight: 500 }}>Total Holidays:</span>
//                         <Badge count={displayData.length} style={{ backgroundColor: '#1890ff' }} />
//                     </Space>
//                     <Space>
//                         <span style={{ fontWeight: 500 }}>Mandatory:</span>
//                         <Badge count={mandatoryCount} style={{ backgroundColor: '#52c41a' }} />
//                     </Space>
//                     <Space>
//                         <span style={{ fontWeight: 500 }}>Optional:</span>
//                         <Badge count={optionalCount} style={{ backgroundColor: '#faad14' }} />
//                     </Space>
//                 </Space> */}

//                 {/* Search Bar */}
//                 <div style={{ marginBottom: 16 }}>
//                     <Input
//                         placeholder="Search by holiday name, description, month, day, or date"
//                         prefix={<SearchOutlined />}
//                         onChange={(e) => setSearchText(e.target.value)}
//                         allowClear
//                         style={{ width: '100%' }}
//                     />
//                 </div>

//                 <Table
//                     dataSource={displayData}
//                     columns={columns}
//                     loading={loading}
//                     rowKey="id"
//                     pagination={{
//                         pageSize: 15,
//                         showSizeChanger: true,
//                         pageSizeOptions: ['10', '15', '20', '50'],
//                         showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} holidays`
//                     }}
//                 />
//             </Card>

//             <Modal
//                 title={
//                     <Space>
//                         <CalendarOutlined style={{ color: '#1890ff' }} />
//                         <span>{editingHoliday ? 'Edit Holiday' : 'Add Holiday'}</span>
//                     </Space>
//                 }
//                 open={modalVisible}
//                 onCancel={() => setModalVisible(false)}
//                 footer={null}
//                 width={600}
//             >
//                 <Form
//                     form={form}
//                     layout="vertical"
//                     onFinish={handleSubmit}
//                 >
//                     <Form.Item
//                         name="holiday_name"
//                         label="Holiday Name"
//                         rules={[{ required: true, message: 'Please enter holiday name' }]}
//                     >
//                         <Input placeholder="e.g., Independence Day" />
//                     </Form.Item>

//                     <Form.Item
//                         name="holiday_date"
//                         label="Date"
//                         rules={[{ required: true, message: 'Please select date' }]}
//                     >
//                         <DatePicker 
//                             style={{ width: '100%' }} 
//                             format="DD MMM YYYY"
//                             placeholder="Select holiday date"
//                         />
//                     </Form.Item>

//                     <Form.Item
//                         name="description"
//                         label="Description"
//                     >
//                         <Input.TextArea rows={3} placeholder="Optional description" />
//                     </Form.Item>

//                     <Form.Item
//                         name="is_mandatory"
//                         label="Holiday Type"
//                         valuePropName="checked"
//                         initialValue={true}
//                     >
//                         <Switch 
//                             checkedChildren="Mandatory" 
//                             unCheckedChildren="Optional"
//                         />
//                     </Form.Item>

//                     <Form.Item>
//                         <Space>
//                             <Button type="primary" htmlType="submit">
//                                 {editingHoliday ? 'Update' : 'Create'}
//                             </Button>
//                             <Button onClick={() => setModalVisible(false)}>
//                                 Cancel
//                             </Button>
//                         </Space>
//                     </Form.Item>
//                 </Form>
//             </Modal>
//         </div>
//     );
// };

// export default HolidaysPage;

import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Drawer, Form, Input, DatePicker, message, Popconfirm, Switch, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, CalendarOutlined } from '@ant-design/icons';
import { getHolidays, createHoliday, updateHoliday, deleteHoliday } from '../services/calendarService';
import moment from 'moment';
import { hasPermission } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const HolidaysPage = () => {
    const [holidays, setHolidays] = useState([]);
    const [loading, setLoading] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [editingHoliday, setEditingHoliday] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [form] = Form.useForm();
    const { user } = useAuth();

    const canCreate = user?.role_name === 'superadmin' || user?.role_name === 'hr' || hasPermission('holidays', 'create');
    const canEdit = user?.role_name === 'superadmin' || user?.role_name === 'hr' || hasPermission('holidays', 'edit');
    const canDelete = user?.role_name === 'superadmin' || user?.role_name === 'hr' || hasPermission('holidays', 'delete');

    useEffect(() => {
        fetchHolidays();
    }, [selectedYear]);

    useEffect(() => {
        handleSearch(searchText);
    }, [holidays, searchText]);

    const fetchHolidays = async () => {
        setLoading(true);
        try {
            const data = await getHolidays(selectedYear);
            setHolidays(data.data);
        } catch (error) {
            message.error('Failed to fetch holidays');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (value) => {
        const filtered = holidays.filter((holiday) => {
            const holidayDate = moment(holiday.holiday_date);
            const dayName = holidayDate.format('dddd');
            const monthName = holidayDate.format('MMMM');
            
            return (
                holiday.holiday_name?.toLowerCase().includes(value.toLowerCase()) ||
                holiday.description?.toLowerCase().includes(value.toLowerCase()) ||
                dayName.toLowerCase().includes(value.toLowerCase()) ||
                monthName.toLowerCase().includes(value.toLowerCase()) ||
                holidayDate.format('DD MMM YYYY').toLowerCase().includes(value.toLowerCase())
            );
        });
        setFilteredData(filtered);
    };

    const showDrawer = (holiday = null) => {
        setEditingHoliday(holiday);
        if (holiday) {
            form.setFieldsValue({
                ...holiday,
                holiday_date: moment(holiday.holiday_date)
            });
        } else {
            form.resetFields();
            form.setFieldsValue({
                is_mandatory: true
            });
        }
        setDrawerVisible(true);
    };

    const onCloseDrawer = () => {
        setDrawerVisible(false);
        form.resetFields();
        setEditingHoliday(null);
    };

    const handleSubmit = async (values) => {
        try {
            const holidayData = {
                ...values,
                holiday_date: values.holiday_date.format('YYYY-MM-DD')
            };

            if (editingHoliday) {
                await updateHoliday(editingHoliday.id, holidayData);
                message.success('Holiday updated successfully');
            } else {
                await createHoliday(holidayData);
                message.success('Holiday created successfully');
            }
            onCloseDrawer();
            fetchHolidays();
        } catch (error) {
            message.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteHoliday(id);
            message.success('Holiday deleted successfully');
            fetchHolidays();
        } catch (error) {
            message.error('Failed to delete holiday');
        }
    };

    const getMonthColor = (date) => {
        const month = moment(date).month();
        const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple', 'magenta'];
        return colors[month];
    };

    const getDayColor = (date) => {
        const day = moment(date).format('dddd');
        if (day === 'Saturday' || day === 'Sunday') return 'red';
        return 'blue';
    };

    const columns = [
        {
            title: 'Holiday Name',
            dataIndex: 'holiday_name',
            key: 'holiday_name',
            sorter: (a, b) => (a.holiday_name || '').localeCompare(b.holiday_name || ''),
            render: (name) => (
                <Space>
                    <CalendarOutlined style={{ color: '#1890ff' }} />
                    <Tag color="cyan" style={{ fontSize: '14px' }}>{name}</Tag>
                </Space>
            )
        },
        {
            title: 'Date',
            dataIndex: 'holiday_date',
            key: 'holiday_date',
            sorter: (a, b) => moment(a.holiday_date).unix() - moment(b.holiday_date).unix(),
            render: (date) => (
                <Tag color={getMonthColor(date)}>
                    {moment(date).format('DD MMM YYYY')}
                </Tag>
            )
        },
        {
            title: 'Day',
            dataIndex: 'holiday_date',
            key: 'day',
            sorter: (a, b) => {
                const dayA = moment(a.holiday_date).day();
                const dayB = moment(b.holiday_date).day();
                return dayA - dayB;
            },
            render: (date) => {
                const day = moment(date).format('dddd');
                return <Tag color={getDayColor(date)}>{day}</Tag>;
            }
        },
        {
            title: 'Month',
            dataIndex: 'holiday_date',
            key: 'month',
            sorter: (a, b) => moment(a.holiday_date).month() - moment(b.holiday_date).month(),
            render: (date) => (
                <Tag color={getMonthColor(date)}>
                    {moment(date).format('MMMM')}
                </Tag>
            )
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            sorter: (a, b) => (a.description || '').localeCompare(b.description || ''),
            render: (text) => text || '-'
        },
        {
            title: 'Type',
            dataIndex: 'is_mandatory',
            key: 'is_mandatory',
            align: 'center',
            sorter: (a, b) => (a.is_mandatory === b.is_mandatory ? 0 : a.is_mandatory ? -1 : 1),
            render: (mandatory) => (
                <Tag color={mandatory ? 'green' : 'gold'} icon={mandatory ? '✓' : '○'}>
                    {mandatory ? 'Mandatory' : 'Optional'}
                </Tag>
            ),
            filters: [
                { text: 'Mandatory', value: true },
                { text: 'Optional', value: false }
            ],
            onFilter: (value, record) => record.is_mandatory === value
        }
    ];

    if (canEdit || canDelete) {
        columns.push({
            title: 'Action',
            key: 'action',
            fixed: 'right',
            width: 180,
            render: (_, record) => (
                <Space>
                    {canEdit && (
                        <Button
                            type="primary"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => showDrawer(record)}
                        >
                            Edit
                        </Button>
                    )}
                    {canDelete && (
                        <Popconfirm
                            title="Are you sure to delete this holiday?"
                            onConfirm={() => handleDelete(record.id)}
                        >
                            <Button danger size="small" icon={<DeleteOutlined />}>
                                Delete
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
            )
        });
    }

    const displayData = searchText ? filteredData : holidays;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Space>
                    <h1>Public Holidays - {selectedYear}</h1>
                </Space>
                <Space>
                    <Button onClick={() => setSelectedYear(selectedYear - 1)}>
                        Previous Year
                    </Button>
                    <Button type="default" onClick={() => setSelectedYear(new Date().getFullYear())}>
                        Current Year
                    </Button>
                    <Button onClick={() => setSelectedYear(selectedYear + 1)}>
                        Next Year
                    </Button>
                    {canCreate && (
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => showDrawer()}
                        >
                            Add Holiday
                        </Button>
                    )}
                </Space>
            </div>

            <Card>
                <div style={{ marginBottom: 16 }}>
                    <Input
                        placeholder="Search by holiday name, description, month, day, or date"
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
                    pagination={{
                        pageSize: 15,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '15', '20', '50'],
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} holidays`
                    }}
                />
            </Card>

            <Drawer
                title={
                    <Space>
                        <CalendarOutlined style={{ color: '#1890ff' }} />
                        <span>{editingHoliday ? 'Edit Holiday' : 'Add Holiday'}</span>
                    </Space>
                }
                placement="right"
                width={500}
                onClose={onCloseDrawer}
                open={drawerVisible}
                bodyStyle={{ paddingBottom: 80 }}
                footer={
                    <div style={{ textAlign: 'right' }}>
                        <Space>
                            <Button onClick={onCloseDrawer}>
                                Cancel
                            </Button>
                            <Button type="primary" onClick={() => form.submit()}>
                                {editingHoliday ? 'Update' : 'Create'}
                            </Button>
                        </Space>
                    </div>
                }
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="holiday_name"
                        label="Holiday Name"
                        rules={[{ required: true, message: 'Please enter holiday name' }]}
                    >
                        <Input placeholder="e.g., Independence Day" />
                    </Form.Item>

                    <Form.Item
                        name="holiday_date"
                        label="Date"
                        rules={[{ required: true, message: 'Please select date' }]}
                    >
                        <DatePicker 
                            style={{ width: '100%' }} 
                            format="DD MMM YYYY"
                            placeholder="Select holiday date"
                        />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                    >
                        <Input.TextArea rows={3} placeholder="Optional description" />
                    </Form.Item>

                    <Form.Item
                        name="is_mandatory"
                        label="Holiday Type"
                        valuePropName="checked"
                        initialValue={true}
                    >
                        <Switch 
                            checkedChildren="Mandatory" 
                            unCheckedChildren="Optional"
                        />
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default HolidaysPage;
