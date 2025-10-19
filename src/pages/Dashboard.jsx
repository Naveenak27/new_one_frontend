import React from 'react';
import { useAuth } from '../context/AuthContext';
import SuperadminDashboard from '../components/Dashboard/SuperadminDashboard';
import HRDashboard from '../components/Dashboard/HRDashboard';
import ManagerDashboard from '../components/Dashboard/ManagerDashboard';
import TLDashboard from '../components/Dashboard/TLDashboard';
import EmployeeDashboard from '../components/Dashboard/EmployeeDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    const renderDashboard = () => {
        switch (user?.role_name) {
            case 'superadmin':
                return <SuperadminDashboard />;
            case 'hr':
                return <HRDashboard />;
            case 'manager':
                return <ManagerDashboard />;
            case 'tl':
                return <TLDashboard />;
            case 'employee':
                return <EmployeeDashboard />;
            default:
                return <EmployeeDashboard />;
        }
    };

    return <div>{renderDashboard()}</div>;
};

export default Dashboard;
