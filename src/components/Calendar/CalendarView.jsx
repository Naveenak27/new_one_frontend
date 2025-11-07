// // import React, { useState, useEffect } from 'react';
// // import { Calendar, momentLocalizer } from 'react-big-calendar';
// // import moment from 'moment';
// // import { Card, Badge, List, Spin, Row, Col, Tag, Modal } from 'antd';
// // import { getCalendarEvents, getHolidays } from '../../services/calendarService';
// // import 'react-big-calendar/lib/css/react-big-calendar.css';


// // const localizer = momentLocalizer(moment);

// // const CalendarView = () => {
// //     const [events, setEvents] = useState([]);
// //     const [holidays, setHolidays] = useState([]);
// //     const [loading, setLoading] = useState(false);
// //     const [selectedEvent, setSelectedEvent] = useState(null);
// //     const [modalVisible, setModalVisible] = useState(false);

// //     useEffect(() => {
// //         fetchData();
// //     }, []);

// //     const fetchData = async () => {
// //         setLoading(true);
// //         try {
// //             const currentMonth = moment().month() + 1;
// //             const currentYear = moment().year();

// //             // Fetch calendar events
// //             const eventsData = await getCalendarEvents(currentMonth, currentYear);
            
// //             // Fetch holidays
// //             const holidaysData = await getHolidays(currentYear);
            
// //             // Transform events for React Big Calendar
// //             const formattedEvents = [];

// //             // Add holidays
// //             if (holidaysData.data) {
// //                 holidaysData.data.forEach(holiday => {
// //                     formattedEvents.push({
// //                         id: `holiday-${holiday.id}`,
// //                         title: `🎉 ${holiday.holiday_name}`,
// //                         start: new Date(holiday.holiday_date),
// //                         end: new Date(holiday.holiday_date),
// //                         type: 'holiday',
// //                         description: holiday.description,
// //                         allDay: true
// //                     });
// //                 });
// //             }

// //             // Add leaves and other events
// //             if (eventsData.data) {
// //                 eventsData.data.forEach(event => {
// //                     if (event.type === 'leave') {
// //                         formattedEvents.push({
// //                             id: `leave-${event.id}`,
// //                             title: `📅 ${event.title}`,
// //                             start: new Date(event.date),
// //                             end: new Date(event.to_date || event.date),
// //                             type: 'leave',
// //                             description: event.employee_name,
// //                             allDay: true
// //                         });
// //                     } else if (event.type === 'birthday') {
// //                         formattedEvents.push({
// //                             id: `birthday-${event.id}`,
// //                             title: `🎂 ${event.title}`,
// //                             start: new Date(event.date),
// //                             end: new Date(event.date),
// //                             type: 'birthday',
// //                             description: event.employee_name,
// //                             allDay: true
// //                         });
// //                     }
// //                 });
// //             }

// //             setEvents(formattedEvents);
// //             setHolidays(holidaysData.data || []);
// //         } catch (error) {
// //             console.error('Error fetching calendar data:', error);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     const eventStyleGetter = (event) => {
// //         let backgroundColor = '#3174ad';
        
// //         if (event.type === 'holiday') {
// //             backgroundColor = '#f5222d';
// //         } else if (event.type === 'leave') {
// //             backgroundColor = '#52c41a';
// //         } else if (event.type === 'birthday') {
// //             backgroundColor = '#fa8c16';
// //         }

// //         return {
// //             style: {
// //                 backgroundColor,
// //                 borderRadius: '5px',
// //                 opacity: 0.8,
// //                 color: 'white',
// //                 border: '0px',
// //                 display: 'block'
// //             }
// //         };
// //     };

// //     const handleSelectEvent = (event) => {
// //         setSelectedEvent(event);
// //         setModalVisible(true);
// //     };

// //     const getUpcomingHolidays = () => {
// //         return holidays
// //             .filter(h => moment(h.holiday_date).isSameOrAfter(moment(), 'day'))
// //             .slice(0, 5);
// //     };

// //     return (
// //         <div>
// //             <Row gutter={16}>
// //                 <Col xs={24} lg={18}>
// //                     <Card
// //                         extra={
// //                             <div>
// //                                 <Badge status="error" text="Holidays" style={{ marginRight: 16 }} />
// //                                 <Badge status="success" text="Leaves" style={{ marginRight: 16 }} />
// //                                 <Badge status="warning" text="Birthdays" />
// //                             </div>
// //                         }
// //                     >
// //                         {loading ? (
// //                             <div style={{ textAlign: 'center', padding: 100 }}>
// //                                 <Spin size="large" />
// //                             </div>
// //                         ) : (
// //                             <Calendar
// //                                 localizer={localizer}
// //                                 events={events}
// //                                 startAccessor="start"
// //                                 endAccessor="end"
// //                                 style={{ height: 600 }}
// //                                 eventPropGetter={eventStyleGetter}
// //                                 onSelectEvent={handleSelectEvent}
// //                                 views={['month', 'week', 'day', 'agenda']}
// //                                 defaultView="month"
// //                                 popup
// //                             />
// //                         )}
// //                     </Card>
// //                 </Col>

// //                 <Col xs={24} lg={6}>
// //                     <Card title="Upcoming Holidays" style={{ marginBottom: 16 }}>
// //                         <List
// //                             size="small"
// //                             dataSource={getUpcomingHolidays()}
// //                             renderItem={(holiday) => (
// //                                 <List.Item>
// //                                     <List.Item.Meta
// //                                         avatar={<span style={{ fontSize: 20 }}>🎉</span>}
// //                                         title={holiday.holiday_name}
// //                                         description={
// //                                             <>
// //                                                 <div>{moment(holiday.holiday_date).format('DD MMM YYYY')}</div>
// //                                                 <Tag color="red">{moment(holiday.holiday_date).format('dddd')}</Tag>
// //                                             </>
// //                                         }
// //                                     />
// //                                 </List.Item>
// //                             )}
// //                             locale={{ emptyText: 'No upcoming holidays' }}
// //                         />
// //                     </Card>

// //                     <Card title="Legend">
// //                         <div style={{ marginBottom: 8 }}>
// //                             <Badge status="error" text="Public Holidays" />
// //                         </div>
// //                         <div style={{ marginBottom: 8 }}>
// //                             <Badge status="success" text="Approved Leaves" />
// //                         </div>
// //                         <div>
// //                             <Badge status="warning" text="Employee Birthdays" />
// //                         </div>
// //                     </Card>
// //                 </Col>
// //             </Row>

// //             {/* Event Details Modal */}
// //             <Modal
// //                 title={selectedEvent?.title}
// //                 open={modalVisible}
// //                 onCancel={() => setModalVisible(false)}
// //                 footer={null}
// //             >
// //                 {selectedEvent && (
// //                     <div>
// //                         <p><strong>Type:</strong> {selectedEvent.type}</p>
// //                         <p><strong>Date:</strong> {moment(selectedEvent.start).format('DD MMMM YYYY')}</p>
// //                         {selectedEvent.end && !moment(selectedEvent.start).isSame(selectedEvent.end, 'day') && (
// //                             <p><strong>End Date:</strong> {moment(selectedEvent.end).format('DD MMMM YYYY')}</p>
// //                         )}
// //                         {selectedEvent.description && (
// //                             <p><strong>Description:</strong> {selectedEvent.description}</p>
// //                         )}
// //                     </div>
// //                 )}
// //             </Modal>
// //         </div>
// //     );
// // };

// // export default CalendarView;
// import React, { useState, useEffect } from 'react';
// import { Calendar, momentLocalizer } from 'react-big-calendar';
// import moment from 'moment';
// import { Card, Badge, List, Spin, Row, Col, Tag, Modal } from 'antd';
// import { getCalendarEvents, getHolidays } from '../../services/calendarService';
// import 'react-big-calendar/lib/css/react-big-calendar.css';

// const localizer = momentLocalizer(moment);

// const CalendarView = () => {
//     const [events, setEvents] = useState([]);
//     const [holidays, setHolidays] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [selectedEvent, setSelectedEvent] = useState(null);
//     const [modalVisible, setModalVisible] = useState(false);
//     const [currentDate, setCurrentDate] = useState(new Date());

//     useEffect(() => {
//         fetchMonthData(currentDate);
//     }, []);

//     const fetchMonthData = async (date) => {
//         setLoading(true);
//         try {
//             const month = moment(date).month() + 1;
//             const year = moment(date).year();

//             console.log(`Fetching data for: ${month}/${year}`);

//             // Fetch calendar events for the specific month
//             const eventsData = await getCalendarEvents(month, year);
            
//             // Fetch holidays for the year
//             const holidaysData = await getHolidays(year);
            
//             // Transform events for React Big Calendar
//             const formattedEvents = [];

//             // Add holidays for entire year
//             if (holidaysData.data) {
//                 holidaysData.data.forEach(holiday => {
//                     formattedEvents.push({
//                         id: `holiday-${holiday.id}`,
//                         title: `🎉 ${holiday.holiday_name}`,
//                         start: new Date(holiday.holiday_date),
//                         end: new Date(holiday.holiday_date),
//                         type: 'holiday',
//                         description: holiday.description,
//                         allDay: true
//                     });
//                 });
//             }

//             // Add leaves and other events for the specific month
//             if (eventsData.data) {
//                 eventsData.data.forEach(event => {
//                     if (event.type === 'leave') {
//                         formattedEvents.push({
//                             id: `leave-${event.id}`,
//                             title: `📅 ${event.title}`,
//                             start: new Date(event.date),
//                             end: new Date(event.to_date || event.date),
//                             type: 'leave',
//                             description: event.employee_name,
//                             allDay: true
//                         });
//                     } else if (event.type === 'birthday') {
//                         formattedEvents.push({
//                             id: `birthday-${event.id}`,
//                             title: `🎂 ${event.title}`,
//                             start: new Date(event.date),
//                             end: new Date(event.date),
//                             type: 'birthday',
//                             description: event.employee_name,
//                             allDay: true
//                         });
//                     }
//                 });
//             }

//             setEvents(formattedEvents);
//             setHolidays(holidaysData.data || []);
//         } catch (error) {
//             console.error('Error fetching calendar data:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleNavigate = (date, view, action) => {
//         console.log('Navigation triggered:', action);
//         console.log('New date:', moment(date).format('MMMM YYYY'));
        
//         setCurrentDate(date);
        
//         // Fetch data for the new month
//         fetchMonthData(date);
//     };

//     const eventStyleGetter = (event) => {
//         let backgroundColor = '#3174ad';
        
//         if (event.type === 'holiday') {
//             backgroundColor = '#f5222d';
//         } else if (event.type === 'leave') {
//             backgroundColor = '#52c41a';
//         } else if (event.type === 'birthday') {
//             backgroundColor = '#fa8c16';
//         }

//         return {
//             style: {
//                 backgroundColor,
//                 borderRadius: '5px',
//                 opacity: 0.8,
//                 color: 'white',
//                 border: '0px',
//                 display: 'block'
//             }
//         };
//     };

//     const handleSelectEvent = (event) => {
//         setSelectedEvent(event);
//         setModalVisible(true);
//     };

//     const getUpcomingHolidays = () => {
//         return holidays
//             .filter(h => moment(h.holiday_date).isSameOrAfter(moment(), 'day'))
//             .slice(0, 5);
//     };

//     return (
//         <div>
//             <Row gutter={16}>
//                 <Col xs={24} lg={18}>
//                     <Card
//                         extra={
//                             <div>
//                                 <Badge status="error" text="Holidays" style={{ marginRight: 16 }} />
//                                 <Badge status="success" text="Leaves" style={{ marginRight: 16 }} />
//                                 <Badge status="warning" text="Birthdays" />
//                             </div>
//                         }
//                     >
//                         {loading ? (
//                             <div style={{ textAlign: 'center', padding: 100 }}>
//                                 <Spin size="large" />
//                             </div>
//                         ) : (
//                             <Calendar
//                                 localizer={localizer}
//                                 events={events}
//                                 startAccessor="start"
//                                 endAccessor="end"
//                                 style={{ height: 600 }}
//                                 eventPropGetter={eventStyleGetter}
//                                 onSelectEvent={handleSelectEvent}
//                                 onNavigate={handleNavigate}
//                                 date={currentDate}
//                                 views={['month', 'week', 'day', 'agenda']}
//                                 defaultView="month"
//                                 popup
//                             />
//                         )}
//                     </Card>
//                 </Col>

//                 <Col xs={24} lg={6}>
//                     <Card title="Upcoming Holidays" style={{ marginBottom: 16 }}>
//                         <List
//                             size="small"
//                             dataSource={getUpcomingHolidays()}
//                             renderItem={(holiday) => (
//                                 <List.Item>
//                                     <List.Item.Meta
//                                         avatar={<span style={{ fontSize: 20 }}>🎉</span>}
//                                         title={holiday.holiday_name}
//                                         description={
//                                             <>
//                                                 <div>{moment(holiday.holiday_date).format('DD MMM YYYY')}</div>
//                                                 <Tag color="red">{moment(holiday.holiday_date).format('dddd')}</Tag>
//                                             </>
//                                         }
//                                     />
//                                 </List.Item>
//                             )}
//                             locale={{ emptyText: 'No upcoming holidays' }}
//                         />
//                     </Card>

//                     <Card title="Legend">
//                         <div style={{ marginBottom: 8 }}>
//                             <Badge status="error" text="Public Holidays" />
//                         </div>
//                         <div style={{ marginBottom: 8 }}>
//                             <Badge status="success" text="Approved Leaves" />
//                         </div>
//                         <div>
//                             <Badge status="warning" text="Employee Birthdays" />
//                         </div>
//                     </Card>
//                 </Col>
//             </Row>

//             {/* Event Details Modal */}
//             <Modal
//                 title={selectedEvent?.title}
//                 open={modalVisible}
//                 onCancel={() => setModalVisible(false)}
//                 footer={null}
//             >
//                 {selectedEvent && (
//                     <div>
//                         <p><strong>Type:</strong> {selectedEvent.type}</p>
//                         <p><strong>Date:</strong> {moment(selectedEvent.start).format('DD MMMM YYYY')}</p>
//                         {selectedEvent.end && !moment(selectedEvent.start).isSame(selectedEvent.end, 'day') && (
//                             <p><strong>End Date:</strong> {moment(selectedEvent.end).format('DD MMMM YYYY')}</p>
//                         )}
//                         {selectedEvent.description && (
//                             <p><strong>Description:</strong> {selectedEvent.description}</p>
//                         )}
//                     </div>
//                 )}
//             </Modal>
//         </div>
//     );
// };

// export default CalendarView;



// import React, { useState, useEffect } from 'react';
// import { Calendar, momentLocalizer } from 'react-big-calendar';
// import moment from 'moment';
// import { Card, Badge, List, Spin, Row, Col, Tag, Modal, Divider, Statistic } from 'antd';
// import { ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons';
// import { getCalendarEvents, getHolidays } from '../../services/calendarService';
// import { getMyAttendance } from '../../services/attendanceService';
// import 'react-big-calendar/lib/css/react-big-calendar.css';

// const localizer = momentLocalizer(moment);
// const IST_TIMEZONE = 'Asia/Kolkata';

// const CalendarView = () => {
//     const [events, setEvents] = useState([]);
//     const [holidays, setHolidays] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [selectedEvent, setSelectedEvent] = useState(null);
//     const [modalVisible, setModalVisible] = useState(false);
//     const [currentDate, setCurrentDate] = useState(new Date());
//     const [userRole, setUserRole] = useState('');
//     const [insights, setInsights] = useState(null);
//     const [monthlyTotal, setMonthlyTotal] = useState('0:00');

//     useEffect(() => {
//         moment.tz.setDefault(IST_TIMEZONE);
//         fetchMonthData(currentDate);
//     }, []);

//     // Helper function to convert decimal hours to HH:MM format
//     const convertDecimalToTime = (decimalHours) => {
//         if (!decimalHours || isNaN(decimalHours)) return '0:00';
        
//         const hours = Math.floor(decimalHours);
//         const minutes = Math.round((decimalHours - hours) * 60);
        
//         return `${hours}:${minutes.toString().padStart(2, '0')}`;
//     };

//     // Calculate monthly attendance total
//     const calculateMonthlyTotal = async (date) => {
//         try {
//             const startOfMonth = moment(date).startOf('month').format('YYYY-MM-DD');
//             const endOfMonth = moment(date).endOf('month').format('YYYY-MM-DD');
            
//             const attendanceData = await getMyAttendance(startOfMonth, endOfMonth);
            
//             if (attendanceData && attendanceData.data) {
//                 let total = 0;
//                 attendanceData.data.forEach(record => {
//                     total += parseFloat(record.total_hours) || 0;
//                 });
//                 setMonthlyTotal(convertDecimalToTime(total));
//             }
//         } catch (error) {
//             console.error('Error fetching monthly attendance:', error);
//             setMonthlyTotal('0:00');
//         }
//     };

//     const fetchMonthData = async (date) => {
//         setLoading(true);
//         try {
//             const month = moment(date).month() + 1;
//             const year = moment(date).year();

//             console.log(`Fetching data for: ${month}/${year}`);

//             // Fetch calendar events
//             const eventsData = await getCalendarEvents(month, year);
            
//             // Fetch holidays
//             const holidaysData = await getHolidays(year);
            
//             // Fetch monthly attendance total
//             await calculateMonthlyTotal(date);
            
//             if (eventsData.role) {
//                 setUserRole(eventsData.role);
//             }

//             if (eventsData.insights) {
//                 setInsights(eventsData.insights);
//             }

//             // Transform events for React Big Calendar
//             const formattedEvents = [];

//             if (holidaysData.data) {
//                 holidaysData.data.forEach(holiday => {
//                     formattedEvents.push({
//                         id: `holiday-${holiday.id}`,
//                         title: `🎉 ${holiday.holiday_name}`,
//                         start: new Date(holiday.holiday_date),
//                         end: new Date(holiday.holiday_date),
//                         type: 'holiday',
//                         description: holiday.description,
//                         allDay: true
//                     });
//                 });
//             }

//             if (eventsData.data) {
//                 eventsData.data.forEach(event => {
//                     if (event.type === 'leave') {
//                         formattedEvents.push({
//                             id: `leave-${event.id}`,
//                             title: `📅 ${event.title}`,
//                             start: new Date(event.date),
//                             end: new Date(event.to_date || event.date),
//                             type: 'leave',
//                             description: event.employee_name,
//                             employeeId: event.employee_id,
//                             allDay: true
//                         });
//                     } else if (event.type === 'birthday') {
//                         formattedEvents.push({
//                             id: `birthday-${event.id}`,
//                             title: `🎂 ${event.title}`,
//                             start: new Date(event.date),
//                             end: new Date(event.date),
//                             type: 'birthday',
//                             description: event.employee_name,
//                             employeeId: event.employee_id,
//                             allDay: true
//                         });
//                     }
//                 });
//             }

//             setEvents(formattedEvents);
//             setHolidays(holidaysData.data || []);
//         } catch (error) {
//             console.error('Error fetching calendar data:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleNavigate = (date, view, action) => {
//         console.log('Navigation triggered:', action);
//         console.log('New date:', moment(date).format('MMMM YYYY'));
        
//         setCurrentDate(date);
//         fetchMonthData(date);
//     };

//     const eventStyleGetter = (event) => {
//         let backgroundColor = '#3174ad';
        
//         if (event.type === 'holiday') {
//             backgroundColor = '#f5222d';
//         } else if (event.type === 'leave') {
//             backgroundColor = '#52c41a';
//         } else if (event.type === 'birthday') {
//             backgroundColor = '#fa8c16';
//         }

//         return {
//             style: {
//                 backgroundColor,
//                 borderRadius: '5px',
//                 opacity: 0.8,
//                 color: 'white',
//                 border: '0px',
//                 display: 'block'
//             }
//         };
//     };

//     const handleSelectEvent = (event) => {
//         setSelectedEvent(event);
//         setModalVisible(true);
//     };

//     const getUpcomingHolidays = () => {
//         return holidays
//             .filter(h => moment(h.holiday_date).isSameOrAfter(moment(), 'day'))
//             .slice(0, 5);
//     };

//     const getViewTitle = () => {
//         if (userRole === 'HR' || userRole === 'SUPER ADMIN' || userRole === 'MANAGER') {
//             return 'All Employees Calendar';
//         } else if (userRole === 'TL') {
//             return 'Team Calendar';
//         }
//         return 'My Calendar';
//     };

//     const getBadgeText = () => {
//         if (userRole === 'HR' || userRole === 'SUPER ADMIN' || userRole === 'MANAGER') {
//             return 'All Leaves';
//         } else if (userRole === 'TL') {
//             return 'Team Leaves';
//         }
//         return 'My Leaves';
//     };

//     return (
//         <div>
//             <Row gutter={16}>
//                 <Col xs={24} lg={18}>
//                     <Card
//                         title={getViewTitle()}
//                         extra={
//                             <div>
//                                 <Badge status="error" text="Holidays" style={{ marginRight: 16 }} />
//                                 <Badge status="success" text={getBadgeText()} style={{ marginRight: 16 }} />
//                                 <Badge status="warning" text="Birthdays" />
//                             </div>
//                         }
//                     >
//                         {loading ? (
//                             <div style={{ textAlign: 'center', padding: 100 }}>
//                                 <Spin size="large" />
//                             </div>
//                         ) : (
//                             <Calendar
//                                 localizer={localizer}
//                                 events={events}
//                                 startAccessor="start"
//                                 endAccessor="end"
//                                 style={{ height: 600 }}
//                                 eventPropGetter={eventStyleGetter}
//                                 onSelectEvent={handleSelectEvent}
//                                 onNavigate={handleNavigate}
//                                 date={currentDate}
//                                 views={['month', 'week', 'day', 'agenda']}
//                                 defaultView="month"
//                                 popup
//                             />
//                         )}
//                     </Card>
//                 </Col>

//                 <Col xs={24} lg={6}>
//                     <Card title="Upcoming Holidays" style={{ marginBottom: 16 }}>
//                         <List
//                             size="small"
//                             dataSource={getUpcomingHolidays()}
//                             renderItem={(holiday) => (
//                                 <List.Item>
//                                     <List.Item.Meta
//                                         avatar={<span style={{ fontSize: 20 }}>🎉</span>}
//                                         title={holiday.holiday_name}
//                                         description={
//                                             <>
//                                                 <div>{moment(holiday.holiday_date).format('DD MMM YYYY')}</div>
//                                                 <Tag color="red">{moment(holiday.holiday_date).format('dddd')}</Tag>
//                                             </>
//                                         }
//                                     />
//                                 </List.Item>
//                             )}
//                             locale={{ emptyText: 'No upcoming holidays' }}
//                         />
//                     </Card>

//                     {/* Monthly Insights */}
//                     {insights && (
//                         <Card 
//                             title="Monthly Insights" 
//                             style={{ marginBottom: 16 }}
//                         >
//                             <Statistic
//                                 title="Working Days"
//                                 value={insights.working_days}
//                                 prefix={<CalendarOutlined />}
//                                 suffix="days"
//                                 valueStyle={{ fontSize: '18px' }}
//                             />
//                             <Divider style={{ margin: '12px 0' }} />
                            
//                             <Statistic
//                                 title="Holidays"
//                                 value={insights.holiday_count}
//                                 prefix={<CalendarOutlined />}
//                                 suffix="days"
//                                 valueStyle={{ fontSize: '18px', color: '#f5222d' }}
//                             />
//                             <Divider style={{ margin: '12px 0' }} />
                            
//                             <Statistic
//                                 title="This Month's Total"
//                                 value={monthlyTotal}
//                                 prefix={<ClockCircleOutlined />}
//                                 suffix="hrs"
//                                 valueStyle={{ fontSize: '20px', color: '#722ed1', fontWeight: 'bold' }}
//                             />
//                             <Divider style={{ margin: '12px 0' }} />
                            
//                             <Statistic
//                                 title="Expected Hours"
//                                 value={insights.total_expected_hours}
//                                 prefix={<ClockCircleOutlined />}
//                                 suffix="hrs"
//                                 valueStyle={{ fontSize: '18px' }}
//                             />
//                             <Divider style={{ margin: '12px 0' }} />
                            
//                             <Statistic
//                                 title="Holiday Hours"
//                                 value={insights.holiday_hours}
//                                 prefix={<ClockCircleOutlined />}
//                                 suffix="hrs"
//                                 valueStyle={{ fontSize: '18px', color: '#f5222d' }}
//                             />
//                             <Divider style={{ margin: '12px 0' }} />
                            
//                             <Statistic
//                                 title="Net Working Hours"
//                                 value={insights.net_working_hours}
//                                 prefix={<ClockCircleOutlined />}
//                                 suffix="hrs"
//                                 valueStyle={{ fontSize: '20px', color: '#52c41a', fontWeight: 'bold' }}
//                             />

//                             {insights.employees && insights.employees.length > 0 && (
//                                 <>
//                                     <Divider orientation="left" style={{ fontSize: '12px' }}>
//                                         Your Details
//                                     </Divider>
//                                     {insights.employees.map(emp => (
//                                         <div key={emp.employee_id}>
//                                             <p style={{ marginBottom: 8 }}>
//                                                 <strong>Leave Days:</strong>{' '}
//                                                 <Tag color="orange">{emp.total_leave_days} days</Tag>
//                                             </p>
//                                             <p style={{ marginBottom: 8 }}>
//                                                 <strong>Your Working Hours:</strong>{' '}
//                                                 <span style={{ 
//                                                     fontSize: '16px', 
//                                                     color: '#1890ff', 
//                                                     fontWeight: 'bold' 
//                                                 }}>
//                                                     {emp.actual_working_hours} hrs
//                                                 </span>
//                                             </p>
//                                             <p style={{ fontSize: '12px', color: '#999' }}>
//                                                 Formula: {insights.total_expected_hours} - {insights.holiday_hours} - ({emp.total_leave_days} × 8)
//                                             </p>
//                                         </div>
//                                     ))}
//                                 </>
//                             )}
//                         </Card>
//                     )}

//                     <Card title="Legend">
//                         <div style={{ marginBottom: 8 }}>
//                             <Badge status="error" text="Public Holidays" />
//                         </div>
//                         <div style={{ marginBottom: 8 }}>
//                             <Badge status="success" text={getBadgeText()} />
//                         </div>
//                         <div>
//                             <Badge status="warning" text="Employee Birthdays" />
//                         </div>
//                     </Card>
//                 </Col>
//             </Row>

//             {/* Event Details Modal */}
//             <Modal
//                 title={selectedEvent?.title}
//                 open={modalVisible}
//                 onCancel={() => setModalVisible(false)}
//                 footer={null}
//             >
//                 {selectedEvent && (
//                     <div>
//                         <p><strong>Type:</strong> {selectedEvent.type}</p>
//                         <p><strong>Date:</strong> {moment(selectedEvent.start).format('DD MMMM YYYY')}</p>
//                         {selectedEvent.end && !moment(selectedEvent.start).isSame(selectedEvent.end, 'day') && (
//                             <p><strong>End Date:</strong> {moment(selectedEvent.end).format('DD MMMM YYYY')}</p>
//                         )}
//                         {selectedEvent.description && (
//                             <p><strong>Employee:</strong> {selectedEvent.description}</p>
//                         )}
//                     </div>
//                 )}
//             </Modal>
//         </div>
//     );
// };

// export default CalendarView;




// import React, { useState, useEffect } from 'react';
// import { Calendar, momentLocalizer, Navigate } from 'react-big-calendar';
// import moment from 'moment';
// import { Card, Badge, List, Spin, Row, Col, Tag, Modal, Divider, Statistic, Table, Space, Typography, Tabs } from 'antd';
// import { ClockCircleOutlined, CalendarOutlined, LeftOutlined, RightOutlined, WarningOutlined } from '@ant-design/icons';
// import { getCalendarEvents, getHolidays } from '../../services/calendarService';
// import { gettotalhoursforcalendar, getAllAttendance } from '../../services/attendanceService';
// import 'react-big-calendar/lib/css/react-big-calendar.css';

// const localizer = momentLocalizer(moment);
// const IST_TIMEZONE = 'Asia/Kolkata';
// const { Text } = Typography;
// const { TabPane } = Tabs;

// // Custom Toolbar Component with Arrow Navigation
// const CustomToolbar = (toolbar) => {
//     const goToBack = () => {
//         toolbar.onNavigate(Navigate.PREVIOUS);
//     };

//     const goToNext = () => {
//         toolbar.onNavigate(Navigate.NEXT);
//     };

//     const goToToday = () => {
//         toolbar.onNavigate(Navigate.TODAY);
//     };

//     return (
//         <div className="rbc-toolbar">
//             <span className="rbc-btn-group">
//                 <button type="button" onClick={goToBack}>
//                     <LeftOutlined />
//                 </button>
//                 <button type="button" onClick={goToToday}>
//                     Today
//                 </button>
//                 <button type="button" onClick={goToNext}>
//                     <RightOutlined />
//                 </button>
//             </span>
//             <span className="rbc-toolbar-label">{toolbar.label}</span>
//             <span className="rbc-btn-group">
//                 {toolbar.views.map((view) => (
//                     <button
//                         key={view}
//                         type="button"
//                         className={toolbar.view === view ? 'rbc-active' : ''}
//                         onClick={() => toolbar.onView(view)}
//                     >
//                         {view}
//                     </button>
//                 ))}
//             </span>
//         </div>
//     );
// };

// const CalendarView = () => {
//     const [events, setEvents] = useState([]);
//     const [holidays, setHolidays] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [selectedEvent, setSelectedEvent] = useState(null);
//     const [modalVisible, setModalVisible] = useState(false);
//     const [currentDate, setCurrentDate] = useState(new Date());
//     const [calculatedWorkingDays, setCalculatedWorkingDays] = useState(0);
//     const [userRole, setUserRole] = useState('');
//     const [insights, setInsights] = useState(null);
//     const [monthlyTotal, setMonthlyTotal] = useState('0:00');
//     const [shortHourWorkers, setShortHourWorkers] = useState([]);
//     const [checkDate, setCheckDate] = useState(null);
    
//     // New state for shortage data
//     const [weeklyData, setWeeklyData] = useState([]);
//     const [monthlyData, setMonthlyData] = useState([]);
//     const [shortageLoading, setShortageLoading] = useState(false);
//     const [weekRange, setWeekRange] = useState({ start: null, end: null });
//     const [monthRange, setMonthRange] = useState({ start: null, end: null });

//     useEffect(() => {
//         moment.tz.setDefault(IST_TIMEZONE);
//         fetchMonthData(currentDate);
//     }, []);

//     // Helper function to convert decimal hours to HH:MM format
//     const convertDecimalToTime = (decimalHours) => {
//         if (!decimalHours || isNaN(decimalHours)) return '0:00';
        
//         const hours = Math.floor(Math.abs(decimalHours));
//         const minutes = Math.round((Math.abs(decimalHours) - hours) * 60);
        
//         return `${hours}:${minutes.toString().padStart(2, '0')}`;
//     };

//     // Calculate the check date (most recent working day excluding weekends)
//     const getCheckDate = () => {
//         const yesterday = moment.tz(IST_TIMEZONE).subtract(1, 'day');
//         const dayOfWeek = yesterday.day();

//         if (dayOfWeek === 0) { // Sunday
//             return yesterday.subtract(2, 'days');
//         } else if (dayOfWeek === 6) { // Saturday
//             return yesterday.subtract(1, 'day');
//         } else {
//             return yesterday;
//         }
//     };

//     // Calculate weekly data - SIMPLE: Employee + Total Hours
//     const calculateWeeklyData = (attendanceData, startOfWeek, endOfWeek) => {
//         const employeeMap = {};

//         attendanceData.forEach(record => {
//             const recordDate = moment(record.date);
            
//             if (recordDate.isBetween(startOfWeek, endOfWeek, 'day', '[]')) {
//                 const empCode = record.employee_code;
                
//                 if (!employeeMap[empCode]) {
//                     employeeMap[empCode] = {
//                         employee_code: empCode,
//                         employee_name: record.employee_name || empCode,
//                         total_hours: 0
//                     };
//                 }
                
//                 employeeMap[empCode].total_hours += parseFloat(record.total_hours) || 0;
//             }
//         });

//         // Return all employees sorted by total hours (lowest first to match your screenshot)
//         const employeeList = Object.values(employeeMap)
//             .sort((a, b) => a.total_hours - b.total_hours);

//         return employeeList;
//     };

//     // Calculate monthly data - SIMPLE: Employee + Total Hours
//     const calculateMonthlyData = (attendanceData, startOfMonth, endOfMonth) => {
//         const employeeMap = {};

//         attendanceData.forEach(record => {
//             const recordDate = moment(record.date);
            
//             if (recordDate.isBetween(startOfMonth, endOfMonth, 'day', '[]')) {
//                 const empCode = record.employee_code;
                
//                 if (!employeeMap[empCode]) {
//                     employeeMap[empCode] = {
//                         employee_code: empCode,
//                         employee_name: record.employee_name || empCode,
//                         total_hours: 0
//                     };
//                 }
                
//                 employeeMap[empCode].total_hours += parseFloat(record.total_hours) || 0;
//             }
//         });

//         // Return all employees sorted by total hours (lowest first)
//         const employeeList = Object.values(employeeMap)
//             .sort((a, b) => a.total_hours - b.total_hours);

//         return employeeList;
//     };

//     // Fetch PREVIOUS week data
//     const fetchWeeklyData = async () => {
//         try {
//             setShortageLoading(true);
            
//             const startOfLastWeek = moment().subtract(1, 'week').startOf('isoWeek');
//             const endOfLastWeek = moment().subtract(1, 'week').endOf('isoWeek');
            
//             setWeekRange({
//                 start: startOfLastWeek.format('DD MMM YYYY'),
//                 end: endOfLastWeek.format('DD MMM YYYY')
//             });
            
//             const response = await gettotalhoursforcalendar(
//                 startOfLastWeek.format('YYYY-MM-DD'),
//                 endOfLastWeek.format('YYYY-MM-DD')
//             );
            
//             if (response && response.data) {
//                 const weekData = calculateWeeklyData(response.data, startOfLastWeek, endOfLastWeek);
//                 setWeeklyData(weekData);
//             }
//         } catch (error) {
//             console.error('Error fetching weekly data:', error);
//             setWeeklyData([]);
//         } finally {
//             setShortageLoading(false);
//         }
//     };

//     // Fetch PREVIOUS month data
//     const fetchMonthlyData = async () => {
//         try {
//             setShortageLoading(true);
            
//             const startOfLastMonth = moment().subtract(1, 'month').startOf('month');
//             const endOfLastMonth = moment().subtract(1, 'month').endOf('month');
            
//             setMonthRange({
//                 start: startOfLastMonth.format('MMMM YYYY'),
//                 end: endOfLastMonth.format('MMMM YYYY')
//             });
            
//             const response = await gettotalhoursforcalendar(
//                 startOfLastMonth.format('YYYY-MM-DD'),
//                 endOfLastMonth.format('YYYY-MM-DD')
//             );
            
//             if (response && response.data) {
//                 const monthData = calculateMonthlyData(response.data, startOfLastMonth, endOfLastMonth);
//                 setMonthlyData(monthData);
//             }
//         } catch (error) {
//             console.error('Error fetching monthly data:', error);
//             setMonthlyData([]);
//         } finally {
//             setShortageLoading(false);
//         }
//     };

//     // Fetch short hour workers for HR/Admin roles
//     const fetchShortHourWorkers = async () => {
//         try {
//             const checkDateMoment = getCheckDate();
//             const dateStr = checkDateMoment.format('YYYY-MM-DD');
//             setCheckDate(checkDateMoment);

//             const attendanceData = await getAllAttendance(dateStr, dateStr);
            
//             const shortWorkers = attendanceData.data
//                 .filter(record => parseFloat(record.total_hours) < 8 && parseFloat(record.total_hours) > 0)
//                 .sort((a, b) => parseFloat(a.total_hours) - parseFloat(b.total_hours));

//             setShortHourWorkers(shortWorkers);
//         } catch (error) {
//             console.error('Error fetching short hour workers:', error);
//             setShortHourWorkers([]);
//         }
//     };

//     // Calculate monthly attendance total
//     const calculateMonthlyTotal = async (date) => {
//         try {
//             const startOfMonth = moment(date).startOf('month').format('YYYY-MM-DD');
//             const endOfMonth = moment(date).endOf('month').format('YYYY-MM-DD');
            
//             const attendanceData = await gettotalhoursforcalendar(startOfMonth, endOfMonth);
            
//             if (attendanceData && attendanceData.data) {
//                 let totalHours = 0;
//                 attendanceData.data.forEach(record => {
//                     totalHours += parseFloat(record.total_hours) || 0;
//                 });
                
//                 setMonthlyTotal(convertDecimalToTime(totalHours));
//             }
//         } catch (error) {
//             console.error('Error fetching monthly attendance:', error);
//             setMonthlyTotal('0:00');
//         }
//     };

//     const fetchMonthData = async (date) => {
//         setLoading(true);
//         try {
//             const month = moment(date).month() + 1;
//             const year = moment(date).year();

//             const eventsData = await getCalendarEvents(month, year);
//             const holidaysData = await getHolidays(year);
//             await calculateMonthlyTotal(date);
            
//             if (eventsData.role) {
//                 setUserRole(eventsData.role);
                
//                 if (eventsData.role === 'HR' || eventsData.role === 'SUPER ADMIN' || eventsData.role === 'MANAGER') {
//                     await fetchShortHourWorkers();
//                     await fetchWeeklyData();
//                     await fetchMonthlyData();
//                 }
//             }

//             if (eventsData.insights) {
//                 setInsights(eventsData.insights);
//                 const workDays = Math.floor(eventsData.insights.net_working_hours / 8);
//                 setCalculatedWorkingDays(workDays);
//             }

//             const formattedEvents = [];

//             if (holidaysData.data) {
//                 holidaysData.data.forEach(holiday => {
//                     formattedEvents.push({
//                         id: `holiday-${holiday.id}`,
//                         title: `🎉 ${holiday.holiday_name}`,
//                         start: new Date(holiday.holiday_date),
//                         end: new Date(holiday.holiday_date),
//                         type: 'holiday',
//                         description: holiday.description,
//                         allDay: true
//                     });
//                 });
//             }

//             if (eventsData.data) {
//                 eventsData.data.forEach(event => {
//                     if (event.type === 'leave') {
//                         formattedEvents.push({
//                             id: `leave-${event.id}`,
//                             title: `📅 ${event.title}`,
//                             start: new Date(event.date),
//                             end: new Date(event.to_date || event.date),
//                             type: 'leave',
//                             description: event.employee_name,
//                             employeeId: event.employee_id,
//                             allDay: true
//                         });
//                     } else if (event.type === 'birthday') {
//                         formattedEvents.push({
//                             id: `birthday-${event.id}`,
//                             title: `🎂 ${event.title}`,
//                             start: new Date(event.date),
//                             end: new Date(event.date),
//                             type: 'birthday',
//                             description: event.employee_name,
//                             employeeId: event.employee_id,
//                             allDay: true
//                         });
//                     }
//                 });
//             }

//             setEvents(formattedEvents);
//             setHolidays(holidaysData.data || []);
//         } catch (error) {
//             console.error('Error fetching calendar data:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleNavigate = (date, view, action) => {
//         setCurrentDate(date);
//         fetchMonthData(date);
//     };

//     const eventStyleGetter = (event) => {
//         let backgroundColor = '#3174ad';
        
//         if (event.type === 'holiday') {
//             backgroundColor = '#f5222d';
//         } else if (event.type === 'leave') {
//             backgroundColor = '#52c41a';
//         } else if (event.type === 'birthday') {
//             backgroundColor = '#fa8c16';
//         }

//         return {
//             style: {
//                 backgroundColor,
//                 borderRadius: '5px',
//                 opacity: 0.8,
//                 color: 'white',
//                 border: '0px',
//                 display: 'block'
//             }
//         };
//     };

//     const handleSelectEvent = (event) => {
//         setSelectedEvent(event);
//         setModalVisible(true);
//     };

//     const getUpcomingHolidays = () => {
//         return holidays
//             .filter(h => moment(h.holiday_date).isSameOrAfter(moment(), 'day'))
//             .slice(0, 5);
//     };

//     const getViewTitle = () => {
//         if (userRole === 'HR' || userRole === 'SUPER ADMIN' || userRole === 'MANAGER') {
//             return 'All Employees Calendar';
//         } else if (userRole === 'TL') {
//             return 'Team Calendar';
//         }
//         return 'My Calendar';
//     };

//     const getBadgeText = () => {
//         if (userRole === 'HR' || userRole === 'SUPER ADMIN' || userRole === 'MANAGER') {
//             return 'All Leaves';
//         } else if (userRole === 'TL') {
//             return 'Team Leaves';
//         }
//         return 'My Leaves';
//     };

//     // Simple columns: Employee Code + Hours only
//     const simpleColumns = [
//         {
//             title: 'Employee',
//             dataIndex: 'employee_code',
//             key: 'employee_code',
//             render: (code) => (
//                 <span style={{ fontWeight: 500, fontSize: 14 }}>{code}</span>
//             )
//         },
//         {
//             title: 'Hours',
//             dataIndex: 'total_hours',
//             key: 'total_hours',
//             align: 'right',
//             render: (hours) => {
//                 const timeStr = convertDecimalToTime(hours);
//                 // Color based on hours worked
//                 let color = '#ff4d4f'; // red for < 8 hours per day average
                
//                 return (
//                     <span style={{ 
//                         color: color, 
//                         fontSize: 14,
//                         fontWeight: 500 
//                     }}>
//                         {timeStr}
//                     </span>
//                 );
//             }
//         }
//     ];

//     // Daily short hours columns
//     const shortHourColumns = [
//         {
//             title: 'Employee',
//             dataIndex: 'employee_code',
//             key: 'employee_code',
//             render: (code) => (
//                 <span style={{ fontWeight: 500, fontSize: 14 }}>{code}</span>
//             )
//         },
//         {
//             title: 'Hours',
//             dataIndex: 'total_hours',
//             key: 'total_hours',
//             align: 'right',
//             render: (hours) => {
//                 const timeStr = convertDecimalToTime(hours);
//                 return (
//                     <span style={{ 
//                         color: '#ff4d4f', 
//                         fontSize: 14,
//                         fontWeight: 500 
//                     }}>
//                         {timeStr}
//                     </span>
//                 );
//             }
//         }
//     ];

//     const isHRorAdmin = userRole === 'HR' || userRole === 'SUPER ADMIN' || userRole === 'MANAGER';

//     return (
//         <div>
//             <Row gutter={16}>
//                 <Col xs={24} lg={18}>
//                     <Card
//                         title={getViewTitle()}
//                         extra={
//                             <div>
//                                 <Badge status="error" text="Holidays" style={{ marginRight: 16 }} />
//                                 <Badge status="success" text={getBadgeText()} style={{ marginRight: 16 }} />
//                                 <Badge status="warning" text="Birthdays" />
//                             </div>
//                         }
//                     >
//                         {loading ? (
//                             <div style={{ textAlign: 'center', padding: 100 }}>
//                                 <Spin size="large" />
//                             </div>
//                         ) : (
//                             <Calendar
//                                 localizer={localizer}
//                                 events={events}
//                                 startAccessor="start"
//                                 endAccessor="end"
//                                 style={{ height: 600 }}
//                                 eventPropGetter={eventStyleGetter}
//                                 onSelectEvent={handleSelectEvent}
//                                 onNavigate={handleNavigate}
//                                 date={currentDate}
//                                 views={['month', 'week', 'day', 'agenda']}
//                                 defaultView="month"
//                                 popup
//                                 components={{
//                                     toolbar: CustomToolbar
//                                 }}
//                             />
//                         )}
//                     </Card>
//                 </Col>

//                 <Col xs={24} lg={6}>
//                     <Card title="Upcoming Holidays" style={{ marginBottom: 16 }}>
//                         <List
//                             size="small"
//                             dataSource={getUpcomingHolidays()}
//                             renderItem={(holiday) => (
//                                 <List.Item>
//                                     <List.Item.Meta
//                                         avatar={<span style={{ fontSize: 20 }}>🎉</span>}
//                                         title={holiday.holiday_name}
//                                         description={
//                                             <>
//                                                 <div>{moment(holiday.holiday_date).format('DD MMM YYYY')}</div>
//                                                 <Tag color="red">{moment(holiday.holiday_date).format('dddd')}</Tag>
//                                             </>
//                                         }
//                                     />
//                                 </List.Item>
//                             )}
//                             locale={{ emptyText: 'No upcoming holidays' }}
//                         />
//                     </Card>

//                     {insights && (
//                         <Card 
//                             title="Monthly Insights" 
//                             style={{ marginBottom: 16 }}
//                         >
//                             <Statistic
//                                 title="Working Days"
//                                 value={calculatedWorkingDays}
//                                 prefix={<CalendarOutlined />}
//                                 suffix="days"
//                                 valueStyle={{ fontSize: '18px' }}
//                             />
//                             <Divider style={{ margin: '12px 0' }} />
                            
//                             <Statistic
//                                 title="Total Working Hours"
//                                 value={insights.net_working_hours}
//                                 prefix={<ClockCircleOutlined />}
//                                 suffix="hrs"
//                                 valueStyle={{ fontSize: '18px', color: '#52c41a' }}
//                             />
//                             <Divider style={{ margin: '12px 0' }} />
                            
//                             <Statistic
//                                 title="This Month's Total"
//                                 value={monthlyTotal}
//                                 prefix={<ClockCircleOutlined />}
//                                 suffix="hrs"
//                                 valueStyle={{ fontSize: '20px', color: '#722ed1', fontWeight: 'bold' }}
//                             />
//                         </Card>
//                     )}

//                     {isHRorAdmin && (
//                         <Card 
//                             title={
//                                 <Space>
//                                     <CalendarOutlined style={{ color: '#1890ff' }} />
//                                     <span>Employee Attendance</span>
//                                 </Space>
//                             }
//                             style={{ marginBottom: 16 }}
//                             bodyStyle={{ padding: 0 }}
//                         >
//                             <Tabs 
//                                 defaultActiveKey="1" 
//                                 size="small"
//                                 style={{ padding: '0 16px' }}
//                                 tabBarStyle={{ marginBottom: 0 }}
//                             >
//                                 <TabPane 
//                                     tab="Daily" 
//                                     key="1"
//                                 >
//                                     <div style={{ padding: '12px 0' }}>
//                                         {checkDate && (
//                                             <div style={{ 
//                                                 background: '#f5f5f5', 
//                                                 padding: '8px 12px', 
//                                                 marginBottom: 12,
//                                                 borderRadius: 4
//                                             }}>
//                                                 <Text type="secondary" style={{ fontSize: 12 }}>
//                                                     📅 {checkDate.format('DD MMMM YYYY')}
//                                                 </Text>
//                                             </div>
//                                         )}
//                                         <Table
//                                             dataSource={shortHourWorkers}
//                                             columns={shortHourColumns}
//                                             pagination={false}
//                                             rowKey={(record) => `${record.employee_code}_${record.date}`}
//                                             size="small"
//                                             locale={{ emptyText: 'No short hours found' }}
//                                             scroll={{ y: 300 }}
//                                             showHeader={true}
//                                         />
//                                     </div>
//                                 </TabPane>
                                
//                                 <TabPane 
//                                     tab="Weekly" 
//                                     key="2"
//                                 >
//                                     <div style={{ padding: '12px 0' }}>
//                                         {weekRange.start && (
//                                             <div style={{ 
//                                                 background: '#f5f5f5', 
//                                                 padding: '8px 12px', 
//                                                 marginBottom: 12,
//                                                 borderRadius: 4
//                                             }}>
//                                                 <Text type="secondary" style={{ fontSize: 12 }}>
//                                                     📅 {weekRange.start}
//                                                 </Text>
//                                             </div>
//                                         )}
//                                         {shortageLoading ? (
//                                             <div style={{ textAlign: 'center', padding: 40 }}>
//                                                 <Spin />
//                                             </div>
//                                         ) : (
//                                             <Table
//                                                 dataSource={weeklyData}
//                                                 columns={simpleColumns}
//                                                 pagination={{
//                                                     pageSize: 15,
//                                                     size: 'small',
//                                                     showSizeChanger: false
//                                                 }}
//                                                 rowKey={(record) => `weekly_${record.employee_code}`}
//                                                 size="small"
//                                                 locale={{ emptyText: 'No data found' }}
//                                                 scroll={{ y: 300 }}
//                                                 showHeader={true}
//                                             />
//                                         )}
//                                     </div>
//                                 </TabPane>
                                
//                                 <TabPane 
//                                     tab="Monthly" 
//                                     key="3"
//                                 >
//                                     <div style={{ padding: '12px 0' }}>
//                                         {monthRange.start && (
//                                             <div style={{ 
//                                                 background: '#f5f5f5', 
//                                                 padding: '8px 12px', 
//                                                 marginBottom: 12,
//                                                 borderRadius: 4
//                                             }}>
//                                                 <Text type="secondary" style={{ fontSize: 12 }}>
//                                                     📅 {monthRange.start}
//                                                 </Text>
//                                             </div>
//                                         )}
//                                         {shortageLoading ? (
//                                             <div style={{ textAlign: 'center', padding: 40 }}>
//                                                 <Spin />
//                                             </div>
//                                         ) : (
//                                             <Table
//                                                 dataSource={monthlyData}
//                                                 columns={simpleColumns}
//                                                 pagination={{
//                                                     pageSize: 15,
//                                                     size: 'small',
//                                                     showSizeChanger: false
//                                                 }}
//                                                 rowKey={(record) => `monthly_${record.employee_code}`}
//                                                 size="small"
//                                                 locale={{ emptyText: 'No data found' }}
//                                                 scroll={{ y: 300 }}
//                                                 showHeader={true}
//                                             />
//                                         )}
//                                     </div>
//                                 </TabPane>
//                             </Tabs>
//                         </Card>
//                     )}
//                 </Col>
//             </Row>

//             <Modal
//                 title={selectedEvent?.title}
//                 open={modalVisible}
//                 onCancel={() => setModalVisible(false)}
//                 footer={null}
//             >
//                 {selectedEvent && (
//                     <div>
//                         <p><strong>Type:</strong> {selectedEvent.type}</p>
//                         <p><strong>Date:</strong> {moment(selectedEvent.start).format('DD MMMM YYYY')}</p>
//                         {selectedEvent.end && !moment(selectedEvent.start).isSame(selectedEvent.end, 'day') && (
//                             <p><strong>End Date:</strong> {moment(selectedEvent.end).format('DD MMMM YYYY')}</p>
//                         )}
//                         {selectedEvent.description && (
//                             <p><strong>Employee:</strong> {selectedEvent.description}</p>
//                         )}
//                     </div>
//                 )}
//             </Modal>
//         </div>
//     );
// };

// export default CalendarView;


// import React, { useState, useEffect } from 'react';
// import { Calendar, momentLocalizer, Navigate } from 'react-big-calendar';
// import moment from 'moment';
// import { 
//     Card, 
//     Badge, 
//     List, 
//     Spin, 
//     Row, 
//     Col, 
//     Tag, 
//     Modal, 
//     Divider, 
//     Statistic, 
//     Table, 
//     Space, 
//     Typography, 
//     Tabs,
//     Empty,
//     Button,
//     Descriptions
// } from 'antd';
// import { 
//     ClockCircleOutlined, 
//     CalendarOutlined, 
//     LeftOutlined, 
//     RightOutlined, 
//     WarningOutlined,
//     TeamOutlined,
//     FieldTimeOutlined,
//     CheckCircleOutlined
// } from '@ant-design/icons';
// import { getCalendarEvents, getHolidays } from '../../services/calendarService';
// import { gettotalhoursforcalendar, getAllAttendance } from '../../services/attendanceService';
// import 'react-big-calendar/lib/css/react-big-calendar.css';

// const localizer = momentLocalizer(moment);
// const IST_TIMEZONE = 'Asia/Kolkata';
// const { Text, Title } = Typography;

// // Custom Toolbar Component
// const CustomToolbar = (toolbar) => {
//     const goToBack = () => {
//         toolbar.onNavigate(Navigate.PREVIOUS);
//     };

//     const goToNext = () => {
//         toolbar.onNavigate(Navigate.NEXT);
//     };

//     const goToToday = () => {
//         toolbar.onNavigate(Navigate.TODAY);
//     };

//     return (
//         <div className="rbc-toolbar">
//             <span className="rbc-btn-group">
//                 <Button type="default" onClick={goToBack} icon={<LeftOutlined />} />
//                 <Button type="primary" onClick={goToToday}>Today</Button>
//                 <Button type="default" onClick={goToNext} icon={<RightOutlined />} />
//             </span>
//             <span className="rbc-toolbar-label">
//                 <Text strong style={{ fontSize: 16 }}>{toolbar.label}</Text>
//             </span>
//             <span className="rbc-btn-group">
//                 {toolbar.views.map((view) => (
//                     <Button
//                         key={view}
//                         type={toolbar.view === view ? 'primary' : 'default'}
//                         onClick={() => toolbar.onView(view)}
//                     >
//                         {view.charAt(0).toUpperCase() + view.slice(1)}
//                     </Button>
//                 ))}
//             </span>
//         </div>
//     );
// };

// const CalendarView = () => {
//     const [events, setEvents] = useState([]);
//     const [holidays, setHolidays] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [selectedEvent, setSelectedEvent] = useState(null);
//     const [modalVisible, setModalVisible] = useState(false);
//     const [currentDate, setCurrentDate] = useState(new Date());
//     const [calculatedWorkingDays, setCalculatedWorkingDays] = useState(0);
//     const [userRole, setUserRole] = useState('');
//     const [insights, setInsights] = useState(null);
//     const [monthlyTotal, setMonthlyTotal] = useState('0:00');
//     const [shortHourWorkers, setShortHourWorkers] = useState([]);
//     const [checkDate, setCheckDate] = useState(null);
//     const [weeklyData, setWeeklyData] = useState([]);
//     const [monthlyData, setMonthlyData] = useState([]);
//     const [shortageLoading, setShortageLoading] = useState(false);
//     const [weekRange, setWeekRange] = useState({ start: null, end: null });
//     const [monthRange, setMonthRange] = useState({ start: null, end: null });

//     useEffect(() => {
//         moment.tz.setDefault(IST_TIMEZONE);
//         fetchMonthData(currentDate);
//     }, []);

//     const convertDecimalToTime = (decimalHours) => {
//         if (!decimalHours || isNaN(decimalHours)) return '0:00';
//         const hours = Math.floor(Math.abs(decimalHours));
//         const minutes = Math.round((Math.abs(decimalHours) - hours) * 60);
//         return `${hours}:${minutes.toString().padStart(2, '0')}`;
//     };

//     const getCheckDate = () => {
//         const yesterday = moment.tz(IST_TIMEZONE).subtract(1, 'day');
//         const dayOfWeek = yesterday.day();

//         if (dayOfWeek === 0) {
//             return yesterday.subtract(2, 'days');
//         } else if (dayOfWeek === 6) {
//             return yesterday.subtract(1, 'day');
//         } else {
//             return yesterday;
//         }
//     };

//     const calculateWeeklyData = (attendanceData, startOfWeek, endOfWeek) => {
//         const employeeMap = {};

//         attendanceData.forEach(record => {
//             const recordDate = moment(record.date);
//             if (recordDate.isBetween(startOfWeek, endOfWeek, 'day', '[]')) {
//                 const empCode = record.employee_code;
//                 if (!employeeMap[empCode]) {
//                     employeeMap[empCode] = {
//                         employee_code: empCode,
//                         employee_name: record.employee_name || empCode,
//                         total_hours: 0
//                     };
//                 }
//                 employeeMap[empCode].total_hours += parseFloat(record.total_hours) || 0;
//             }
//         });

//         return Object.values(employeeMap).sort((a, b) => a.total_hours - b.total_hours);
//     };

//     const calculateMonthlyData = (attendanceData, startOfMonth, endOfMonth) => {
//         const employeeMap = {};

//         attendanceData.forEach(record => {
//             const recordDate = moment(record.date);
//             if (recordDate.isBetween(startOfMonth, endOfMonth, 'day', '[]')) {
//                 const empCode = record.employee_code;
//                 if (!employeeMap[empCode]) {
//                     employeeMap[empCode] = {
//                         employee_code: empCode,
//                         employee_name: record.employee_name || empCode,
//                         total_hours: 0
//                     };
//                 }
//                 employeeMap[empCode].total_hours += parseFloat(record.total_hours) || 0;
//             }
//         });

//         return Object.values(employeeMap).sort((a, b) => a.total_hours - b.total_hours);
//     };

//     const fetchWeeklyData = async () => {
//         try {
//             setShortageLoading(true);
//             const startOfLastWeek = moment().subtract(1, 'week').startOf('isoWeek');
//             const endOfLastWeek = moment().subtract(1, 'week').endOf('isoWeek');
            
//             setWeekRange({
//                 start: startOfLastWeek.format('DD MMM YYYY'),
//                 end: endOfLastWeek.format('DD MMM YYYY')
//             });
            
//             const response = await gettotalhoursforcalendar(
//                 startOfLastWeek.format('YYYY-MM-DD'),
//                 endOfLastWeek.format('YYYY-MM-DD')
//             );
            
//             if (response && response.data) {
//                 const weekData = calculateWeeklyData(response.data, startOfLastWeek, endOfLastWeek);
//                 setWeeklyData(weekData);
//             }
//         } catch (error) {
//             console.error('Error fetching weekly data:', error);
//             setWeeklyData([]);
//         } finally {
//             setShortageLoading(false);
//         }
//     };

//     const fetchMonthlyData = async () => {
//         try {
//             setShortageLoading(true);
//             const startOfLastMonth = moment().subtract(1, 'month').startOf('month');
//             const endOfLastMonth = moment().subtract(1, 'month').endOf('month');
            
//             setMonthRange({
//                 start: startOfLastMonth.format('MMMM YYYY'),
//                 end: endOfLastMonth.format('MMMM YYYY')
//             });
            
//             const response = await gettotalhoursforcalendar(
//                 startOfLastMonth.format('YYYY-MM-DD'),
//                 endOfLastMonth.format('YYYY-MM-DD')
//             );
            
//             if (response && response.data) {
//                 const monthData = calculateMonthlyData(response.data, startOfLastMonth, endOfLastMonth);
//                 setMonthlyData(monthData);
//             }
//         } catch (error) {
//             console.error('Error fetching monthly data:', error);
//             setMonthlyData([]);
//         } finally {
//             setShortageLoading(false);
//         }
//     };

//     const fetchShortHourWorkers = async () => {
//         try {
//             const checkDateMoment = getCheckDate();
//             const dateStr = checkDateMoment.format('YYYY-MM-DD');
//             setCheckDate(checkDateMoment);

//             const attendanceData = await getAllAttendance(dateStr, dateStr);
//             const shortWorkers = attendanceData.data
//                 .filter(record => parseFloat(record.total_hours) < 8 && parseFloat(record.total_hours) > 0)
//                 .sort((a, b) => parseFloat(a.total_hours) - parseFloat(b.total_hours));

//             setShortHourWorkers(shortWorkers);
//         } catch (error) {
//             console.error('Error fetching short hour workers:', error);
//             setShortHourWorkers([]);
//         }
//     };

//     const calculateMonthlyTotal = async (date) => {
//         try {
//             const startOfMonth = moment(date).startOf('month').format('YYYY-MM-DD');
//             const endOfMonth = moment(date).endOf('month').format('YYYY-MM-DD');
            
//             const attendanceData = await gettotalhoursforcalendar(startOfMonth, endOfMonth);
            
//             if (attendanceData && attendanceData.data) {
//                 let totalHours = 0;
//                 attendanceData.data.forEach(record => {
//                     totalHours += parseFloat(record.total_hours) || 0;
//                 });
//                 setMonthlyTotal(convertDecimalToTime(totalHours));
//             }
//         } catch (error) {
//             console.error('Error fetching monthly attendance:', error);
//             setMonthlyTotal('0:00');
//         }
//     };

//     const fetchMonthData = async (date) => {
//         setLoading(true);
//         try {
//             const month = moment(date).month() + 1;
//             const year = moment(date).year();

//             const eventsData = await getCalendarEvents(month, year);
//             const holidaysData = await getHolidays(year);
//             await calculateMonthlyTotal(date);
            
//             if (eventsData.role) {
//                 setUserRole(eventsData.role);
//                 if (eventsData.role === 'HR' || eventsData.role === 'SUPER ADMIN' || eventsData.role === 'MANAGER') {
//                     await fetchShortHourWorkers();
//                     await fetchWeeklyData();
//                     await fetchMonthlyData();
//                 }
//             }

//             if (eventsData.insights) {
//                 setInsights(eventsData.insights);
//                 const workDays = Math.floor(eventsData.insights.net_working_hours / 8);
//                 setCalculatedWorkingDays(workDays);
//             }

//             const formattedEvents = [];

//             if (holidaysData.data) {
//                 holidaysData.data.forEach(holiday => {
//                     formattedEvents.push({
//                         id: `holiday-${holiday.id}`,
//                         title: `🎉 ${holiday.holiday_name}`,
//                         start: new Date(holiday.holiday_date),
//                         end: new Date(holiday.holiday_date),
//                         type: 'holiday',
//                         description: holiday.description,
//                         allDay: true
//                     });
//                 });
//             }

//             if (eventsData.data) {
//                 eventsData.data.forEach(event => {
//                     if (event.type === 'leave') {
//                         formattedEvents.push({
//                             id: `leave-${event.id}`,
//                             title: `📅 ${event.title}`,
//                             start: new Date(event.date),
//                             end: new Date(event.to_date || event.date),
//                             type: 'leave',
//                             description: event.employee_name,
//                             employeeId: event.employee_id,
//                             allDay: true
//                         });
//                     } else if (event.type === 'birthday') {
//                         formattedEvents.push({
//                             id: `birthday-${event.id}`,
//                             title: `🎂 ${event.title}`,
//                             start: new Date(event.date),
//                             end: new Date(event.date),
//                             type: 'birthday',
//                             description: event.employee_name,
//                             employeeId: event.employee_id,
//                             allDay: true
//                         });
//                     }
//                 });
//             }

//             setEvents(formattedEvents);
//             setHolidays(holidaysData.data || []);
//         } catch (error) {
//             console.error('Error fetching calendar data:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleNavigate = (date, view, action) => {
//         setCurrentDate(date);
//         fetchMonthData(date);
//     };

//     const eventStyleGetter = (event) => {
//         let backgroundColor = '#1890ff';
        
//         if (event.type === 'holiday') {
//             backgroundColor = '#f5222d';
//         } else if (event.type === 'leave') {
//             backgroundColor = '#52c41a';
//         } else if (event.type === 'birthday') {
//             backgroundColor = '#fa8c16';
//         }

//         return {
//             style: {
//                 backgroundColor,
//                 borderRadius: '4px',
//                 opacity: 0.9,
//                 color: 'white',
//                 border: '0px',
//                 display: 'block'
//             }
//         };
//     };

//     const handleSelectEvent = (event) => {
//         setSelectedEvent(event);
//         setModalVisible(true);
//     };

//     const getUpcomingHolidays = () => {
//         return holidays
//             .filter(h => moment(h.holiday_date).isSameOrAfter(moment(), 'day'))
//             .slice(0, 3);
//     };

//     const getViewTitle = () => {
//         if (userRole === 'HR' || userRole === 'SUPER ADMIN' || userRole === 'MANAGER') {
//             return 'Organization Calendar';
//         } else if (userRole === 'TL') {
//             return 'Team Calendar';
//         }
//         return 'Personal Calendar';
//     };

//     const getBadgeText = () => {
//         if (userRole === 'HR' || userRole === 'SUPER ADMIN' || userRole === 'MANAGER') {
//             return 'All Leaves';
//         } else if (userRole === 'TL') {
//             return 'Team Leaves';
//         }
//         return 'My Leaves';
//     };

//     const simpleColumns = [
//         {
//             title: 'Employee',
//             dataIndex: 'employee_code',
//             key: 'employee_code',
//             width: '65%',
//             render: (code) => <Text strong style={{ fontSize: 13 }}>{code}</Text>
//         },
//         {
//             title: 'Hours',
//             dataIndex: 'total_hours',
//             key: 'total_hours',
//             align: 'right',
//             width: '35%',
//             render: (hours) => {
//                 const timeStr = convertDecimalToTime(hours);
//                 return (
//                     <Tag color="red" style={{ fontSize: 12 }}>
//                         {timeStr}
//                     </Tag>
//                 );
//             }
//         }
//     ];

//     const shortHourColumns = [
//         {
//             title: 'Employee',
//             dataIndex: 'employee_code',
//             key: 'employee_code',
//             width: '65%',
//             render: (code) => <Text strong style={{ fontSize: 13 }}>{code}</Text>
//         },
//         {
//             title: 'Hours',
//             dataIndex: 'total_hours',
//             key: 'total_hours',
//             align: 'right',
//             width: '35%',
//             render: (hours) => {
//                 const timeStr = convertDecimalToTime(hours);
//                 return (
//                     <Tag color="red" style={{ fontSize: 12 }}>
//                         {timeStr}
//                     </Tag>
//                 );
//             }
//         }
//     ];

//     const isHRorAdmin = userRole === 'HR' || userRole === 'SUPER ADMIN' || userRole === 'MANAGER';

//     return (
//         <div style={{ padding: '16px' }}>
//             <Row gutter={[16, 16]}>
//                 <Col xs={24} lg={18}>
//                     <Card
//                         title={
//                             <Space>
//                                 <CalendarOutlined />
//                                 <span>{getViewTitle()}</span>
//                             </Space>
//                         }
//                         extra={
//                             <Space size="large">
//                                 <Badge status="error" text="Holidays" />
//                                 <Badge status="success" text={getBadgeText()} />
//                                 <Badge status="warning" text="Birthdays" />
//                             </Space>
//                         }
//                         bordered={false}
//                     >
//                         {loading ? (
//                             <div style={{ textAlign: 'center', padding: '100px 0' }}>
//                                 <Spin size="large" tip="Loading calendar data..." />
//                             </div>
//                         ) : (
//                             <Calendar
//                                 localizer={localizer}
//                                 events={events}
//                                 startAccessor="start"
//                                 endAccessor="end"
//                                 style={{ height: 600 }}
//                                 eventPropGetter={eventStyleGetter}
//                                 onSelectEvent={handleSelectEvent}
//                                 onNavigate={handleNavigate}
//                                 date={currentDate}
//                                 views={['month', 'week', 'day', 'agenda']}
//                                 defaultView="month"
//                                 popup
//                                 components={{
//                                     toolbar: CustomToolbar
//                                 }}
//                             />
//                         )}
//                     </Card>
//                 </Col>

//                 <Col xs={24} lg={6}>
//                     {/* Fixed height scrollable container */}
//                     <div style={{ 
//                         maxHeight: 'calc(100vh - 120px)', 
//                         overflowY: 'auto',
//                         paddingRight: '8px'
//                     }}>
//                         <Space direction="vertical" size={16} style={{ width: '100%' }}>
//                             {/* Compact Holiday Card - Show only 3 */}
//                             <Card 
//                                 title={
//                                     <Space size={8}>
//                                         <CalendarOutlined />
//                                         <span style={{ fontSize: 14 }}>Upcoming Holidays</span>
//                                     </Space>
//                                 }
//                                 size="small"
//                                 bordered={false}
//                             >
//                                 <List
//                                     size="small"
//                                     dataSource={getUpcomingHolidays()}
//                                     renderItem={(holiday) => (
//                                         <List.Item style={{ padding: '8px 0' }}>
//                                             <List.Item.Meta
//                                                 avatar={<span style={{ fontSize: 20 }}>🎉</span>}
//                                                 title={<Text strong style={{ fontSize: 13 }}>{holiday.holiday_name}</Text>}
//                                                 description={
//                                                     <Space direction="vertical" size={2}>
//                                                         <Text type="secondary" style={{ fontSize: 12 }}>
//                                                             {moment(holiday.holiday_date).format('DD MMM YYYY')}
//                                                         </Text>
//                                                         <Tag color="red" style={{ fontSize: 11 }}>
//                                                             {moment(holiday.holiday_date).format('dddd')}
//                                                         </Tag>
//                                                     </Space>
//                                                 }
//                                             />
//                                         </List.Item>
//                                     )}
//                                     locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No holidays" /> }}
//                                 />
//                             </Card>

//                             {/* Compact Monthly Summary */}
//                             {insights && (
//                                 <Card 
//                                     title={
//                                         <Space size={8}>
//                                             <FieldTimeOutlined />
//                                             <span style={{ fontSize: 14 }}>Monthly Summary</span>
//                                         </Space>
//                                     }
//                                     size="small"
//                                     bordered={false}
//                                 >
//                                     <Space direction="vertical" size={12} style={{ width: '100%' }}>
//                                         <Statistic
//                                             title={<span style={{ fontSize: 12 }}>Working Days</span>}
//                                             value={calculatedWorkingDays}
//                                             suffix="days"
//                                             valueStyle={{ fontSize: 18 }}
//                                         />
//                                         <Divider style={{ margin: 0 }} />
//                                         <Statistic
//                                             title={<span style={{ fontSize: 12 }}>Expected Hours</span>}
//                                             value={insights.net_working_hours}
//                                             suffix="hrs"
//                                             valueStyle={{ fontSize: 18, color: '#1890ff' }}
//                                         />
//                                         <Divider style={{ margin: 0 }} />
//                                         <Statistic
//                                             title={<span style={{ fontSize: 12 }}>Total Logged</span>}
//                                             value={monthlyTotal}
//                                             suffix="hrs"
//                                             valueStyle={{ fontSize: 20, color: '#52c41a', fontWeight: 600 }}
//                                         />
//                                     </Space>
//                                 </Card>
//                             )}

//                             {/* Compact Attendance Report with smaller fixed height tables */}
//                             {isHRorAdmin && (
//                                 <Card 
//                                     title={
//                                         <Space size={8}>
//                                             <TeamOutlined />
//                                             <span style={{ fontSize: 14 }}>Attendance Report</span>
//                                         </Space>
//                                     }
//                                     size="small"
//                                     bordered={false}
//                                     bodyStyle={{ padding: '0' }}
//                                 >
//                                     <Tabs 
//                                         defaultActiveKey="1" 
//                                         size="small"
//                                         style={{ padding: '0 12px' }}
//                                     >
//                                         <Tabs.TabPane tab="Daily" key="1">
//                                             <div style={{ paddingBottom: 12 }}>
//                                                 {checkDate && (
//                                                     <div style={{ 
//                                                         background: '#fafafa', 
//                                                         padding: '6px 8px', 
//                                                         marginBottom: 8,
//                                                         borderRadius: 2,
//                                                         fontSize: 11
//                                                     }}>
//                                                         <Text type="secondary">
//                                                             📅 {checkDate.format('DD MMM YYYY')}
//                                                         </Text>
//                                                     </div>
//                                                 )}
//                                                 <Table
//                                                     dataSource={shortHourWorkers}
//                                                     columns={shortHourColumns}
//                                                     pagination={false}
//                                                     rowKey={(record) => `${record.employee_code}_${record.date}`}
//                                                     size="small"
//                                                     locale={{ 
//                                                         emptyText: <Empty 
//                                                             image={Empty.PRESENTED_IMAGE_SIMPLE} 
//                                                             description="No data" 
//                                                             style={{ margin: '20px 0' }}
//                                                         /> 
//                                                     }}
//                                                     scroll={{ y: 200 }}
//                                                 />
//                                             </div>
//                                         </Tabs.TabPane>
                                        
//                                         <Tabs.TabPane tab="Weekly" key="2">
//                                             <div style={{ paddingBottom: 12 }}>
//                                                 {weekRange.start && (
//                                                     <div style={{ 
//                                                         background: '#fafafa', 
//                                                         padding: '6px 8px', 
//                                                         marginBottom: 8,
//                                                         borderRadius: 2,
//                                                         fontSize: 11
//                                                     }}>
//                                                         <Text type="secondary">
//                                                             📅 {weekRange.start}
//                                                         </Text>
//                                                     </div>
//                                                 )}
//                                                 {shortageLoading ? (
//                                                     <div style={{ textAlign: 'center', padding: '30px 0' }}>
//                                                         <Spin size="small" />
//                                                     </div>
//                                                 ) : (
//                                                     <Table
//                                                         dataSource={weeklyData}
//                                                         columns={simpleColumns}
//                                                         pagination={{
//                                                             pageSize: 8,
//                                                             size: 'small',
//                                                             simple: true,
//                                                             showSizeChanger: false
//                                                         }}
//                                                         rowKey={(record) => `weekly_${record.employee_code}`}
//                                                         size="small"
//                                                         locale={{ 
//                                                             emptyText: <Empty 
//                                                                 image={Empty.PRESENTED_IMAGE_SIMPLE} 
//                                                                 description="No data" 
//                                                                 style={{ margin: '20px 0' }}
//                                                             /> 
//                                                         }}
//                                                         scroll={{ y: 200 }}
//                                                     />
//                                                 )}
//                                             </div>
//                                         </Tabs.TabPane>
                                        
//                                         <Tabs.TabPane tab="Monthly" key="3">
//                                             <div style={{ paddingBottom: 12 }}>
//                                                 {monthRange.start && (
//                                                     <div style={{ 
//                                                         background: '#fafafa', 
//                                                         padding: '6px 8px', 
//                                                         marginBottom: 8,
//                                                         borderRadius: 2,
//                                                         fontSize: 11
//                                                     }}>
//                                                         <Text type="secondary">
//                                                             📅 {monthRange.start}
//                                                         </Text>
//                                                     </div>
//                                                 )}
//                                                 {shortageLoading ? (
//                                                     <div style={{ textAlign: 'center', padding: '30px 0' }}>
//                                                         <Spin size="small" />
//                                                     </div>
//                                                 ) : (
//                                                     <Table
//                                                         dataSource={monthlyData}
//                                                         columns={simpleColumns}
//                                                         pagination={{
//                                                             pageSize: 8,
//                                                             size: 'small',
//                                                             simple: true,
//                                                             showSizeChanger: false
//                                                         }}
//                                                         rowKey={(record) => `monthly_${record.employee_code}`}
//                                                         size="small"
//                                                         locale={{ 
//                                                             emptyText: <Empty 
//                                                                 image={Empty.PRESENTED_IMAGE_SIMPLE} 
//                                                                 description="No data" 
//                                                                 style={{ margin: '20px 0' }}
//                                                             /> 
//                                                         }}
//                                                         scroll={{ y: 200 }}
//                                                     />
//                                                 )}
//                                             </div>
//                                         </Tabs.TabPane>
//                                     </Tabs>
//                                 </Card>
//                             )}
//                         </Space>
//                     </div>
//                 </Col>
//             </Row>

//             <Modal
//                 title={
//                     <Space>
//                         {selectedEvent?.type === 'holiday' && '🎉'}
//                         {selectedEvent?.type === 'leave' && '📅'}
//                         {selectedEvent?.type === 'birthday' && '🎂'}
//                         <span>{selectedEvent?.title}</span>
//                     </Space>
//                 }
//                 open={modalVisible}
//                 onCancel={() => setModalVisible(false)}
//                 footer={[
//                     <Button key="close" type="primary" onClick={() => setModalVisible(false)}>
//                         Close
//                     </Button>
//                 ]}
//                 width={500}
//             >
//                 {selectedEvent && (
//                     <Descriptions bordered column={1} size="small">
//                         <Descriptions.Item label="Type">
//                             <Tag color={
//                                 selectedEvent.type === 'holiday' ? 'red' : 
//                                 selectedEvent.type === 'leave' ? 'green' : 'orange'
//                             }>
//                                 {selectedEvent.type.toUpperCase()}
//                             </Tag>
//                         </Descriptions.Item>
//                         <Descriptions.Item label="Date">
//                             {moment(selectedEvent.start).format('DD MMMM YYYY')}
//                         </Descriptions.Item>
//                         {selectedEvent.end && !moment(selectedEvent.start).isSame(selectedEvent.end, 'day') && (
//                             <Descriptions.Item label="End Date">
//                                 {moment(selectedEvent.end).format('DD MMMM YYYY')}
//                             </Descriptions.Item>
//                         )}
//                         {selectedEvent.description && (
//                             <Descriptions.Item label="Details">
//                                 {selectedEvent.description}
//                             </Descriptions.Item>
//                         )}
//                     </Descriptions>
//                 )}
//             </Modal>
//         </div>
//     );
// };

// export default CalendarView;




import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Navigate } from 'react-big-calendar';
import moment from 'moment';
import { 
    Card, 
    Badge, 
    List, 
    Spin, 
    Row, 
    Col, 
    Tag, 
    Modal, 
    Divider, 
    Statistic, 
    Table, 
    Space, 
    Typography,
    Empty,
    Button,
    Descriptions
} from 'antd';
import { 
    ClockCircleOutlined, 
    CalendarOutlined, 
    LeftOutlined, 
    RightOutlined, 
    WarningOutlined,
    TeamOutlined,
    FieldTimeOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import { getCalendarEvents, getHolidays } from '../../services/calendarService';
import { gettotalhoursforcalendar, getAllAttendance } from '../../services/attendanceService';
import 'react-big-calendar/lib/css/react-big-calendar.css';


const localizer = momentLocalizer(moment);
const IST_TIMEZONE = 'Asia/Kolkata';
const { Text, Title } = Typography;


// Custom Toolbar Component
const CustomToolbar = (toolbar) => {
    const goToBack = () => {
        toolbar.onNavigate(Navigate.PREVIOUS);
    };


    const goToNext = () => {
        toolbar.onNavigate(Navigate.NEXT);
    };


    const goToToday = () => {
        toolbar.onNavigate(Navigate.TODAY);
    };


    return (
        <div className="rbc-toolbar">
            <span className="rbc-btn-group">
                <Button type="default" onClick={goToBack} icon={<LeftOutlined />} />
                <Button type="primary" onClick={goToToday}>Today</Button>
                <Button type="default" onClick={goToNext} icon={<RightOutlined />} />
            </span>
            <span className="rbc-toolbar-label">
                <Text strong style={{ fontSize: 16 }}>{toolbar.label}</Text>
            </span>
            <span className="rbc-btn-group">
                {toolbar.views.map((view) => (
                    <Button
                        key={view}
                        type={toolbar.view === view ? 'primary' : 'default'}
                        onClick={() => toolbar.onView(view)}
                    >
                        {view.charAt(0).toUpperCase() + view.slice(1)}
                    </Button>
                ))}
            </span>
        </div>
    );
};


const CalendarView = () => {
    const [events, setEvents] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calculatedWorkingDays, setCalculatedWorkingDays] = useState(0);
    const [userRole, setUserRole] = useState('');
    const [insights, setInsights] = useState(null);
    const [monthlyTotal, setMonthlyTotal] = useState('0:00');
    const [shortHourWorkers, setShortHourWorkers] = useState([]);
    const [checkDate, setCheckDate] = useState(null);


    useEffect(() => {
        moment.tz.setDefault(IST_TIMEZONE);
        fetchMonthData(currentDate);
    }, []);


    const convertDecimalToTime = (decimalHours) => {
        if (!decimalHours || isNaN(decimalHours)) return '0:00';
        const hours = Math.floor(Math.abs(decimalHours));
        const minutes = Math.round((Math.abs(decimalHours) - hours) * 60);
        return `${hours}:${minutes.toString().padStart(2, '0')}`;
    };


    const getCheckDate = () => {
        const yesterday = moment.tz(IST_TIMEZONE).subtract(1, 'day');
        const dayOfWeek = yesterday.day();


        if (dayOfWeek === 0) {
            return yesterday.subtract(2, 'days');
        } else if (dayOfWeek === 6) {
            return yesterday.subtract(1, 'day');
        } else {
            return yesterday;
        }
    };


    const fetchShortHourWorkers = async () => {
        try {
            const checkDateMoment = getCheckDate();
            const dateStr = checkDateMoment.format('YYYY-MM-DD');
            setCheckDate(checkDateMoment);


            const attendanceData = await getAllAttendance(dateStr, dateStr);
            const shortWorkers = attendanceData.data
                .filter(record => parseFloat(record.total_hours) < 8 && parseFloat(record.total_hours) > 0)
                .sort((a, b) => parseFloat(a.total_hours) - parseFloat(b.total_hours));


            setShortHourWorkers(shortWorkers);
        } catch (error) {
            console.error('Error fetching short hour workers:', error);
            setShortHourWorkers([]);
        }
    };


    const calculateMonthlyTotal = async (date) => {
        try {
            const startOfMonth = moment(date).startOf('month').format('YYYY-MM-DD');
            const endOfMonth = moment(date).endOf('month').format('YYYY-MM-DD');
            
            const attendanceData = await gettotalhoursforcalendar(startOfMonth, endOfMonth);
            
            if (attendanceData && attendanceData.data) {
                let totalHours = 0;
                attendanceData.data.forEach(record => {
                    totalHours += parseFloat(record.total_hours) || 0;
                });
                setMonthlyTotal(convertDecimalToTime(totalHours));
            }
        } catch (error) {
            console.error('Error fetching monthly attendance:', error);
            setMonthlyTotal('0:00');
        }
    };


    const fetchMonthData = async (date) => {
        setLoading(true);
        try {
            const month = moment(date).month() + 1;
            const year = moment(date).year();


            const eventsData = await getCalendarEvents(month, year);
            const holidaysData = await getHolidays(year);
            await calculateMonthlyTotal(date);
            
            if (eventsData.role) {
                setUserRole(eventsData.role);
                if (eventsData.role === 'HR' || eventsData.role === 'SUPER ADMIN' || eventsData.role === 'MANAGER') {
                    await fetchShortHourWorkers();
                }
            }


            if (eventsData.insights) {
                setInsights(eventsData.insights);
                const workDays = Math.floor(eventsData.insights.net_working_hours / 8);
                setCalculatedWorkingDays(workDays);
            }


            const formattedEvents = [];


            if (holidaysData.data) {
                holidaysData.data.forEach(holiday => {
                    formattedEvents.push({
                        id: `holiday-${holiday.id}`,
                        title: `🎉 ${holiday.holiday_name}`,
                        start: new Date(holiday.holiday_date),
                        end: new Date(holiday.holiday_date),
                        type: 'holiday',
                        description: holiday.description,
                        allDay: true
                    });
                });
            }


            if (eventsData.data) {
                eventsData.data.forEach(event => {
                    if (event.type === 'leave') {
                        formattedEvents.push({
                            id: `leave-${event.id}`,
                            title: `📅 ${event.title}`,
                            start: new Date(event.date),
                            end: new Date(event.to_date || event.date),
                            type: 'leave',
                            description: event.employee_name,
                            employeeId: event.employee_id,
                            allDay: true
                        });
                    } else if (event.type === 'birthday') {
                        formattedEvents.push({
                            id: `birthday-${event.id}`,
                            title: `🎂 ${event.title}`,
                            start: new Date(event.date),
                            end: new Date(event.date),
                            type: 'birthday',
                            description: event.employee_name,
                            employeeId: event.employee_id,
                            allDay: true
                        });
                    }
                });
            }


            setEvents(formattedEvents);
            setHolidays(holidaysData.data || []);
        } catch (error) {
            console.error('Error fetching calendar data:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleNavigate = (date, view, action) => {
        setCurrentDate(date);
        fetchMonthData(date);
    };


    const eventStyleGetter = (event) => {
        let backgroundColor = '#1890ff';
        
        if (event.type === 'holiday') {
            backgroundColor = '#f5222d';
        } else if (event.type === 'leave') {
            backgroundColor = '#52c41a';
        } else if (event.type === 'birthday') {
            backgroundColor = '#fa8c16';
        }


        return {
            style: {
                backgroundColor,
                borderRadius: '4px',
                opacity: 0.9,
                color: 'white',
                border: '0px',
                display: 'block'
            }
        };
    };


    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setModalVisible(true);
    };


    const getUpcomingHolidays = () => {
        return holidays
            .filter(h => moment(h.holiday_date).isSameOrAfter(moment(), 'day'))
            .slice(0, 3);
    };


    const getViewTitle = () => {
        if (userRole === 'HR' || userRole === 'SUPER ADMIN' || userRole === 'MANAGER') {
            return 'Organization Calendar';
        } else if (userRole === 'TL') {
            return 'Team Calendar';
        }
        return 'Personal Calendar';
    };


    const getBadgeText = () => {
        if (userRole === 'HR' || userRole === 'SUPER ADMIN' || userRole === 'MANAGER') {
            return 'All Leaves';
        } else if (userRole === 'TL') {
            return 'Team Leaves';
        }
        return 'My Leaves';
    };


    const shortHourColumns = [
        {
            title: 'Employee',
            dataIndex: 'employee_code',
            key: 'employee_code',
            width: '65%',
            render: (code) => <Text strong style={{ fontSize: 13 }}>{code}</Text>
        },
        {
            title: 'Hours',
            dataIndex: 'total_hours',
            key: 'total_hours',
            align: 'right',
            width: '35%',
            render: (hours) => {
                const timeStr = convertDecimalToTime(hours);
                return (
                    <Tag color="red" style={{ fontSize: 12 }}>
                        {timeStr}
                    </Tag>
                );
            }
        }
    ];


    const isHRorAdmin = userRole === 'HR' || userRole === 'SUPER ADMIN' || userRole === 'MANAGER';


    return (
        <div style={{ padding: '16px' }}>
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={18}>
                    <Card
                        title={
                            <Space>
                                <CalendarOutlined />
                                <span>{getViewTitle()}</span>
                            </Space>
                        }
                        extra={
                            <Space size="large">
                                <Badge status="error" text="Holidays" />
                                <Badge status="success" text={getBadgeText()} />
                                <Badge status="warning" text="Birthdays" />
                            </Space>
                        }
                        bordered={false}
                    >
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                                <Spin size="large" tip="Loading calendar data..." />
                            </div>
                        ) : (
                            <Calendar
                                localizer={localizer}
                                events={events}
                                startAccessor="start"
                                endAccessor="end"
                                style={{ height: 600 }}
                                eventPropGetter={eventStyleGetter}
                                onSelectEvent={handleSelectEvent}
                                onNavigate={handleNavigate}
                                date={currentDate}
                                views={['month', 'week', 'day', 'agenda']}
                                defaultView="month"
                                popup
                                components={{
                                    toolbar: CustomToolbar
                                }}
                            />
                        )}
                    </Card>
                </Col>


                <Col xs={24} lg={6}>
                    {/* Fixed height scrollable container */}
                    <div style={{ 
                        maxHeight: 'calc(100vh - 120px)', 
                        overflowY: 'auto',
                        paddingRight: '8px'
                    }}>
                        <Space direction="vertical" size={16} style={{ width: '100%' }}>
                            {/* Compact Holiday Card - Show only 3 */}
                            <Card 
                                title={
                                    <Space size={8}>
                                        <CalendarOutlined />
                                        <span style={{ fontSize: 14 }}>Upcoming Holidays</span>
                                    </Space>
                                }
                                size="small"
                                bordered={false}
                            >
                                <List
                                    size="small"
                                    dataSource={getUpcomingHolidays()}
                                    renderItem={(holiday) => (
                                        <List.Item style={{ padding: '8px 0' }}>
                                            <List.Item.Meta
                                                avatar={<span style={{ fontSize: 20 }}>🎉</span>}
                                                title={<Text strong style={{ fontSize: 13 }}>{holiday.holiday_name}</Text>}
                                                description={
                                                    <Space direction="vertical" size={2}>
                                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                                            {moment(holiday.holiday_date).format('DD MMM YYYY')}
                                                        </Text>
                                                        <Tag color="red" style={{ fontSize: 11 }}>
                                                            {moment(holiday.holiday_date).format('dddd')}
                                                        </Tag>
                                                    </Space>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                    locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No holidays" /> }}
                                />
                            </Card>


                            {/* Compact Monthly Summary */}
                            {insights && (
                                <Card 
                                    title={
                                        <Space size={8}>
                                            <FieldTimeOutlined />
                                            <span style={{ fontSize: 14 }}>Monthly Summary</span>
                                        </Space>
                                    }
                                    size="small"
                                    bordered={false}
                                >
                                    <Space direction="vertical" size={12} style={{ width: '100%' }}>
                                        <Statistic
                                            title={<span style={{ fontSize: 12 }}>Working Days</span>}
                                            value={calculatedWorkingDays}
                                            suffix="days"
                                            valueStyle={{ fontSize: 18 }}
                                        />
                                        <Divider style={{ margin: 0 }} />
                                        <Statistic
                                            title={<span style={{ fontSize: 12 }}>Expected Hours</span>}
                                            value={insights.net_working_hours}
                                            suffix="hrs"
                                            valueStyle={{ fontSize: 18, color: '#1890ff' }}
                                        />
                                        <Divider style={{ margin: 0 }} />
                                        <Statistic
                                            title={<span style={{ fontSize: 12 }}>Total Logged</span>}
                                            value={monthlyTotal}
                                            suffix="hrs"
                                            valueStyle={{ fontSize: 20, color: '#52c41a', fontWeight: 600 }}
                                        />
                                    </Space>
                                </Card>
                            )}


                            {/* Daily Attendance Report - No Tabs */}
                            {isHRorAdmin && (
                                <Card 
                                    title={
                                        <Space size={8}>
                                            <TeamOutlined />
                                            <span style={{ fontSize: 14 }}>Daily Attendance</span>
                                        </Space>
                                    }
                                    size="small"
                                    bordered={false}
                                    bodyStyle={{ padding: '12px' }}
                                >
                                    {checkDate && (
                                        <div style={{ 
                                            background: '#fafafa', 
                                            padding: '6px 8px', 
                                            marginBottom: 8,
                                            borderRadius: 2,
                                            fontSize: 11
                                        }}>
                                            <Text type="secondary">
                                                📅 {checkDate.format('DD MMM YYYY')}
                                            </Text>
                                        </div>
                                    )}
                                    <Table
                                        dataSource={shortHourWorkers}
                                        columns={shortHourColumns}
                                        pagination={false}
                                        rowKey={(record) => `${record.employee_code}_${record.date}`}
                                        size="small"
                                        locale={{ 
                                            emptyText: <Empty 
                                                image={Empty.PRESENTED_IMAGE_SIMPLE} 
                                                description="No data" 
                                                style={{ margin: '20px 0' }}
                                            /> 
                                        }}
                                        scroll={{ y: 200 }}
                                    />
                                </Card>
                            )}
                        </Space>
                    </div>
                </Col>
            </Row>


            <Modal
                title={
                    <Space>
                        {selectedEvent?.type === 'holiday' }
                        {selectedEvent?.type === 'leave' }
                        {selectedEvent?.type === 'birthday' }
                        <span>{selectedEvent?.title}</span>
                    </Space>
                }
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={[
                    <Button key="close" type="primary" onClick={() => setModalVisible(false)}>
                        Close
                    </Button>
                ]}
                width={500}
            >
                {selectedEvent && (
                    <Descriptions bordered column={1} size="small">
                        <Descriptions.Item label="Type">
                            <Tag color={
                                selectedEvent.type === 'holiday' ? 'red' : 
                                selectedEvent.type === 'leave' ? 'green' : 'orange'
                            }>
                                {selectedEvent.type.toUpperCase()}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Date">
                            {moment(selectedEvent.start).format('DD MMMM YYYY')}
                        </Descriptions.Item>
                        {selectedEvent.end && !moment(selectedEvent.start).isSame(selectedEvent.end, 'day') && (
                            <Descriptions.Item label="End Date">
                                {moment(selectedEvent.end).format('DD MMMM YYYY')}
                            </Descriptions.Item>
                        )}
                        {selectedEvent.description && (
                            <Descriptions.Item label="Details">
                                {selectedEvent.description}
                            </Descriptions.Item>
                        )}
                    </Descriptions>
                )}
            </Modal>
        </div>
    );
};


export default CalendarView;







// import React, { useState, useEffect } from 'react';
// import { Calendar, momentLocalizer, Navigate } from 'react-big-calendar';
// import moment from 'moment';
// import { 
//     Card, 
//     Badge, 
//     List, 
//     Spin, 
//     Row, 
//     Col, 
//     Tag, 
//     Modal, 
//     Divider, 
//     Statistic, 
//     Space, 
//     Typography, 
//     Empty,
//     Button,
//     Descriptions
// } from 'antd';
// import { 
//     ClockCircleOutlined, 
//     CalendarOutlined, 
//     LeftOutlined, 
//     RightOutlined, 
//     WarningOutlined,
//     FieldTimeOutlined,
//     CheckCircleOutlined
// } from '@ant-design/icons';
// import { getCalendarEvents, getHolidays } from '../../services/calendarService';
// import { gettotalhoursforcalendar } from '../../services/attendanceService';
// import 'react-big-calendar/lib/css/react-big-calendar.css';

// const localizer = momentLocalizer(moment);
// const IST_TIMEZONE = 'Asia/Kolkata';
// const { Text, Title } = Typography;

// // Custom Toolbar Component
// const CustomToolbar = (toolbar) => {
//     const goToBack = () => {
//         toolbar.onNavigate(Navigate.PREVIOUS);
//     };

//     const goToNext = () => {
//         toolbar.onNavigate(Navigate.NEXT);
//     };

//     const goToToday = () => {
//         toolbar.onNavigate(Navigate.TODAY);
//     };

//     return (
//         <div className="rbc-toolbar">
//             <span className="rbc-btn-group">
//                 <Button type="default" onClick={goToBack} icon={<LeftOutlined />} />
//                 <Button type="primary" onClick={goToToday}>Today</Button>
//                 <Button type="default" onClick={goToNext} icon={<RightOutlined />} />
//             </span>
//             <span className="rbc-toolbar-label">
//                 <Text strong style={{ fontSize: 16 }}>{toolbar.label}</Text>
//             </span>
//             <span className="rbc-btn-group">
//                 {toolbar.views.map((view) => (
//                     <Button
//                         key={view}
//                         type={toolbar.view === view ? 'primary' : 'default'}
//                         onClick={() => toolbar.onView(view)}
//                     >
//                         {view.charAt(0).toUpperCase() + view.slice(1)}
//                     </Button>
//                 ))}
//             </span>
//         </div>
//     );
// };

// const CalendarView = () => {
//     const [events, setEvents] = useState([]);
//     const [holidays, setHolidays] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [selectedEvent, setSelectedEvent] = useState(null);
//     const [modalVisible, setModalVisible] = useState(false);
//     const [currentDate, setCurrentDate] = useState(new Date());
//     const [calculatedWorkingDays, setCalculatedWorkingDays] = useState(0);
//     const [userRole, setUserRole] = useState('');
//     const [insights, setInsights] = useState(null);
//     const [monthlyTotal, setMonthlyTotal] = useState('0:00');

//     useEffect(() => {
//         moment.tz.setDefault(IST_TIMEZONE);
//         fetchMonthData(currentDate);
//     }, []);

//     const convertDecimalToTime = (decimalHours) => {
//         if (!decimalHours || isNaN(decimalHours)) return '0:00';
//         const hours = Math.floor(Math.abs(decimalHours));
//         const minutes = Math.round((Math.abs(decimalHours) - hours) * 60);
//         return `${hours}:${minutes.toString().padStart(2, '0')}`;
//     };

//     const calculateMonthlyTotal = async (date) => {
//         try {
//             const startOfMonth = moment(date).startOf('month').format('YYYY-MM-DD');
//             const endOfMonth = moment(date).endOf('month').format('YYYY-MM-DD');
            
//             const attendanceData = await gettotalhoursforcalendar(startOfMonth, endOfMonth);
            
//             if (attendanceData && attendanceData.data) {
//                 let totalHours = 0;
//                 attendanceData.data.forEach(record => {
//                     totalHours += parseFloat(record.total_hours) || 0;
//                 });
//                 setMonthlyTotal(convertDecimalToTime(totalHours));
//             }
//         } catch (error) {
//             console.error('Error fetching monthly attendance:', error);
//             setMonthlyTotal('0:00');
//         }
//     };

//     const fetchMonthData = async (date) => {
//         setLoading(true);
//         try {
//             const month = moment(date).month() + 1;
//             const year = moment(date).year();

//             const eventsData = await getCalendarEvents(month, year);
//             const holidaysData = await getHolidays(year);
//             await calculateMonthlyTotal(date);
            
//             if (eventsData.role) {
//                 setUserRole(eventsData.role);
//             }

//             if (eventsData.insights) {
//                 setInsights(eventsData.insights);
//                 const workDays = Math.floor(eventsData.insights.net_working_hours / 8);
//                 setCalculatedWorkingDays(workDays);
//             }

//             const formattedEvents = [];

//             if (holidaysData.data) {
//                 holidaysData.data.forEach(holiday => {
//                     formattedEvents.push({
//                         id: `holiday-${holiday.id}`,
//                         title: `🎉 ${holiday.holiday_name}`,
//                         start: new Date(holiday.holiday_date),
//                         end: new Date(holiday.holiday_date),
//                         type: 'holiday',
//                         description: holiday.description,
//                         allDay: true
//                     });
//                 });
//             }

//             if (eventsData.data) {
//                 eventsData.data.forEach(event => {
//                     if (event.type === 'leave') {
//                         formattedEvents.push({
//                             id: `leave-${event.id}`,
//                             title: `📅 ${event.title}`,
//                             start: new Date(event.date),
//                             end: new Date(event.to_date || event.date),
//                             type: 'leave',
//                             description: event.employee_name,
//                             employeeId: event.employee_id,
//                             allDay: true
//                         });
//                     } else if (event.type === 'birthday') {
//                         formattedEvents.push({
//                             id: `birthday-${event.id}`,
//                             title: `🎂 ${event.title}`,
//                             start: new Date(event.date),
//                             end: new Date(event.date),
//                             type: 'birthday',
//                             description: event.employee_name,
//                             employeeId: event.employee_id,
//                             allDay: true
//                         });
//                     }
//                 });
//             }

//             setEvents(formattedEvents);
//             setHolidays(holidaysData.data || []);
//         } catch (error) {
//             console.error('Error fetching calendar data:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleNavigate = (date, view, action) => {
//         setCurrentDate(date);
//         fetchMonthData(date);
//     };

//     const eventStyleGetter = (event) => {
//         let backgroundColor = '#1890ff';
        
//         if (event.type === 'holiday') {
//             backgroundColor = '#f5222d';
//         } else if (event.type === 'leave') {
//             backgroundColor = '#52c41a';
//         } else if (event.type === 'birthday') {
//             backgroundColor = '#fa8c16';
//         }

//         return {
//             style: {
//                 backgroundColor,
//                 borderRadius: '4px',
//                 opacity: 0.9,
//                 color: 'white',
//                 border: '0px',
//                 display: 'block'
//             }
//         };
//     };

//     const handleSelectEvent = (event) => {
//         setSelectedEvent(event);
//         setModalVisible(true);
//     };

//     const getUpcomingHolidays = () => {
//         return holidays
//             .filter(h => moment(h.holiday_date).isSameOrAfter(moment(), 'day'))
//             .slice(0, 3);
//     };

//     const getViewTitle = () => {
//         if (userRole === 'HR' || userRole === 'SUPER ADMIN' || userRole === 'MANAGER') {
//             return 'Organization Calendar';
//         } else if (userRole === 'TL') {
//             return 'Team Calendar';
//         }
//         return 'Personal Calendar';
//     };

//     const getBadgeText = () => {
//         if (userRole === 'HR' || userRole === 'SUPER ADMIN' || userRole === 'MANAGER') {
//             return 'All Leaves';
//         } else if (userRole === 'TL') {
//             return 'Team Leaves';
//         }
//         return 'My Leaves';
//     };

//     return (
//         <div style={{ padding: '16px' }}>
//             <Row gutter={[16, 16]}>
//                 <Col xs={24} lg={18}>
//                     <Card
//                         title={
//                             <Space>
//                                 <CalendarOutlined />
//                                 <span>{getViewTitle()}</span>
//                             </Space>
//                         }
//                         extra={
//                             <Space size="large">
//                                 <Badge status="error" text="Holidays" />
//                                 <Badge status="success" text={getBadgeText()} />
//                                 <Badge status="warning" text="Birthdays" />
//                             </Space>
//                         }
//                         bordered={false}
//                     >
//                         {loading ? (
//                             <div style={{ textAlign: 'center', padding: '100px 0' }}>
//                                 <Spin size="large" tip="Loading calendar data..." />
//                             </div>
//                         ) : (
//                             <Calendar
//                                 localizer={localizer}
//                                 events={events}
//                                 startAccessor="start"
//                                 endAccessor="end"
//                                 style={{ height: 600 }}
//                                 eventPropGetter={eventStyleGetter}
//                                 onSelectEvent={handleSelectEvent}
//                                 onNavigate={handleNavigate}
//                                 date={currentDate}
//                                 views={['month', 'week', 'day', 'agenda']}
//                                 defaultView="month"
//                                 popup
//                                 components={{
//                                     toolbar: CustomToolbar
//                                 }}
//                             />
//                         )}
//                     </Card>
//                 </Col>

//                 <Col xs={24} lg={6}>
//                     {/* Fixed height scrollable container */}
//                     <div style={{ 
//                         maxHeight: 'calc(100vh - 120px)', 
//                         overflowY: 'auto',
//                         paddingRight: '8px'
//                     }}>
//                         <Space direction="vertical" size={16} style={{ width: '100%' }}>
//                             {/* Compact Holiday Card */}
//                             <Card 
//                                 title={
//                                     <Space size={8}>
//                                         <CalendarOutlined />
//                                         <span style={{ fontSize: 14 }}>Upcoming Holidays</span>
//                                     </Space>
//                                 }
//                                 size="small"
//                                 bordered={false}
//                             >
//                                 <List
//                                     size="small"
//                                     dataSource={getUpcomingHolidays()}
//                                     renderItem={(holiday) => (
//                                         <List.Item style={{ padding: '8px 0' }}>
//                                             <List.Item.Meta
//                                                 avatar={<span style={{ fontSize: 20 }}>🎉</span>}
//                                                 title={<Text strong style={{ fontSize: 13 }}>{holiday.holiday_name}</Text>}
//                                                 description={
//                                                     <Space direction="vertical" size={2}>
//                                                         <Text type="secondary" style={{ fontSize: 12 }}>
//                                                             {moment(holiday.holiday_date).format('DD MMM YYYY')}
//                                                         </Text>
//                                                         <Tag color="red" style={{ fontSize: 11 }}>
//                                                             {moment(holiday.holiday_date).format('dddd')}
//                                                         </Tag>
//                                                     </Space>
//                                                 }
//                                             />
//                                         </List.Item>
//                                     )}
//                                     locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No holidays" /> }}
//                                 />
//                             </Card>

//                             {/* Compact Monthly Summary - Show for all roles */}
//                             {insights && (
//                                 <Card 
//                                     title={
//                                         <Space size={8}>
//                                             <FieldTimeOutlined />
//                                             <span style={{ fontSize: 14 }}>Monthly Summary</span>
//                                         </Space>
//                                     }
//                                     size="small"
//                                     bordered={false}
//                                 >
//                                     <Space direction="vertical" size={12} style={{ width: '100%' }}>
//                                         <Statistic
//                                             title={<span style={{ fontSize: 12 }}>Working Days</span>}
//                                             value={calculatedWorkingDays}
//                                             suffix="days"
//                                             valueStyle={{ fontSize: 18 }}
//                                         />
//                                         <Divider style={{ margin: 0 }} />
//                                         <Statistic
//                                             title={<span style={{ fontSize: 12 }}>Expected Hours</span>}
//                                             value={insights.net_working_hours}
//                                             suffix="hrs"
//                                             valueStyle={{ fontSize: 18, color: '#1890ff' }}
//                                         />
//                                         <Divider style={{ margin: 0 }} />
//                                         <Statistic
//                                             title={<span style={{ fontSize: 12 }}>Total Logged</span>}
//                                             value={monthlyTotal}
//                                             suffix="hrs"
//                                             valueStyle={{ fontSize: 20, color: '#52c41a', fontWeight: 600 }}
//                                         />
//                                     </Space>
//                                 </Card>
//                             )}

//                             {/* Attendance Report ONLY for HR/MANAGER/SUPER ADMIN */}
//                             {/* REMOVED FOR TL VIEW */}
//                         </Space>
//                     </div>
//                 </Col>
//             </Row>

//             <Modal
//                 title={
//                     <Space>
//                         {selectedEvent?.type === 'holiday' && '🎉'}
//                         {selectedEvent?.type === 'leave' && '📅'}
//                         {selectedEvent?.type === 'birthday' && '🎂'}
//                         <span>{selectedEvent?.title}</span>
//                     </Space>
//                 }
//                 open={modalVisible}
//                 onCancel={() => setModalVisible(false)}
//                 footer={[
//                     <Button key="close" type="primary" onClick={() => setModalVisible(false)}>
//                         Close
//                     </Button>
//                 ]}
//                 width={500}
//             >
//                 {selectedEvent && (
//                     <Descriptions bordered column={1} size="small">
//                         <Descriptions.Item label="Type">
//                             <Tag color={
//                                 selectedEvent.type === 'holiday' ? 'red' : 
//                                 selectedEvent.type === 'leave' ? 'green' : 'orange'
//                             }>
//                                 {selectedEvent.type.toUpperCase()}
//                             </Tag>
//                         </Descriptions.Item>
//                         <Descriptions.Item label="Date">
//                             {moment(selectedEvent.start).format('DD MMMM YYYY')}
//                         </Descriptions.Item>
//                         {selectedEvent.end && !moment(selectedEvent.start).isSame(selectedEvent.end, 'day') && (
//                             <Descriptions.Item label="End Date">
//                                 {moment(selectedEvent.end).format('DD MMMM YYYY')}
//                             </Descriptions.Item>
//                         )}
//                         {selectedEvent.description && (
//                             <Descriptions.Item label="Details">
//                                 {selectedEvent.description}
//                             </Descriptions.Item>
//                         )}
//                     </Descriptions>
//                 )}
//             </Modal>
//         </div>
//     );
// };

// export default CalendarView;
