import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Card, Badge, List, Spin, Row, Col, Tag, Modal } from 'antd';
import { getCalendarEvents, getHolidays } from '../../services/calendarService';
import 'react-big-calendar/lib/css/react-big-calendar.css';


const localizer = momentLocalizer(moment);

const CalendarView = () => {
    const [events, setEvents] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const currentMonth = moment().month() + 1;
            const currentYear = moment().year();

            // Fetch calendar events
            const eventsData = await getCalendarEvents(currentMonth, currentYear);
            
            // Fetch holidays
            const holidaysData = await getHolidays(currentYear);
            
            // Transform events for React Big Calendar
            const formattedEvents = [];

            // Add holidays
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

            // Add leaves and other events
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

    const eventStyleGetter = (event) => {
        let backgroundColor = '#3174ad';
        
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
                borderRadius: '5px',
                opacity: 0.8,
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
            .slice(0, 5);
    };

    return (
        <div>
            <Row gutter={16}>
                <Col xs={24} lg={18}>
                    <Card
                        extra={
                            <div>
                                <Badge status="error" text="Holidays" style={{ marginRight: 16 }} />
                                <Badge status="success" text="Leaves" style={{ marginRight: 16 }} />
                                <Badge status="warning" text="Birthdays" />
                            </div>
                        }
                    >
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: 100 }}>
                                <Spin size="large" />
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
                                views={['month', 'week', 'day', 'agenda']}
                                defaultView="month"
                                popup
                            />
                        )}
                    </Card>
                </Col>

                <Col xs={24} lg={6}>
                    <Card title="Upcoming Holidays" style={{ marginBottom: 16 }}>
                        <List
                            size="small"
                            dataSource={getUpcomingHolidays()}
                            renderItem={(holiday) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<span style={{ fontSize: 20 }}>🎉</span>}
                                        title={holiday.holiday_name}
                                        description={
                                            <>
                                                <div>{moment(holiday.holiday_date).format('DD MMM YYYY')}</div>
                                                <Tag color="red">{moment(holiday.holiday_date).format('dddd')}</Tag>
                                            </>
                                        }
                                    />
                                </List.Item>
                            )}
                            locale={{ emptyText: 'No upcoming holidays' }}
                        />
                    </Card>

                    <Card title="Legend">
                        <div style={{ marginBottom: 8 }}>
                            <Badge status="error" text="Public Holidays" />
                        </div>
                        <div style={{ marginBottom: 8 }}>
                            <Badge status="success" text="Approved Leaves" />
                        </div>
                        <div>
                            <Badge status="warning" text="Employee Birthdays" />
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Event Details Modal */}
            <Modal
                title={selectedEvent?.title}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
            >
                {selectedEvent && (
                    <div>
                        <p><strong>Type:</strong> {selectedEvent.type}</p>
                        <p><strong>Date:</strong> {moment(selectedEvent.start).format('DD MMMM YYYY')}</p>
                        {selectedEvent.end && !moment(selectedEvent.start).isSame(selectedEvent.end, 'day') && (
                            <p><strong>End Date:</strong> {moment(selectedEvent.end).format('DD MMMM YYYY')}</p>
                        )}
                        {selectedEvent.description && (
                            <p><strong>Description:</strong> {selectedEvent.description}</p>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CalendarView;
