// import React, { useState, useEffect } from 'react';
// import { Modal, Form, Input, Select, DatePicker, Button, Space, message } from 'antd';
// import { createEmployee, updateEmployee } from '../../services/employeeService';
// import { getAllRoles } from '../../services/roleService';
// import moment from 'moment';

// const EmployeeFormModal = ({ visible, employee, onClose }) => {
//     const [roles, setRoles] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [form] = Form.useForm();
    
//     const isEditMode = !!employee;

//     useEffect(() => {
//         if (visible) {
//             fetchRoles();
            
//             // If editing, populate form with employee data
//             if (employee) {
//                 form.setFieldsValue({
//                     employee_id: employee.employee_id,
//                     name: employee.name,
//                     email: employee.email,
//                     mobile_number: employee.mobile_number,
//                     role_id: employee.role_id,
//                     department_id: employee.department_id,
//                     reporting_manager_id: employee.reporting_manager_id,
//                     designation: employee.designation,
//                     is_active: employee.is_active,
//                     date_of_birth: employee.date_of_birth ? moment(employee.date_of_birth) : null,
//                     date_of_joining: employee.date_of_joining ? moment(employee.date_of_joining) : null
//                 });
//             } else {
//                 form.resetFields();
//             }
//         }
//     }, [visible, employee, form]);

//     const fetchRoles = async () => {
//         try {
//             const data = await getAllRoles();
//             setRoles(data.data);
//         } catch (error) {
//             message.error('Failed to fetch roles');
//         }
//     };

//     const handleSubmit = async () => {
//         try {
//             const values = await form.validateFields();
//             setLoading(true);

//             const employeeData = {
//                 ...values,
//                 date_of_birth: values.date_of_birth ? values.date_of_birth.format('YYYY-MM-DD') : null,
//                 date_of_joining: values.date_of_joining ? values.date_of_joining.format('YYYY-MM-DD') : null
//             };

//             if (isEditMode) {
//                 await updateEmployee(employee.emp_id, employeeData);
//                 message.success('Employee updated successfully');
//             } else {
//                 await createEmployee(employeeData);
//                 message.success('Employee created successfully');
//             }
            
//             form.resetFields();
//             onClose();
//         } catch (error) {
//             if (error.errorFields) {
//                 // Form validation error
//                 return;
//             }
//             message.error(error.response?.data?.message || 'Operation failed');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleCancel = () => {
//         form.resetFields();
//         onClose();
//     };

//     return (
//         <Modal
//             title={isEditMode ? 'Edit Employee' : 'Add Employee'}
//             open={visible}
//             onCancel={handleCancel}
//             width={800}
//             footer={[
//                 <Button key="cancel" onClick={handleCancel}>
//                     Cancel
//                 </Button>,
//                 <Button 
//                     key="submit" 
//                     type="primary" 
//                     loading={loading}
//                     onClick={handleSubmit}
//                 >
//                     {isEditMode ? 'Update' : 'Create'}
//                 </Button>
//             ]}
//         >
//             <Form
//                 form={form}
//                 layout="vertical"
//                 style={{ marginTop: 16 }}
//             >
//                 <Form.Item
//                     name="employee_id"
//                     label="Employee ID"
//                     rules={[{ required: true, message: 'Please enter employee ID' }]}
//                 >
//                     <Input placeholder="e.g., EMP001" />
//                 </Form.Item>

//                 {!isEditMode && (
//                     <Form.Item
//                         name="password"
//                         label="Password"
//                         rules={[{ required: true, message: 'Please enter password' }]}
//                     >
//                         <Input.Password placeholder="Initial password" />
//                     </Form.Item>
//                 )}

//                 <Form.Item
//                     name="name"
//                     label="Full Name"
//                     rules={[{ required: true, message: 'Please enter name' }]}
//                 >
//                     <Input placeholder="Full Name" />
//                 </Form.Item>

//                 <Form.Item
//                     name="email"
//                     label="Email"
//                     rules={[
//                         { required: true, message: 'Please enter email' },
//                         { type: 'email', message: 'Please enter valid email' }
//                     ]}
//                 >
//                     <Input placeholder="email@company.com" />
//                 </Form.Item>

//                 <Form.Item
//                     name="mobile_number"
//                     label="Mobile Number"
//                     rules={[{ required: true, message: 'Please enter mobile number' }]}
//                 >
//                     <Input placeholder="Mobile Number" />
//                 </Form.Item>

//                 <Form.Item
//                     name="role_id"
//                     label="Role"
//                     rules={[{ required: true, message: 'Please select role' }]}
//                 >
//                     <Select placeholder="Select Role">
//                         {roles.map(role => (
//                             <Select.Option key={role.id} value={role.id}>
//                                 {role.role_name}
//                             </Select.Option>
//                         ))}
//                     </Select>
//                 </Form.Item>

//                 <Form.Item
//                     name="designation"
//                     label="Designation"
//                 >
//                     <Input placeholder="e.g., Software Developer" />
//                 </Form.Item>

//                 <Form.Item
//                     name="date_of_birth"
//                     label="Date of Birth"
//                 >
//                     <DatePicker style={{ width: '100%' }} />
//                 </Form.Item>

//                 <Form.Item
//                     name="date_of_joining"
//                     label="Date of Joining"
//                 >
//                     <DatePicker style={{ width: '100%' }} />
//                 </Form.Item>

//                 {isEditMode && (
//                     <Form.Item
//                         name="is_active"
//                         label="Status"
//                         initialValue={true}
//                     >
//                         <Select>
//                             <Select.Option value={true}>Active</Select.Option>
//                             <Select.Option value={false}>Inactive</Select.Option>
//                         </Select>
//                     </Form.Item>
//                 )}
//             </Form>
//         </Modal>
//     );
// };

// export default EmployeeFormModal;






import React, { useState, useEffect } from 'react';
import { Drawer, Form, Input, Select, DatePicker, Button, Space, message, Row, Col } from 'antd';
import { createEmployee, updateEmployee } from '../../services/employeeService';
import { getAllRoles } from '../../services/roleService';
import moment from 'moment';

const EmployeeFormDrawer = ({ visible, employee, onClose }) => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    
    const isEditMode = !!employee;

    useEffect(() => {
        if (visible) {
            fetchRoles();
            
            if (employee) {
                form.setFieldsValue({
                    employee_id: employee.employee_id,
                    name: employee.name,
                    email: employee.email,
                    mobile_number: employee.mobile_number,
                    role_id: employee.role_id,
                    department_id: employee.department_id,
                    reporting_manager_id: employee.reporting_manager_id,
                    designation: employee.designation,
                    is_active: employee.is_active,
                    date_of_birth: employee.date_of_birth ? moment(employee.date_of_birth) : null,
                    date_of_joining: employee.date_of_joining ? moment(employee.date_of_joining) : null
                });
            } else {
                form.resetFields();
            }
        }
    }, [visible, employee, form]);

    const fetchRoles = async () => {
        try {
            const data = await getAllRoles();
            setRoles(data.data);
        } catch (error) {
            message.error('Failed to fetch roles');
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            const employeeData = {
                ...values,
                date_of_birth: values.date_of_birth ? values.date_of_birth.format('YYYY-MM-DD') : null,
                date_of_joining: values.date_of_joining ? values.date_of_joining.format('YYYY-MM-DD') : null
            };

            if (isEditMode) {
                await updateEmployee(employee.emp_id, employeeData);
                message.success('Employee updated successfully');
            } else {
                await createEmployee(employeeData);
                message.success('Employee created successfully');
            }
            
            form.resetFields();
            onClose();
        } catch (error) {
            if (error.errorFields) {
                return;
            }
            message.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Drawer
            title={isEditMode ? 'Edit Employee' : 'Add Employee'}
            placement="right"
            width={720}
            onClose={handleCancel}
            open={visible}
            bodyStyle={{ paddingBottom: 80 }}
            footer={
                <div style={{ textAlign: 'right' }}>
                    <Space>
                        <Button onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="primary" loading={loading} onClick={handleSubmit}>
                            {isEditMode ? 'Update' : 'Create'}
                        </Button>
                    </Space>
                </div>
            }
        >
            <Form
                form={form}
                layout="vertical"
            >
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="employee_id"
                            label="Employee ID"
                            rules={[{ required: true, message: 'Please enter employee ID' }]}
                        >
                            <Input placeholder="e.g., EMP001" />
                        </Form.Item>
                    </Col>

                    {!isEditMode && (
                        <Col span={12}>
                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[{ required: true, message: 'Please enter password' }]}
                            >
                                <Input.Password placeholder="Initial password" />
                            </Form.Item>
                        </Col>
                    )}
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Full Name"
                            rules={[{ required: true, message: 'Please enter name' }]}
                        >
                            <Input placeholder="Full Name" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Please enter email' },
                                { type: 'email', message: 'Please enter valid email' }
                            ]}
                        >
                            <Input placeholder="email@company.com" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="mobile_number"
                            label="Mobile Number"
                            rules={[{ required: true, message: 'Please enter mobile number' }]}
                        >
                            <Input placeholder="Mobile Number" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="role_id"
                            label="Role"
                            rules={[{ required: true, message: 'Please select role' }]}
                        >
                            <Select placeholder="Select Role">
                                {roles.map(role => (
                                    <Select.Option key={role.id} value={role.id}>
                                        {role.role_name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="designation"
                            label="Designation"
                        >
                            <Input placeholder="e.g., Software Developer" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="date_of_birth"
                            label="Date of Birth"
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="date_of_joining"
                            label="Date of Joining"
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>

                    {isEditMode && (
                        <Col span={12}>
                            <Form.Item
                                name="is_active"
                                label="Status"
                                initialValue={true}
                            >
                                <Select>
                                    <Select.Option value={true}>Active</Select.Option>
                                    <Select.Option value={false}>Inactive</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    )}
                </Row>
            </Form>
        </Drawer>
    );
};

export default EmployeeFormDrawer;

