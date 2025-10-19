import React from 'react';
import { Layout, Button, Avatar, Dropdown } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LogoutOutlined,
    UserOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const { Header } = Layout;

const AppHeader = ({ collapsed, toggleSidebar }) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Dropdown menu items
    const menuItems = [
        {
            key: 'email',
            label: (
                <div style={{ padding: '4px 0', color: '#666', fontSize: 14 }}>
                    {user?.email}
                </div>
            ),
            disabled: true
        },
        {
            type: 'divider'
        },
        {
            key: 'logout',
            label: 'Logout',
            icon: <LogoutOutlined />,
            danger: true,
            onClick: handleLogout
        }
    ];

    return (
        <Header className="app-header" style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            height: 64
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={toggleSidebar}
                    style={{
                        fontSize: 20,
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Dropdown
                    menu={{ items: menuItems }}
                    trigger={['hover']}
                    placement="bottomRight"
                >
                    <Avatar 
                        style={{ 
                            backgroundColor: '#1890ff', 
                            cursor: 'pointer' 
                        }}
                        icon={<UserOutlined />}
                        size="default"
                    />
                </Dropdown>
            </div>
        </Header>
    );
};

export default AppHeader;
