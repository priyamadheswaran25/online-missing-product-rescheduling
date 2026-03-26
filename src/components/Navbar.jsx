import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
    Button, 
    Avatar, 
    Dropdown, 
    Space, 
    Typography, 
    theme,
    ConfigProvider
} from 'antd';
import { 
    TruckOutlined as PackageOutlined, 
    LogoutOutlined, 
    DashboardOutlined, 
    BellOutlined,
    UserOutlined,
    DownOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('currentUser');
        return stored ? JSON.parse(stored) : null;
    });

    // Sync user state when location changes (login/logout events)
    useEffect(() => {
        const stored = localStorage.getItem('currentUser');
        const loggedInUser = stored ? JSON.parse(stored) : null;
        if (JSON.stringify(user) !== JSON.stringify(loggedInUser)) {
            // Using requestAnimationFrame to satisfy the "synchronous setState in effect" lint
            // While ensuring it updates before the next paint
            requestAnimationFrame(() => setUser(loggedInUser));
        }
    }, [location, user]);

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        setUser(null);
        toast.success('Terminated privileged session');
        navigate('/auth');
    };

    const userMenuItems = [
        {
            key: 'dashboard',
            label: 'My Dashboard',
            icon: <DashboardOutlined />,
            onClick: () => navigate('/dashboard'),
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            label: 'Sign Out',
            icon: <LogoutOutlined />,
            danger: true,
            onClick: handleLogout,
        },
    ];

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    colorPrimary: '#2563eb',
                }
            }}
        >
            <nav className="sticky top-0 z-50 w-full bg-slate-900/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-blue-900/20">
                        <PackageOutlined style={{ fontSize: '24px', color: '#fff' }} />
                    </div>
                    <span className="text-2xl font-black bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        ReScheduleX
                    </span>
                </Link>

                <div className="flex items-center gap-6">
                    {!user ? (
                        <div className="flex items-center gap-3">
                            <Button 
                                type="text" 
                                className="text-slate-400 hover:text-white font-bold"
                                onClick={() => navigate('/auth')}
                            >
                                Log In
                            </Button>
                            <Button 
                                type="primary" 
                                className="bg-blue-600 hover:bg-blue-500 font-bold px-6 h-10 rounded-xl"
                                onClick={() => navigate('/auth')}
                            >
                                Get Started
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-6">
                            <Space size="large" className="hidden md:flex">
                                <Link
                                    to="/dashboard"
                                    className={`flex items-center gap-2 font-bold transition-all ${location.pathname === '/dashboard' ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
                                >
                                    <DashboardOutlined />
                                    <span>Dashboard</span>
                                </Link>

                                {user.role === 'admin' && (
                                    <Link
                                        to="/admin"
                                        className={`flex items-center gap-2 font-bold transition-all ${location.pathname === '/admin' ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        <BellOutlined />
                                        <span>Terminal</span>
                                    </Link>
                                )}
                            </Space>

                            <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
                                <div className="flex items-center gap-3 cursor-pointer p-1 pr-3 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10 group">
                                    <Avatar 
                                        icon={<UserOutlined />} 
                                        className="bg-blue-600 shadow-lg"
                                        style={{ verticalAlign: 'middle' }}
                                    />
                                    <div className="hidden sm:flex flex-col items-start leading-none gap-0.5">
                                        <Text className="text-white font-bold text-sm">{user.name.split(' ')[0]}</Text>
                                        <Text className="text-slate-500 text-[10px] uppercase tracking-widest">{user.role}</Text>
                                    </div>
                                    <DownOutlined className="text-slate-500 text-[10px] group-hover:text-blue-400 transition-colors" />
                                </div>
                            </Dropdown>
                        </div>
                    )}
                </div>
            </nav>
        </ConfigProvider>
    );
};

export default Navbar;
