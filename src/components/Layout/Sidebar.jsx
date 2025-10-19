// import React from 'react';
// import { Layout, Menu } from 'antd';
// import {
//     DashboardOutlined,
//     TeamOutlined,
//     CalendarOutlined,
//     FileTextOutlined,
//     UserOutlined,
//     SafetyOutlined,
//     CalendarTwoTone,
//     FolderOpenOutlined,
//     ClockCircleOutlined,
//     UsergroupAddOutlined,
//     ApartmentOutlined
// } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';
// import { hasPermission } from '../../services/authService';
// import { useAuth } from '../../context/AuthContext';

// const { Sider } = Layout;

// const Sidebar = ({ collapsed, setCollapsed, selectedKey }) => {
//     const navigate = useNavigate();
//     const { user } = useAuth();

//     const getMenuItems = () => {
//         const role = user?.role_name;
//         const items = [];

//         // Dashboard - Always visible
//         items.push({
//             key: 'dashboard',
//             icon: <DashboardOutlined />,
//             label: 'Dashboard',
//             onClick: () => navigate('/dashboard')
//         });

//         // Employees - Only if has view permission
//         if (hasPermission('employees', 'view')) {
//             items.push({
//                 key: 'employees',
//                 icon: <TeamOutlined />,
//                 label: 'Employees',
//                 onClick: () => navigate('/employees')
//             });
//         }

//         // My Team - For managers, TL, HR, superadmin
//         if (['manager', 'tl', 'hr', 'superadmin'].includes(role)) {
//             items.push({
//                 key: 'my-team',
//                 icon: <UsergroupAddOutlined />,
//                 label: 'My Team',
//                 onClick: () => navigate('/my-team')
//             });
//         }

//         // All Teams - For HR and superadmin only
//         if (['hr', 'superadmin'].includes(role)) {
//             items.push({
//                 key: 'teams',
//                 icon: <ApartmentOutlined />,
//                 label: 'Teams',
//                 onClick: () => navigate('/teams')
//             });
//         }

//         // Attendance - Only if has view permission
//         if (hasPermission('attendance', 'view')) {
//             items.push({
//                 key: 'attendance',
//                 icon: <ClockCircleOutlined />,
//                 label: 'Attendance',
//                 onClick: () => navigate('/attendance')
//             });
//         }

//         // Leave Management - Only if has view permission
//         if (hasPermission('leaves', 'view')) {
//             items.push({
//                 key: 'leaves',
//                 icon: <FileTextOutlined />,
//                 label: 'Leave Management',
//                 onClick: () => navigate('/leaves')
//             });
//         }

//         // Calendar - Only if has view permission
//         if (hasPermission('calendar', 'view')) {
//             items.push({
//                 key: 'calendar',
//                 icon: <CalendarOutlined />,
//                 label: 'Calendar',
//                 onClick: () => navigate('/calendar')
//             });
//         }

//         // Holidays - Only if has view permission
//         if (hasPermission('holidays', 'view')) {
//             items.push({
//                 key: 'holidays',
//                 icon: <CalendarTwoTone />,
//                 label: 'Holidays',
//                 onClick: () => navigate('/holidays')
//             });
//         }

//         // Leave Types - Only if has view permission
//         if (hasPermission('leave_types', 'view')) {
//             items.push({
//                 key: 'leave-types',
//                 icon: <FolderOpenOutlined />,
//                 label: 'Leave Types',
//                 onClick: () => navigate('/leave-types')
//             });
//         }

//         // Departments - Only if has view permission
//         if (hasPermission('departments', 'view')) {
//             items.push({
//                 key: 'departments',
//                 icon: <ApartmentOutlined />,
//                 label: 'Departments',
//                 onClick: () => navigate('/departments')
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

//         // Profile - Always visible
//         items.push({
//             key: 'profile',
//             icon: <UserOutlined />,
//             label: 'Profile',
//             onClick: () => navigate('/profile')
//         });

//         return items;
//     };

//     return (
//         <Sider 
//             collapsible 
//             collapsed={collapsed} 
//             onCollapse={setCollapsed}
//             theme="dark"
//             breakpoint="lg"
//             collapsedWidth="60"
//             width={280}
//             className="sidebar"
//             style={{
//                 overflow: 'auto',
//                 height: '100vh',
//                 position: 'sticky',
//                 top: 0,
//                 left: 0
//             }}
//         >
//             <div className="logo" style={{ 
//                 height: 64, 
//                 display: 'flex', 
//                 alignItems: 'center', 
//                 justifyContent: 'center',
//                 borderBottom: '1px solid rgba(255,255,255,0.1)'
//             }}>
//                 <h2 style={{ 
//                     color: '#fff', 
//                     margin: 0, 
//                     fontSize: collapsed ? 16 : 20,
//                     fontWeight: 600
//                 }}>
//                     {collapsed ? 'HR' : 'HR Management'}
//                 </h2>
//             </div>
//             <Menu
//                 theme="dark"
//                 mode="inline"
//                 selectedKeys={[selectedKey]}
//                 items={getMenuItems()}
//                 style={{ borderRight: 0 }}
//             />
//         </Sider>
//     );
// };

// export default Sidebar;




// // import React, { useEffect } from 'react';
// // import { Layout, Menu } from 'antd';
// // import {
// //     DashboardOutlined,
// //     TeamOutlined,
// //     CalendarOutlined,
// //     FileTextOutlined,
// //     UserOutlined,
// //     SafetyOutlined,
// //     CalendarTwoTone,
// //     FolderOpenOutlined,
// //     ClockCircleOutlined
// // } from '@ant-design/icons';
// // import { useNavigate } from 'react-router-dom';
// // import { hasPermission } from '../../services/authService';
// // import { useAuth } from '../../context/AuthContext';


// // const { Sider } = Layout;


// // const Sidebar = ({ collapsed, setCollapsed, selectedKey }) => {
// //     const navigate = useNavigate();
// //     const { user } = useAuth();


// //     const getMenuItems = () => {
// //         const role = user?.role_name;
// //         const items = [];


// //         // Dashboard - Always visible
// //         items.push({
// //             key: 'dashboard',
// //             icon: <DashboardOutlined />,
// //             label: 'Dashboard',
// //             onClick: () => navigate('/dashboard')
// //         });


// //         // Employees - Only if has view permission
// //         if (hasPermission('employees', 'view')) {
// //             items.push({
// //                 key: 'employees',
// //                 icon: <TeamOutlined />,
// //                 label: 'Employees',
// //                 onClick: () => navigate('/employees')
// //             });
// //         }


// //         // Leave Management - Only if has view permission
// //         if (hasPermission('leaves', 'view')) {
// //             items.push({
// //                 key: 'leaves',
// //                 icon: <FileTextOutlined />,
// //                 label: 'Leave Management',
// //                 onClick: () => navigate('/leaves')
// //             });
// //         }


// //         // Attendance - Only if has view permission
// //         if (hasPermission('attendance', 'view')) {
// //             items.push({
// //                 key: 'attendance',
// //                 icon: <ClockCircleOutlined />,
// //                 label: 'Attendance',
// //                 onClick: () => navigate('/attendance')
// //             });
// //         }


// //         // Calendar - Only if has view permission
// //         if (hasPermission('calendar', 'view')) {
// //             items.push({
// //                 key: 'calendar',
// //                 icon: <CalendarOutlined />,
// //                 label: 'Calendar',
// //                 onClick: () => navigate('/calendar')
// //             });
// //         }


// //         // Holidays - Only if has view permission
// //         if (hasPermission('holidays', 'view')) {
// //             items.push({
// //                 key: 'holidays',
// //                 icon: <CalendarTwoTone />,
// //                 label: 'Holidays',
// //                 onClick: () => navigate('/holidays')
// //             });
// //         }


// //         // Leave Types - Only if has view permission
// //         if (hasPermission('leave_types', 'view')) {
// //             items.push({
// //                 key: 'leave-types',
// //                 icon: <FolderOpenOutlined />,
// //                 label: 'Leave Types',
// //                 onClick: () => navigate('/leave-types')
// //             });
// //         }


// //         // Departments - Only if has view permission
// //         if (hasPermission('departments', 'view')) {
// //             items.push({
// //                 key: 'departments',
// //                 icon: <TeamOutlined />,
// //                 label: 'Departments',
// //                 onClick: () => navigate('/departments')
// //             });
// //         }


// //         // Role Management - Superadmin only
// //         if (role === 'superadmin') {
// //             items.push({
// //                 key: 'roles',
// //                 icon: <SafetyOutlined />,
// //                 label: 'Role Management',
// //                 onClick: () => navigate('/roles')
// //             });
// //         }


// //         // Profile - Always visible
// //         items.push({
// //             key: 'profile',
// //             icon: <UserOutlined />,
// //             label: 'Profile',
// //             onClick: () => navigate('/profile')
// //         });


// //         return items;
// //     };


// //     return (
// //         <Sider 
// //             collapsible 
// //             collapsed={collapsed} 
// //             onCollapse={setCollapsed}
// //             theme="dark"
// //             breakpoint="lg"
// //             collapsedWidth="60"
// //             width={280}
// //             className="sidebar"
// //             style={{
// //                 overflow: 'auto',
// //                 height: '100vh',
// //                 position: 'sticky',
// //                 top: 0,
// //                 left: 0
// //             }}
// //         >
// //             <div className="logo" style={{ 
// //                 height: 64, 
// //                 display: 'flex', 
// //                 alignItems: 'center', 
// //                 justifyContent: 'center',
// //                 borderBottom: '1px solid rgba(255,255,255,0.1)'
// //             }}>
// //                 <h2 style={{ 
// //                     color: '#fff', 
// //                     margin: 0, 
// //                     fontSize: collapsed ? 16 : 20,
// //                     fontWeight: 600
// //                 }}>
// //                     {collapsed ? 'HR' : 'HR Management'}
// //                 </h2>
// //             </div>
// //             <Menu
// //                 theme="dark"
// //                 mode="inline"
// //                 selectedKeys={[selectedKey]}
// //                 items={getMenuItems()}
// //                 style={{ borderRight: 0 }}
// //             />
// //         </Sider>
// //     );
// // };


// // export default Sidebar;



import React from 'react';
import { Layout, Menu } from 'antd';
import {
    DashboardOutlined,
    TeamOutlined,
    CalendarOutlined,
    FileTextOutlined,
    UserOutlined,
    SafetyOutlined,
    CalendarTwoTone,
    FolderOpenOutlined,
    ClockCircleOutlined,
    UsergroupAddOutlined,
    ApartmentOutlined,
    MailOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { hasPermission } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const { Sider } = Layout;

const Sidebar = ({ collapsed, setCollapsed, selectedKey }) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const getMenuItems = () => {
        const role = user?.role_name;
        const items = [];

        // Dashboard - Always visible
        items.push({
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            onClick: () => navigate('/dashboard')
        });

        // Employees - Only if has view permission
        if (hasPermission('employees', 'view')) {
            items.push({
                key: 'employees',
                icon: <TeamOutlined />,
                label: 'Employees',
                onClick: () => navigate('/employees')
            });
        }

        // My Team - For managers, TL, HR, superadmin
        if (['manager', 'tl', 'hr', 'superadmin'].includes(role)) {
            items.push({
                key: 'my-team',
                icon: <UsergroupAddOutlined />,
                label: 'My Team',
                onClick: () => navigate('/my-team')
            });
        }

        // All Teams - For HR and superadmin only
        if (['hr', 'superadmin'].includes(role)) {
            items.push({
                key: 'teams',
                icon: <ApartmentOutlined />,
                label: 'Teams',
                onClick: () => navigate('/teams')
            });
        }

        // Attendance - Only if has view or edit permission
        if (hasPermission('attendance', 'view') || hasPermission('attendance', 'edit')) {
            items.push({
                key: 'attendance',
                icon: <ClockCircleOutlined />,
                label: 'Attendance',
                onClick: () => navigate('/attendance')
            });
        }

        // Leave Management - Only if has view permission
        if (hasPermission('leaves', 'view')) {
            items.push({
                key: 'leaves',
                icon: <FileTextOutlined />,
                label: 'Leave Management',
                onClick: () => navigate('/leaves')
            });
        }

        // Announcements - Only if has view permission
        if (hasPermission('announcements', 'view')) {
            items.push({
                key: 'announcements',
                icon: <MailOutlined />,
                label: 'Announcements',
                onClick: () => navigate('/announcements')
            });
        }

        // Calendar - Only if has view permission
        if (hasPermission('calendar', 'view')) {
            items.push({
                key: 'calendar',
                icon: <CalendarOutlined />,
                label: 'Calendar',
                onClick: () => navigate('/calendar')
            });
        }

        // Holidays - Only if has view permission
        if (hasPermission('holidays', 'view')) {
            items.push({
                key: 'holidays',
                icon:<CalendarTwoTone twoToneColor="#ffffff" />,
                label: 'Holidays',
                onClick: () => navigate('/holidays')
            });
        }

        // Leave Types - Only if has view permission
        if (hasPermission('leave_types', 'view')) {
            items.push({
                key: 'leave-types',
                icon: <FolderOpenOutlined />,
                label: 'Leave Types',
                onClick: () => navigate('/leave-types')
            });
        }

        // Departments - Only if has view permission
        if (hasPermission('departments', 'view')) {
            items.push({
                key: 'departments',
                icon: <ApartmentOutlined />,
                label: 'Departments',
                onClick: () => navigate('/departments')
            });
        }

        // Role Management - Superadmin only
        if (role === 'superadmin') {
            items.push({
                key: 'roles',
                icon: <SafetyOutlined />,
                label: 'Role Management',
                onClick: () => navigate('/roles')
            });
        }

        // Profile - Always visible
        items.push({
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Profile',
            onClick: () => navigate('/profile')
        });

        return items;
    };

    return (
        <Sider 
            collapsible 
            collapsed={collapsed} 
            onCollapse={setCollapsed}
            theme="dark"
            breakpoint="lg"
            collapsedWidth="60"
            width={280}
            className="sidebar"
            style={{
                overflow: 'auto',
                height: '100vh',
                position: 'sticky',
                top: 0,
                left: 0
            }}
        >
            <div className="logo" style={{ 
                height: 64, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <h2 style={{ 
                    color: '#fff', 
                    margin: 0, 
                    fontSize: collapsed ? 16 : 20,
                    fontWeight: 600
                }}>
                    {collapsed ? 'HR' : 'HR Management'}
                </h2>
            </div>
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[selectedKey]}
                items={getMenuItems()}
                style={{ borderRight: 0 }}
            />
        </Sider>
    );
};

export default Sidebar;

