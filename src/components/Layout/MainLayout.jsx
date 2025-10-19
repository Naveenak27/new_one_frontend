// import React, { useState, useEffect } from 'react';
// import { Layout, Menu } from 'antd';
// import {
//     DashboardOutlined,
//     TeamOutlined,
//     CalendarOutlined,
//     FileTextOutlined,
//     UserOutlined,
//     LogoutOutlined,
//     SafetyOutlined,
//     CalendarTwoTone,
//     FolderOpenOutlined,
//     ClockCircleOutlined
// } from '@ant-design/icons';
// import { useNavigate, Outlet, useLocation } from 'react-router-dom';
// import { logout, getUserPermissions } from '../../services/authService';
// import { useAuth } from '../../context/AuthContext';
// import { hasPermission } from '../../services/authService';

// const { Header, Sider, Content } = Layout;

// const MainLayout = () => {
//     const [collapsed, setCollapsed] = useState(false);
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { user } = useAuth();
//     const [selectedKey, setSelectedKey] = useState('dashboard');

//     useEffect(() => {
//         // Update selected menu based on current path
//         const path = location.pathname.split('/')[1] || 'dashboard';
//         setSelectedKey(path);
//     }, [location]);

//     useEffect(() => {
//         // Debug permissions
//         const permissions = getUserPermissions();
//         console.log('=== MainLayout Debug ===');
//         console.log('Current User:', user);
//         console.log('All Permissions:', permissions);
//         console.log('Role Name:', user?.role_name);
        
//         // Check specific permissions
//         console.log('Has employees view?', hasPermission('employees', 'view'));
//         console.log('Has leaves view?', hasPermission('leaves', 'view'));
//         console.log('Has holidays view?', hasPermission('holidays', 'view'));
//         console.log('Has attendance view?', hasPermission('attendance', 'view'));
//     }, [user]);

//     const handleLogout = () => {
//         logout();
//         navigate('/login');
//     };

//     const getMenuItems = () => {
//         const role = user?.role_name;
//         const items = [];

//         console.log('Building menu for role:', role);

//         // Dashboard - Everyone
//         items.push({
//             key: 'dashboard',
//             icon: <DashboardOutlined />,
//             label: 'Dashboard',
//             onClick: () => navigate('/dashboard')
//         });

//         // Employees - HR, Manager, Superadmin
//         const canViewEmployees = role === 'superadmin' || 
//                                  role === 'hr' || 
//                                  role === 'manager' || 
//                                  hasPermission('employees', 'view');
        
//         console.log('Can view employees?', canViewEmployees);
        
//         if (canViewEmployees) {
//             items.push({
//                 key: 'employees',
//                 icon: <TeamOutlined />,
//                 label: 'Employees',
//                 onClick: () => navigate('/employees')
//             });
//         }

//         // Leave Management - Everyone
//         items.push({
//             key: 'leaves',
//             icon: <FileTextOutlined />,
//             label: 'Leave Management',
//             onClick: () => navigate('/leaves')
//         });

//         // Attendance - Everyone (with permission check)
//         const canViewAttendance = role === 'superadmin' || 
//                                   role === 'hr' || 
//                                   role === 'manager' ||
//                                   role === 'tl' ||
//                                   role === 'employee' ||
//                                   hasPermission('attendance', 'view');

//         console.log('Can view attendance?', canViewAttendance);

//         if (canViewAttendance) {
//             items.push({
//                 key: 'attendance',
//                 icon: <ClockCircleOutlined />,
//                 label: 'Attendance',
//                 onClick: () => navigate('/attendance')
//             });
//         }

//         // Calendar - Everyone
//         items.push({
//             key: 'calendar',
//             icon: <CalendarOutlined />,
//             label: 'Calendar',
//             onClick: () => navigate('/calendar')
//         });

//         // Holidays - HR, Manager, Superadmin
//         const canViewHolidays = role === 'superadmin' || 
//                                role === 'hr' || 
//                                role === 'manager' || 
//                                hasPermission('holidays', 'view');
        
//         console.log('Can view holidays?', canViewHolidays);
        
//         if (canViewHolidays) {
//             items.push({
//                 key: 'holidays',
//                 icon: <CalendarTwoTone />,
//                 label: 'Holidays',
//                 onClick: () => navigate('/holidays')
//             });
//         }

//         // Leave Types - Superadmin, HR
//         const canViewLeaveTypes = role === 'superadmin' || 
//                                   role === 'hr' || 
//                                   hasPermission('leave_types', 'view');
        
//         console.log('Can view leave types?', canViewLeaveTypes);
        
//         if (canViewLeaveTypes) {
//             items.push({
//                 key: 'leave-types',
//                 icon: <FolderOpenOutlined />,
//                 label: 'Leave Types',
//                 onClick: () => navigate('/leave-types')
//             });
//         }

//         // Role Management - Superadmin only
//         if (role === 'superadmin') {
//             items.push({
//                 key: 'roles',
//                 icon: <SafetyOutlined />,
//                 label: 'Role Management',
//                 onClick: () => navigate('/roles')
//             });
//         }

//         // Profile - Everyone
//         items.push({
//             key: 'profile',
//             icon: <UserOutlined />,
//             label: 'Profile',
//             onClick: () => navigate('/profile')
//         });

//         console.log('Final menu items:', items.map(i => i.label));
//         return items;
//     };

//     return (
//         <Layout style={{ minHeight: '100vh' }}>
//             <Sider 
//                 collapsible 
//                 collapsed={collapsed} 
//                 onCollapse={setCollapsed}
//                 theme="dark"
//             >
//                 <div className="logo">
//                     <h2>{collapsed ? 'HR' : 'HR Management'}</h2>
//                 </div>
//                 <Menu
//                     theme="dark"
//                     mode="inline"
//                     selectedKeys={[selectedKey]}
//                     items={getMenuItems()}
//                 />
//             </Sider>
//             <Layout>
//                 <Header className="site-layout-header">
//                     <div className="header-content">
//                         <div>
//                             <h3>Welcome, {user?.name}</h3>
//                             <span style={{ fontSize: 12, color: '#999' }}>
//                                 Role: <strong>{user?.role_name?.toUpperCase()}</strong>
//                             </span>
//                         </div>
//                         <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
//                             <span style={{ fontSize: 14 }}>{user?.email}</span>
//                             <LogoutOutlined 
//                                 onClick={handleLogout}
//                                 style={{ fontSize: 18, cursor: 'pointer', color: '#ff4d4f' }}
//                                 title="Logout"
//                             />
//                         </div>
//                     </div>
//                 </Header>
//                 <Content className="site-layout-content">
//                     <Outlet />
//                 </Content>
//             </Layout>
//         </Layout>
//     );
// };

// export default MainLayout;


import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import AppHeader from './Header';


const { Content } = Layout;

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const [selectedKey, setSelectedKey] = useState('dashboard');

    useEffect(() => {
        const path = location.pathname.split('/')[1] || 'dashboard';
        setSelectedKey(path);
    }, [location]);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sidebar 
                collapsed={collapsed} 
                setCollapsed={setCollapsed}
                selectedKey={selectedKey}
            />
            <Layout className="site-layout">
                <AppHeader 
                    collapsed={collapsed}
                    toggleSidebar={toggleSidebar}
                />
                <Content className="site-layout-content">
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
