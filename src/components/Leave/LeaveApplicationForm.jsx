// // import React, { useState, useEffect } from 'react';
// // import { Form, Select, DatePicker, Input, Button, message } from 'antd';
// // import { applyLeave, getLeaveTypes } from '../../services/leaveService';
// // import moment from 'moment';

// // const { RangePicker } = DatePicker;
// // const { TextArea } = Input;

// // const LeaveApplicationForm = ({ onSuccess }) => {
// //     const [form] = Form.useForm();
// //     const [loading, setLoading] = useState(false);
// //     const [leaveTypes, setLeaveTypes] = useState([]);

// //     useEffect(() => {
// //         fetchLeaveTypes();
// //     }, []);

// //     const fetchLeaveTypes = async () => {
// //         try {
// //             const data = await getLeaveTypes();
// //             setLeaveTypes(data.data);
// //         } catch (error) {
// //             message.error('Failed to fetch leave types');
// //         }
// //     };

// //     const onFinish = async (values) => {
// //         setLoading(true);
// //         try {
// //             const leaveData = {
// //                 leave_type_id: values.leave_type_id,
// //                 from_date: values.dates[0].format('YYYY-MM-DD'),
// //                 to_date: values.dates[1].format('YYYY-MM-DD'),
// //                 reason: values.reason
// //             };

// //             await applyLeave(leaveData);
// //             message.success('Leave application submitted successfully');
// //             form.resetFields();
// //             if (onSuccess) onSuccess();
// //         } catch (error) {
// //             message.error(error.response?.data?.message || 'Failed to apply leave');
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     return (
// //         <Form
// //             form={form}
// //             layout="vertical"
// //             onFinish={onFinish}
// //         >
// //             <Form.Item
// //                 name="leave_type_id"
// //                 label="Leave Type"
// //                 rules={[{ required: true, message: 'Please select leave type' }]}
// //             >
// //                 <Select placeholder="Select leave type">
// //                     {leaveTypes.map(type => (
// //                         <Select.Option key={type.id} value={type.id}>
// //                             {type.leave_name} ({type.leave_code})
// //                         </Select.Option>
// //                     ))}
// //                 </Select>
// //             </Form.Item>

// //             <Form.Item
// //                 name="dates"
// //                 label="Leave Period"
// //                 rules={[{ required: true, message: 'Please select leave dates' }]}
// //             >
// //                 <RangePicker 
// //                     style={{ width: '100%' }}
// //                     disabledDate={(current) => current && current < moment().startOf('day')}
// //                 />
// //             </Form.Item>

// //             <Form.Item
// //                 name="reason"
// //                 label="Reason"
// //                 rules={[{ required: true, message: 'Please enter reason' }]}
// //             >
// //                 <TextArea rows={4} placeholder="Enter reason for leave" />
// //             </Form.Item>

// //             <Form.Item>
// //                 <Button type="primary" htmlType="submit" loading={loading}>
// //                     Apply Leave
// //                 </Button>
// //             </Form.Item>
// //         </Form>
// //     );
// // };

// // export default LeaveApplicationForm;


// import React, { useState, useEffect } from 'react';
// import { Form, Select, DatePicker, Input, Button, message, Radio } from 'antd';
// import { applyLeave, getLeaveTypes } from '../../services/leaveService';
// import moment from 'moment';

// const { RangePicker } = DatePicker;
// const { TextArea } = Input;

// const LeaveApplicationForm = ({ onSuccess }) => {
//     const [form] = Form.useForm();
//     const [loading, setLoading] = useState(false);
//     const [leaveTypes, setLeaveTypes] = useState([]);
//     const [leaveMode, setLeaveMode] = useState('full'); // 'full', 'half', or 'range'

//     useEffect(() => {
//         fetchLeaveTypes();
//     }, []);

//     const fetchLeaveTypes = async () => {
//         try {
//             const data = await getLeaveTypes();
//             setLeaveTypes(data.data);
//         } catch (error) {
//             message.error('Failed to fetch leave types');
//         }
//     };

//     const onFinish = async (values) => {
//         setLoading(true);
//         try {
//             let leaveData;

//             if (leaveMode === 'half') {
//                 // Half day leave
//                 leaveData = {
//                     leave_type_id: values.leave_type_id,
//                     from_date: values.single_date.format('YYYY-MM-DD'),
//                     to_date: values.single_date.format('YYYY-MM-DD'),
//                     is_half_day: true,
//                     reason: values.reason
//                 };
//             } else if (leaveMode === 'full') {
//                 // Single full day leave
//                 leaveData = {
//                     leave_type_id: values.leave_type_id,
//                     from_date: values.single_date.format('YYYY-MM-DD'),
//                     to_date: values.single_date.format('YYYY-MM-DD'),
//                     is_half_day: false,
//                     reason: values.reason
//                 };
//             } else {
//                 // Multiple days leave
//                 leaveData = {
//                     leave_type_id: values.leave_type_id,
//                     from_date: values.dates[0].format('YYYY-MM-DD'),
//                     to_date: values.dates[1].format('YYYY-MM-DD'),
//                     is_half_day: false,
//                     reason: values.reason
//                 };
//             }

//             await applyLeave(leaveData);
//             message.success('Leave application submitted successfully');
//             form.resetFields();
//             setLeaveMode('full');
//             if (onSuccess) onSuccess();
//         } catch (error) {
//             message.error(error.response?.data?.message || 'Failed to apply leave');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Form
//             form={form}
//             layout="vertical"
//             onFinish={onFinish}
//         >
//             <Form.Item
//                 name="leave_type_id"
//                 label="Leave Type"
//                 rules={[{ required: true, message: 'Please select leave type' }]}
//             >
//                 <Select placeholder="Select leave type">
//                     {leaveTypes.map(type => (
//                         <Select.Option key={type.id} value={type.id}>
//                             {type.leave_name} ({type.leave_code})
//                         </Select.Option>
//                     ))}
//                 </Select>
//             </Form.Item>

//             <Form.Item
//                 label="Leave Duration"
//                 required
//             >
//                 <Radio.Group 
//                     value={leaveMode} 
//                     onChange={(e) => {
//                         setLeaveMode(e.target.value);
//                         form.resetFields(['single_date', 'dates']);
//                     }}
//                 >
//                     <Radio value="full">Single Day (Full)</Radio>
//                     <Radio value="half">Single Day (Half)</Radio>
//                     <Radio value="range">Multiple Days</Radio>
//                 </Radio.Group>
//             </Form.Item>

//             {(leaveMode === 'full' || leaveMode === 'half') && (
//                 <Form.Item
//                     name="single_date"
//                     label="Select Date"
//                     rules={[{ required: true, message: 'Please select date' }]}
//                 >
//                     <DatePicker 
//                         style={{ width: '100%' }}
//                         disabledDate={(current) => current && current < moment().startOf('day')}
//                     />
//                 </Form.Item>
//             )}

//             {leaveMode === 'range' && (
//                 <Form.Item
//                     name="dates"
//                     label="Leave Period"
//                     rules={[{ required: true, message: 'Please select leave dates' }]}
//                 >
//                     <RangePicker 
//                         style={{ width: '100%' }}
//                         disabledDate={(current) => current && current < moment().startOf('day')}
//                     />
//                 </Form.Item>
//             )}

//             <Form.Item
//                 name="reason"
//                 label="Reason"
//                 rules={[{ required: true, message: 'Please enter reason' }]}
//             >
//                 <TextArea rows={4} placeholder="Enter reason for leave" />
//             </Form.Item>

//             <Form.Item>
//                 <Button type="primary" htmlType="submit" loading={loading}>
//                     Apply Leave
//                 </Button>
//             </Form.Item>
//         </Form>
//     );
// };

// export default LeaveApplicationForm;



// import React, { useState, useEffect } from 'react';
// import { Form, Select, DatePicker, Input, Button, message, Radio, TimePicker } from 'antd';
// import { applyLeave, getLeaveTypes } from '../../services/leaveService';
// import moment from 'moment';

// const { RangePicker } = DatePicker;
// const { TextArea } = Input;

// const LeaveApplicationForm = ({ onSuccess }) => {
//     const [form] = Form.useForm();
//     const [loading, setLoading] = useState(false);
//     const [leaveTypes, setLeaveTypes] = useState([]);
//     const [leaveMode, setLeaveMode] = useState('full');
//     const [selectedLeaveType, setSelectedLeaveType] = useState(null);
//     const [isOverDuty, setIsOverDuty] = useState(false);

//     useEffect(() => {
//         fetchLeaveTypes();
//     }, []);

//     const fetchLeaveTypes = async () => {
//         try {
//             const data = await getLeaveTypes();
//             setLeaveTypes(data.data);
//         } catch (error) {
//             message.error('Failed to fetch leave types');
//         }
//     };

//     const handleLeaveTypeChange = (value) => {
//         const selected = leaveTypes.find(type => type.id === value);
//         setSelectedLeaveType(selected);
        
//         // Check if it's Over Duty
//         const isOD = selected?.leave_code?.toUpperCase() === 'OD';
//         setIsOverDuty(isOD);
        
//         if (isOD) {
//             setLeaveMode('full'); // Reset to single day for OD
//             form.resetFields(['dates', 'single_date', 'od_times']);
//         } else {
//             form.resetFields(['od_times']);
//         }
//     };

//     const onFinish = async (values) => {
//         setLoading(true);
//         try {
//             let leaveData;

// // In LeaveApplicationForm.jsx - modify the OD section in onFinish
// if (isOverDuty) {
//     const startTime = values.od_times[0].format('HH:mm:ss');
//     const endTime = values.od_times[1].format('HH:mm:ss');
    
//     const start = moment(startTime, 'HH:mm:ss');
//     const end = moment(endTime, 'HH:mm:ss');
//     const odHours = end.diff(start, 'hours', true);

//     if (odHours <= 0) {
//         message.error('End time must be after start time');
//         setLoading(false);
//         return;
//     }

//     leaveData = {
//         leave_type_id: values.leave_type_id,
//         from_date: values.single_date.format('YYYY-MM-DD'),
//         to_date: values.single_date.format('YYYY-MM-DD'),
//         is_half_day: false,
//         is_od: true,  // Add this flag
//         od_start_time: startTime,
//         od_end_time: endTime,
//         od_hours: odHours,
//         reason: values.reason
//     };
// }
            
//             else if (leaveMode === 'half') {
//                 // Half day leave
//                 leaveData = {
//                     leave_type_id: values.leave_type_id,
//                     from_date: values.single_date.format('YYYY-MM-DD'),
//                     to_date: values.single_date.format('YYYY-MM-DD'),
//                     is_half_day: true,
//                     reason: values.reason
//                 };
//             } else if (leaveMode === 'full') {
//                 // Single full day leave
//                 leaveData = {
//                     leave_type_id: values.leave_type_id,
//                     from_date: values.single_date.format('YYYY-MM-DD'),
//                     to_date: values.single_date.format('YYYY-MM-DD'),
//                     is_half_day: false,
//                     reason: values.reason
//                 };
//             } else {
//                 // Multiple days leave
//                 leaveData = {
//                     leave_type_id: values.leave_type_id,
//                     from_date: values.dates[0].format('YYYY-MM-DD'),
//                     to_date: values.dates[1].format('YYYY-MM-DD'),
//                     is_half_day: false,
//                     reason: values.reason
//                 };
//             }

//             await applyLeave(leaveData);
//             message.success(isOverDuty ? 'Over Duty application submitted successfully' : 'Leave application submitted successfully');
//             form.resetFields();
//             setLeaveMode('full');
//             setIsOverDuty(false);
//             setSelectedLeaveType(null);
//             if (onSuccess) onSuccess();
//         } catch (error) {
//             message.error(error.response?.data?.message || 'Failed to apply leave');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Form
//             form={form}
//             layout="vertical"
//             onFinish={onFinish}
//         >
//             <Form.Item
//                 name="leave_type_id"
//                 label="Leave Type"
//                 rules={[{ required: true, message: 'Please select leave type' }]}
//             >
//                 <Select 
//                     placeholder="Select leave type"
//                     onChange={handleLeaveTypeChange}
//                 >
//                     {leaveTypes.map(type => (
//                         <Select.Option key={type.id} value={type.id}>
//                             {type.leave_name} ({type.leave_code})
//                         </Select.Option>
//                     ))}
//                 </Select>
//             </Form.Item>

//             {!isOverDuty && (
//                 <Form.Item
//                     label="Leave Duration"
//                     required
//                 >
//                     <Radio.Group 
//                         value={leaveMode} 
//                         onChange={(e) => {
//                             setLeaveMode(e.target.value);
//                             form.resetFields(['single_date', 'dates']);
//                         }}
//                     >
//                         <Radio value="full">Single Day (Full)</Radio>
//                         <Radio value="half">Single Day (Half)</Radio>
//                         <Radio value="range">Multiple Days</Radio>
//                     </Radio.Group>
//                 </Form.Item>
//             )}

//             {isOverDuty && (
//                 <>
//                     <Form.Item
//                         name="single_date"
//                         label="Over Duty Date"
//                         rules={[{ required: true, message: 'Please select date' }]}
//                     >
//                         <DatePicker 
//                             style={{ width: '100%' }}
//                             disabledDate={(current) => current && current > moment().endOf('day')}
//                         />
//                     </Form.Item>

//                     <Form.Item
//                         name="od_times"
//                         label="Over Duty Time Range"
//                         rules={[{ required: true, message: 'Please select OD time range' }]}
//                     >
//                         <TimePicker.RangePicker 
//                             style={{ width: '100%' }}
//                             format="HH:mm"
//                         />
//                     </Form.Item>
//                 </>
//             )}

//             {!isOverDuty && (leaveMode === 'full' || leaveMode === 'half') && (
//                 <Form.Item
//                     name="single_date"
//                     label="Select Date"
//                     rules={[{ required: true, message: 'Please select date' }]}
//                 >
//                     <DatePicker 
//                         style={{ width: '100%' }}
//                         disabledDate={(current) => current && current < moment().startOf('day')}
//                     />
//                 </Form.Item>
//             )}

//             {!isOverDuty && leaveMode === 'range' && (
//                 <Form.Item
//                     name="dates"
//                     label="Leave Period"
//                     rules={[{ required: true, message: 'Please select leave dates' }]}
//                 >
//                     <RangePicker 
//                         style={{ width: '100%' }}
//                         disabledDate={(current) => current && current < moment().startOf('day')}
//                     />
//                 </Form.Item>
//             )}

//             <Form.Item
//                 name="reason"
//                 label="Reason"
//                 rules={[{ required: true, message: 'Please enter reason' }]}
//             >
//                 <TextArea rows={4} placeholder={isOverDuty ? "Enter reason for over duty" : "Enter reason for leave"} />
//             </Form.Item>

//             <Form.Item>
//                 <Button type="primary" htmlType="submit" loading={loading}>
//                     {isOverDuty ? 'Apply Over Duty' : 'Apply Leave'}
//                 </Button>
//             </Form.Item>
//         </Form>
//     );
// };

// export default LeaveApplicationForm;





// import React, { useState, useEffect } from 'react';
// import { Form, Select, DatePicker, Input, Button, message, Radio, TimePicker } from 'antd';
// import { applyLeave, getLeaveTypes } from '../../services/leaveService';
// import moment from 'moment';

// const { RangePicker } = DatePicker;
// const { TextArea } = Input;

// const LeaveApplicationForm = ({ onSuccess }) => {
//     const [form] = Form.useForm();
//     const [loading, setLoading] = useState(false);
//     const [leaveTypes, setLeaveTypes] = useState([]);
//     const [leaveMode, setLeaveMode] = useState('full');
//     const [selectedLeaveType, setSelectedLeaveType] = useState(null);
//     const [isOverDuty, setIsOverDuty] = useState(false);

//     useEffect(() => {
//         fetchLeaveTypes();
//     }, []);

//     const fetchLeaveTypes = async () => {
//         try {
//             const data = await getLeaveTypes();
//             setLeaveTypes(data.data);
//         } catch (error) {
//             message.error('Failed to fetch leave types');
//         }
//     };

//     const handleLeaveTypeChange = (value) => {
//         const selected = leaveTypes.find(type => type.id === value);
//         setSelectedLeaveType(selected);
        
//         // Check if it's Over Duty
//         const isOD = selected?.leave_code?.toUpperCase() === 'OD';
//         setIsOverDuty(isOD);
        
//         if (isOD) {
//             setLeaveMode('full'); // Reset to single day for OD
//             form.resetFields(['dates', 'single_date', 'od_times']);
//         } else {
//             form.resetFields(['od_times']);
//         }
//     };

//     // Validation function for backdated leave (3 days restriction)
//     const validateLeaveDate = (_, value) => {
//         if (!value) return Promise.resolve();
        
//         const today = moment().startOf('day');
//         const selectedDate = moment(value).startOf('day');
//         const daysDifference = today.diff(selectedDate, 'days');
        
//         if (daysDifference > 3) {
//             return Promise.reject(
//                 new Error(`Cannot select dates older than 3 days. This date is ${daysDifference} days in the past.`)
//             );
//         }
//         return Promise.resolve();
//     };

//     // Validation for date range (both dates must be within 3 days)
//     const validateDateRange = (_, value) => {
//         if (!value || value.length !== 2) return Promise.resolve();
        
//         const today = moment().startOf('day');
//         const startDate = moment(value[0]).startOf('day');
//         const endDate = moment(value[1]).startOf('day');
        
//         const startDiff = today.diff(startDate, 'days');
//         const endDiff = today.diff(endDate, 'days');
        
//         if (startDiff > 3) {
//             return Promise.reject(
//                 new Error(`Start date is ${startDiff} days in the past. Cannot be older than 3 days.`)
//             );
//         }
        
//         if (endDiff > 3) {
//             return Promise.reject(
//                 new Error(`End date is ${endDiff} days in the past. Cannot be older than 3 days.`)
//             );
//         }
        
//         return Promise.resolve();
//     };

//     // Disable dates older than 3 days from today
//     const disabledDate = (current) => {
//         if (!current) return false;
        
//         const threeDaysAgo = moment().subtract(3, 'days').startOf('day');
//         return current < threeDaysAgo;
//     };

//     // For OD, also disable future dates
//     const disabledODDate = (current) => {
//         if (!current) return false;
        
//         const threeDaysAgo = moment().subtract(3, 'days').startOf('day');
//         const today = moment().endOf('day');
        
//         return current < threeDaysAgo || current > today;
//     };

//     const onFinish = async (values) => {
//         setLoading(true);
//         try {
//             let leaveData;

//             // Over Duty application
//             if (isOverDuty) {
//                 const startTime = values.od_times[0].format('HH:mm:ss');
//                 const endTime = values.od_times[1].format('HH:mm:ss');
                
//                 const start = moment(startTime, 'HH:mm:ss');
//                 const end = moment(endTime, 'HH:mm:ss');
//                 const odHours = end.diff(start, 'hours', true);

//                 if (odHours <= 0) {
//                     message.error('End time must be after start time');
//                     setLoading(false);
//                     return;
//                 }

//                 leaveData = {
//                     leave_type_id: values.leave_type_id,
//                     from_date: values.single_date.format('YYYY-MM-DD'),
//                     to_date: values.single_date.format('YYYY-MM-DD'),
//                     is_half_day: false,
//                     is_od: true,
//                     od_start_time: startTime,
//                     od_end_time: endTime,
//                     od_hours: odHours,
//                     reason: values.reason
//                 };
//             }
//             // Half day leave
//             else if (leaveMode === 'half') {
//                 leaveData = {
//                     leave_type_id: values.leave_type_id,
//                     from_date: values.single_date.format('YYYY-MM-DD'),
//                     to_date: values.single_date.format('YYYY-MM-DD'),
//                     is_half_day: true,
//                     reason: values.reason
//                 };
//             } 
//             // Single full day leave
//             else if (leaveMode === 'full') {
//                 leaveData = {
//                     leave_type_id: values.leave_type_id,
//                     from_date: values.single_date.format('YYYY-MM-DD'),
//                     to_date: values.single_date.format('YYYY-MM-DD'),
//                     is_half_day: false,
//                     reason: values.reason
//                 };
//             } 
//             // Multiple days leave
//             else {
//                 leaveData = {
//                     leave_type_id: values.leave_type_id,
//                     from_date: values.dates[0].format('YYYY-MM-DD'),
//                     to_date: values.dates[1].format('YYYY-MM-DD'),
//                     is_half_day: false,
//                     reason: values.reason
//                 };
//             }

//             await applyLeave(leaveData);
//             message.success(isOverDuty ? 'Over Duty application submitted successfully' : 'Leave application submitted successfully');
//             form.resetFields();
//             setLeaveMode('full');
//             setIsOverDuty(false);
//             setSelectedLeaveType(null);
//             if (onSuccess) onSuccess();
//         } catch (error) {
//             message.error(error.response?.data?.message || 'Failed to apply leave');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Form
//             form={form}
//             layout="vertical"
//             onFinish={onFinish}
//         >
//             <Form.Item
//                 name="leave_type_id"
//                 label="Leave Type"
//                 rules={[{ required: true, message: 'Please select leave type' }]}
//             >
//                 <Select 
//                     placeholder="Select leave type"
//                     onChange={handleLeaveTypeChange}
//                 >
//                     {leaveTypes.map(type => (
//                         <Select.Option key={type.id} value={type.id}>
//                             {type.leave_name} ({type.leave_code})
//                         </Select.Option>
//                     ))}
//                 </Select>
//             </Form.Item>

//             {!isOverDuty && (
//                 <Form.Item
//                     label="Leave Duration"
//                     required
//                 >
//                     <Radio.Group 
//                         value={leaveMode} 
//                         onChange={(e) => {
//                             setLeaveMode(e.target.value);
//                             form.resetFields(['single_date', 'dates']);
//                         }}
//                     >
//                         <Radio value="full">Single Day (Full)</Radio>
//                         <Radio value="half">Single Day (Half)</Radio>
//                         <Radio value="range">Multiple Days</Radio>
//                     </Radio.Group>
//                 </Form.Item>
//             )}

//             {isOverDuty && (
//                 <>
//                     <Form.Item
//                         name="single_date"
//                         label="Over Duty Date"
//                         rules={[
//                             { required: true, message: 'Please select date' },
//                             { validator: validateLeaveDate }
//                         ]}
//                     >
//                         <DatePicker 
//                             style={{ width: '100%' }}
//                             disabledDate={disabledODDate}
//                             format="DD-MM-YYYY"
//                         />
//                     </Form.Item>

//                     <Form.Item
//                         name="od_times"
//                         label="Over Duty Time Range"
//                         rules={[{ required: true, message: 'Please select OD time range' }]}
//                     >
//                         <TimePicker.RangePicker 
//                             style={{ width: '100%' }}
//                             format="HH:mm"
//                         />
//                     </Form.Item>
//                 </>
//             )}

//             {!isOverDuty && (leaveMode === 'full' || leaveMode === 'half') && (
//                 <Form.Item
//                     name="single_date"
//                     label="Select Date"
//                     rules={[
//                         { required: true, message: 'Please select date' },
//                         { validator: validateLeaveDate }
//                     ]}
//                 >
//                     <DatePicker 
//                         style={{ width: '100%' }}
//                         disabledDate={disabledDate}
//                         format="DD-MM-YYYY"
//                     />
//                 </Form.Item>
//             )}

//             {!isOverDuty && leaveMode === 'range' && (
//                 <Form.Item
//                     name="dates"
//                     label="Leave Period"
//                     rules={[
//                         { required: true, message: 'Please select leave dates' },
//                         { validator: validateDateRange }
//                     ]}
//                 >
//                     <RangePicker 
//                         style={{ width: '100%' }}
//                         disabledDate={disabledDate}
//                         format="DD-MM-YYYY"
//                     />
//                 </Form.Item>
//             )}

//             <Form.Item
//                 name="reason"
//                 label="Reason"
//                 rules={[
//                     { required: true, message: 'Please enter reason' },
//                     { min: 10, message: 'Reason must be at least 10 characters' }
//                 ]}
//             >
//                 <TextArea 
//                     rows={4} 
//                     placeholder={isOverDuty ? "Enter reason for over duty" : "Enter reason for leave"}
//                     showCount
//                     maxLength={500}
//                 />
//             </Form.Item>

//             <Form.Item>
//                 <Button type="primary" htmlType="submit" loading={loading} block size="large">
//                     {isOverDuty ? 'Apply Over Duty' : 'Apply Leave'}
//                 </Button>
//             </Form.Item>
//         </Form>
//     );
// };

// export default LeaveApplicationForm;


import React, { useState, useEffect, useCallback } from 'react';
import { Form, Select, DatePicker, Input, Button, message, Radio, TimePicker } from 'antd';
import { applyLeave, getLeaveTypes } from '../../services/leaveService';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const LeaveApplicationForm = ({ onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [leaveMode, setLeaveMode] = useState('full');
    const [selectedLeaveType, setSelectedLeaveType] = useState(null);
    const [isOverDuty, setIsOverDuty] = useState(false);

    useEffect(() => {
        fetchLeaveTypes();
    }, []); // ✅ Empty dependency array

    const fetchLeaveTypes = useCallback(async () => {
        try {
            const data = await getLeaveTypes();
            setLeaveTypes(data.data);
        } catch (error) {
            message.error('Failed to fetch leave types');
        }
    }, []); // ✅ Memoized function

    const handleLeaveTypeChange = useCallback((value) => {
        const selected = leaveTypes.find(type => type.id === value);
        setSelectedLeaveType(selected);
        
        const isOD = selected?.leave_code?.toUpperCase() === 'OD';
        setIsOverDuty(isOD);
        
        if (isOD) {
            setLeaveMode('full');
            form.resetFields(['dates', 'single_date', 'od_times']);
        } else {
            form.resetFields(['od_times']);
        }
    }, [leaveTypes, form]); // ✅ Dependencies included

    const validateLeaveDate = useCallback((_, value) => {
        if (!value) return Promise.resolve();
        
        const today = moment().startOf('day');
        const selectedDate = moment(value).startOf('day');
        const daysDifference = today.diff(selectedDate, 'days');
        
        if (daysDifference > 3) {
            return Promise.reject(
                new Error(`Cannot select dates older than 3 days. This date is ${daysDifference} days in the past.`)
            );
        }
        return Promise.resolve();
    }, []);

    const validateDateRange = useCallback((_, value) => {
        if (!value || value.length !== 2) return Promise.resolve();
        
        const today = moment().startOf('day');
        const startDate = moment(value[0]).startOf('day');
        const endDate = moment(value[1]).startOf('day');
        
        const startDiff = today.diff(startDate, 'days');
        const endDiff = today.diff(endDate, 'days');
        
        if (startDiff > 3) {
            return Promise.reject(
                new Error(`Start date is ${startDiff} days in the past. Cannot be older than 3 days.`)
            );
        }
        
        if (endDiff > 3) {
            return Promise.reject(
                new Error(`End date is ${endDiff} days in the past. Cannot be older than 3 days.`)
            );
        }
        
        return Promise.resolve();
    }, []);

    const disabledDate = useCallback((current) => {
        if (!current) return false;
        const threeDaysAgo = moment().subtract(3, 'days').startOf('day');
        return current < threeDaysAgo;
    }, []);

    const disabledODDate = useCallback((current) => {
        if (!current) return false;
        const threeDaysAgo = moment().subtract(3, 'days').startOf('day');
        const today = moment().endOf('day');
        return current < threeDaysAgo || current > today;
    }, []);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            let leaveData;

            if (isOverDuty) {
                const startTime = values.od_times[0].format('HH:mm:ss');
                const endTime = values.od_times[1].format('HH:mm:ss');
                
                const start = moment(startTime, 'HH:mm:ss');
                const end = moment(endTime, 'HH:mm:ss');
                const odHours = end.diff(start, 'hours', true);

                if (odHours <= 0) {
                    message.error('End time must be after start time');
                    setLoading(false);
                    return;
                }

                leaveData = {
                    leave_type_id: values.leave_type_id,
                    from_date: values.single_date.format('YYYY-MM-DD'),
                    to_date: values.single_date.format('YYYY-MM-DD'),
                    is_half_day: false,
                    is_od: true,
                    od_start_time: startTime,
                    od_end_time: endTime,
                    od_hours: odHours,
                    reason: values.reason
                };
            } else if (leaveMode === 'half') {
                leaveData = {
                    leave_type_id: values.leave_type_id,
                    from_date: values.single_date.format('YYYY-MM-DD'),
                    to_date: values.single_date.format('YYYY-MM-DD'),
                    is_half_day: true,
                    reason: values.reason
                };
            } else if (leaveMode === 'full') {
                leaveData = {
                    leave_type_id: values.leave_type_id,
                    from_date: values.single_date.format('YYYY-MM-DD'),
                    to_date: values.single_date.format('YYYY-MM-DD'),
                    is_half_day: false,
                    reason: values.reason
                };
            } else {
                leaveData = {
                    leave_type_id: values.leave_type_id,
                    from_date: values.dates[0].format('YYYY-MM-DD'),
                    to_date: values.dates[1].format('YYYY-MM-DD'),
                    is_half_day: false,
                    reason: values.reason
                };
            }

            await applyLeave(leaveData);
            message.success(isOverDuty ? 'Over Duty application submitted successfully' : 'Leave application submitted successfully');
            form.resetFields();
            setLeaveMode('full');
            setIsOverDuty(false);
            setSelectedLeaveType(null);
            if (onSuccess) onSuccess();
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to apply leave');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
        >
            <Form.Item
                name="leave_type_id"
                label="Leave Type"
                rules={[{ required: true, message: 'Please select leave type' }]}
            >
                <Select 
                    placeholder="Select leave type"
                    onChange={handleLeaveTypeChange}
                >
                    {leaveTypes.map(type => (
                        <Select.Option key={type.id} value={type.id}>
                            {type.leave_name} ({type.leave_code})
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            {!isOverDuty && (
                <Form.Item
                    label="Leave Duration"
                    required
                >
                    <Radio.Group 
                        value={leaveMode} 
                        onChange={(e) => {
                            setLeaveMode(e.target.value);
                            form.resetFields(['single_date', 'dates']);
                        }}
                    >
                        <Radio value="full">Single Day (Full)</Radio>
                        <Radio value="half">Single Day (Half)</Radio>
                        <Radio value="range">Multiple Days</Radio>
                    </Radio.Group>
                </Form.Item>
            )}

            {isOverDuty && (
                <>
                    <Form.Item
                        name="single_date"
                        label="Over Duty Date"
                        rules={[
                            { required: true, message: 'Please select date' },
                            { validator: validateLeaveDate }
                        ]}
                    >
                        <DatePicker 
                            style={{ width: '100%' }}
                            disabledDate={disabledODDate}
                            format="DD-MM-YYYY"
                        />
                    </Form.Item>

                    <Form.Item
                        name="od_times"
                        label="Over Duty Time Range"
                        rules={[{ required: true, message: 'Please select OD time range' }]}
                    >
                        <TimePicker.RangePicker 
                            style={{ width: '100%' }}
                            format="HH:mm"
                        />
                    </Form.Item>
                </>
            )}

            {!isOverDuty && (leaveMode === 'full' || leaveMode === 'half') && (
                <Form.Item
                    name="single_date"
                    label="Select Date"
                    rules={[
                        { required: true, message: 'Please select date' },
                        { validator: validateLeaveDate }
                    ]}
                >
                    <DatePicker 
                        style={{ width: '100%' }}
                        disabledDate={disabledDate}
                        format="DD-MM-YYYY"
                    />
                </Form.Item>
            )}

            {!isOverDuty && leaveMode === 'range' && (
                <Form.Item
                    name="dates"
                    label="Leave Period"
                    rules={[
                        { required: true, message: 'Please select leave dates' },
                        { validator: validateDateRange }
                    ]}
                >
                    <RangePicker 
                        style={{ width: '100%' }}
                        disabledDate={disabledDate}
                        format="DD-MM-YYYY"
                    />
                </Form.Item>
            )}

            <Form.Item
                name="reason"
                label="Reason"
                rules={[
                    { required: true, message: 'Please enter reason' },
                    { min: 10, message: 'Reason must be at least 10 characters' }
                ]}
            >
                <TextArea 
                    rows={4} 
                    placeholder={isOverDuty ? "Enter reason for over duty" : "Enter reason for leave"}
                    showCount
                    maxLength={500}
                />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block size="large">
                    {isOverDuty ? 'Apply Over Duty' : 'Apply Leave'}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default LeaveApplicationForm;
