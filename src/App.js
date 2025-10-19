



// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { ConfigProvider } from 'antd';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import Login from './pages/Login';
// import MainLayout from './components/Layout/MainLayout';
// import Dashboard from './pages/Dashboard';
// import LeavePage from './pages/LeavePage';
// import CalendarPage from './pages/CalendarPage';
// import EmployeePage from './pages/EmployeePage';
// import ProfilePage from './pages/ProfilePage';
// import RolesPage from './pages/RolesPage';
// import HolidaysPage from './pages/HolidaysPage';
// import LeaveTypesPage from './pages/LeaveTypesPage';
// import DepartmentPage from './pages/DepartmentPage';
// import AttendancePage from './pages/AttendancePage';
// import TeamsPage from './pages/TeamsPage';
// import MyTeamPage from './pages/MyTeamPage';
// import './App.css';

// const PrivateRoute = ({ children }) => {
//     const { user, loading } = useAuth();

//     if (loading) {
//         return (
//             <div style={{ 
//                 display: 'flex', 
//                 justifyContent: 'center', 
//                 alignItems: 'center', 
//                 height: '100vh' 
//             }}>
//                 Loading...
//             </div>
//         );
//     }

//     return user ? children : <Navigate to="/login" />;
// };

// function App() {
//     return (
//         <ConfigProvider
//             theme={{
//                 token: {
//                     colorPrimary: '#1890ff',
//                 }
//             }}
//         >
//             <AuthProvider>
//                 <BrowserRouter>
//                     <Routes>
//                         <Route path="/login" element={<Login />} />
//                         <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
//                             <Route index element={<Navigate to="/dashboard" />} />
//                             <Route path="dashboard" element={<Dashboard />} />
//                             <Route path="employees" element={<EmployeePage />} />
                            
//                             {/* Team Routes */}
//                             <Route path="my-team" element={<MyTeamPage />} />
//                             <Route path="teams" element={<TeamsPage />} />
                            
//                             {/* Attendance */}
//                             <Route path="attendance" element={<AttendancePage />} />
                            
//                             {/* Leave Management */}
//                             <Route path="leaves" element={<LeavePage />} />
//                             <Route path="leave-types" element={<LeaveTypesPage />} />
                            
//                             {/* Calendar & Holidays */}
//                             <Route path="calendar" element={<CalendarPage />} />
//                             <Route path="holidays" element={<HolidaysPage />} />
                            
//                             {/* Settings */}
//                             <Route path="departments" element={<DepartmentPage />} />
//                             <Route path="roles" element={<RolesPage />} />
//                             <Route path="profile" element={<ProfilePage />} />
//                         </Route>
//                     </Routes>
//                 </BrowserRouter>
//             </AuthProvider>
//         </ConfigProvider>
//     );
// }

// export default App;



import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import LeavePage from './pages/LeavePage';
import CalendarPage from './pages/CalendarPage';
import EmployeePage from './pages/EmployeePage';
import ProfilePage from './pages/ProfilePage';
import RolesPage from './pages/RolesPage';
import HolidaysPage from './pages/HolidaysPage';
import LeaveTypesPage from './pages/LeaveTypesPage';
import DepartmentPage from './pages/DepartmentPage';
import AttendancePage from './pages/AttendancePage';
import TeamsPage from './pages/TeamsPage';
import MyTeamPage from './pages/MyTeamPage';
import AnnouncementPage from './pages/AnnouncementPage';
import './App.css';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh' 
            }}>
                Loading...
            </div>
        );
    }

    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#1890ff',
                }
            }}
        >
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
                            <Route index element={<Navigate to="/dashboard" />} />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="employees" element={<EmployeePage />} />
                            
                            {/* Team Routes */}
                            <Route path="my-team" element={<MyTeamPage />} />
                            <Route path="teams" element={<TeamsPage />} />
                            
                            {/* Attendance */}
                            <Route path="attendance" element={<AttendancePage />} />
                            
                            {/* Leave Management */}
                            <Route path="leaves" element={<LeavePage />} />
                            <Route path="leave-types" element={<LeaveTypesPage />} />
                            
                            {/* Calendar & Holidays */}
                            <Route path="calendar" element={<CalendarPage />} />
                            <Route path="holidays" element={<HolidaysPage />} />
                            
                            {/* Announcements */}
                            <Route path="announcements" element={<AnnouncementPage />} />
                            
                            {/* Settings */}
                            <Route path="departments" element={<DepartmentPage />} />
                            <Route path="roles" element={<RolesPage />} />
                            <Route path="profile" element={<ProfilePage />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ConfigProvider>
    );
}

export default App;
