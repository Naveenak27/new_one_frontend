import React, { useState, useEffect } from 'react';
import { Tabs, Card, Row, Col, Statistic, Space, Button, message, Spin, Badge, Progress } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import LeaveApplicationForm from '../components/Leave/LeaveApplicationForm';
import MyLeaves from '../components/Leave/MyLeaves';
import PendingLeaves from '../components/Leave/PendingLeaves';
import AllLeaves from '../pages/AllLeaves';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const LeavePage = () => {
    const { user } = useAuth();
    const [refreshKey, setRefreshKey] = useState(0);
    const [leaveBalance, setLeaveBalance] = useState([]);
    const [loading, setLoading] = useState(false);
    const [crediting, setCrediting] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);

    const isEmployee = user?.role_name === 'employee';
    const isApprover = ['hr', 'manager', 'tl', 'superadmin'].includes(user?.role_name);
    const isHR = ['hr', 'superadmin'].includes(user?.role_name);

    useEffect(() => {
        console.log('User role:', user?.role_name);
        console.log('Is Employee:', isEmployee);
        if (isEmployee) {
            fetchLeaveBalance();
        }
        if (isApprover) {
            fetchPendingCount();
        }
    }, [refreshKey, user]);

    const fetchLeaveBalance = async () => {
        setLoading(true);
        try {
            console.log('Fetching leave balance...');
            const response = await api.get('/leaves/balance');
            console.log('Leave balance response:', response.data);
            setLeaveBalance(response.data.data || []);
            
            if (response.data.data.length === 0) {
                message.warning('No leave balance found. Please contact HR to credit leaves.');
            }
        } catch (error) {
            console.error('Error fetching leave balance:', error);
            message.error('Failed to fetch leave balance: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingCount = async () => {
        try {
            const response = await api.get('/leaves/pending');
            setPendingCount(response.data?.data?.length || 0);
        } catch (error) {
            console.error('Error fetching pending count:', error);
        }
    };

    const creditMonthlyLeaves = async () => {
        setCrediting(true);
        try {
            const response = await api.post('/leaves/credit-monthly');
            message.success(response.data.message || 'Monthly leaves credited successfully!');
            if (isEmployee) {
                fetchLeaveBalance();
            }
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            console.error('Credit error:', error);
            message.error('Failed to credit leaves: ' + (error.response?.data?.message || error.message));
        } finally {
            setCrediting(false);
        }
    };

    // Calculate percentage for progress bar
    const getUsagePercentage = (used, credited, carriedForward = 0) => {
        const total = Number(credited) + Number(carriedForward);
        if (total === 0) return 0;
        return Math.round((Number(used) / total) * 100);
    };

    // Get color based on remaining balance
    const getBalanceColor = (balance, total) => {
        const percentage = (balance / total) * 100;
        if (percentage > 50) return '#52c41a'; // Green
        if (percentage > 25) return '#faad14'; // Orange
        return '#ff4d4f'; // Red
    };

    const renderLeaveBalanceCards = () => {
        if (loading) {
            return (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Spin size="large" tip="Loading leave balance..." />
                </div>
            );
        }

        if (leaveBalance.length === 0) {
            return (
                <Card 
                    style={{ 
                        marginBottom: 24,
                        textAlign: 'center',
                        padding: '20px',
                        background: '#fff7e6',
                        border: '1px solid #ffd591'
                    }}
                >
                    <p style={{ margin: 0, fontSize: '14px', color: '#d46b08' }}>
                        ⚠️ No leave balance found. Please contact HR to credit your leaves.
                    </p>
                </Card>
            );
        }

        return (
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                {leaveBalance.map(balance => {
                    const totalCredited = Number(balance.credited) + Number(balance.carried_forward || 0);
                    const availableBalance = Number(balance.balance);
                    const usedLeaves = Number(balance.used);
                    const usagePercent = getUsagePercentage(usedLeaves, balance.credited, balance.carried_forward);
                    const balanceColor = getBalanceColor(availableBalance, totalCredited);

                    return (
                        <Col key={balance.id} xs={24} sm={12} lg={8} xl={6}>
                            <Card 
                                bordered={true}
                                hoverable
                                style={{ 
                                    height: '100%',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}
                                bodyStyle={{ 
                                    padding: '20px'
                                }}
                            >
                                {/* Leave Type Name */}
                                <div style={{ 
                                    fontSize: '14px', 
                                    fontWeight: 600,
                                    color: '#1890ff',
                                    marginBottom: '8px'
                                }}>
                                    {balance.leave_name}
                                    {balance.leave_code && (
                                        <span style={{ 
                                            fontSize: '12px', 
                                            color: '#8c8c8c',
                                            marginLeft: '8px'
                                        }}>
                                            ({balance.leave_code})
                                        </span>
                                    )}
                                </div>

                                {/* Available Balance - Main Display */}
                                <div style={{ 
                                    textAlign: 'center',
                                    padding: '16px 0',
                                    borderBottom: '2px solid #f0f0f0'
                                }}>
                                    <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '4px' }}>
                                        Available Balance
                                    </div>
                                    <div style={{ 
                                        fontSize: '42px',
                                        fontWeight: 700,
                                        color: balanceColor,
                                        lineHeight: 1
                                    }}>
                                        {availableBalance}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>
                                        out of {totalCredited} days
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div style={{ marginTop: '16px' }}>
                                    <Progress 
                                        percent={usagePercent} 
                                        strokeColor={usagePercent > 75 ? '#ff4d4f' : '#1890ff'}
                                        showInfo={false}
                                        size="small"
                                    />
                                    <div style={{ 
                                        fontSize: '11px', 
                                        color: '#8c8c8c',
                                        textAlign: 'center',
                                        marginTop: '4px'
                                    }}>
                                        {usagePercent}% used
                                    </div>
                                </div>

                                {/* Breakdown Details */}
                                <div style={{ 
                                    marginTop: 16, 
                                    paddingTop: 16, 
                                    borderTop: '1px solid #f0f0f0' 
                                }}>
                                    <Space direction="vertical" size={6} style={{ width: '100%' }}>
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between',
                                            fontSize: '12px'
                                        }}>
                                            <span style={{ color: '#595959' }}>
                                                <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '4px' }} />
                                                Credited:
                                            </span>
                                            <span style={{ fontWeight: 600 }}>{balance.credited}</span>
                                        </div>
                                        
                                        {balance.carried_forward > 0 && (
                                            <div style={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-between',
                                                fontSize: '12px'
                                            }}>
                                                <span style={{ color: '#595959' }}>
                                                    <ClockCircleOutlined style={{ color: '#1890ff', marginRight: '4px' }} />
                                                    Carried Forward:
                                                </span>
                                                <span style={{ fontWeight: 600 }}>{balance.carried_forward}</span>
                                            </div>
                                        )}
                                        
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between',
                                            fontSize: '12px'
                                        }}>
                                            <span style={{ color: '#595959' }}>
                                                <CloseCircleOutlined style={{ color: '#ff4d4f', marginRight: '4px' }} />
                                                Used:
                                            </span>
                                            <span style={{ fontWeight: 600, color: '#ff4d4f' }}>{usedLeaves}</span>
                                        </div>

                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between',
                                            fontSize: '12px',
                                            paddingTop: '8px',
                                            borderTop: '1px dashed #e8e8e8',
                                            marginTop: '4px'
                                        }}>
                                            <span style={{ color: '#262626', fontWeight: 500 }}>
                                                Opening Balance:
                                            </span>
                                            <span style={{ fontWeight: 600 }}>{balance.opening_balance || 0}</span>
                                        </div>
                                    </Space>
                                </div>

                                {/* Carry Forward Badge */}
                                {balance.is_carry_forward && (
                                    <div style={{ 
                                        marginTop: '12px',
                                        textAlign: 'center'
                                    }}>
                                        <Badge 
                                            count="Carry Forward Enabled" 
                                            style={{ 
                                                backgroundColor: '#52c41a',
                                                fontSize: '10px'
                                            }} 
                                        />
                                    </div>
                                )}
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        );
    };

    const getTabItems = () => {
        if (isEmployee) {
            return [
                {
                    key: '1',
                    label: 'Apply Leave',
                    children: (
                        <>
                            {renderLeaveBalanceCards()}
                            <LeaveApplicationForm 
                                onSuccess={() => setRefreshKey(prev => prev + 1)} 
                                leaveBalance={leaveBalance}
                            />
                        </>
                    )
                },
                {
                    key: '2',
                    label: 'My Leaves',
                    children: <MyLeaves key={refreshKey} />
                }
            ];
        }

        if (isApprover) {
            return [
                {
                    key: '1',
                    label: (
                        <span>
                            Pending Approvals {pendingCount > 0 && <Badge count={pendingCount} />}
                        </span>
                    ),
                    children: <PendingLeaves key={refreshKey} onUpdate={() => {
                        setRefreshKey(prev => prev + 1);
                        fetchPendingCount();
                    }} />
                },
                {
                    key: '2',
                    label: 'All Leaves',
                    children: <AllLeaves key={refreshKey} />
                }
            ];
        }

        return [
            {
                key: '1',
                label: 'Pending Approvals',
                children: <PendingLeaves key={refreshKey} />
            }
        ];
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h1>Leave Management</h1>
                {isHR && (
                    <Button 
                        type="primary" 
                        icon={<ReloadOutlined />}
                        onClick={creditMonthlyLeaves}
                        loading={crediting}
                        size="large"
                    >
                        Credit Monthly Leaves
                    </Button>
                )}
            </div>
            <Card>
                <Tabs items={getTabItems()} />
            </Card>
        </div>
    );
};

export default LeavePage;
