import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Tabs, 
    Form, 
    Input, 
    Button, 
    Card, 
    Typography, 
    Space,
    ConfigProvider,
    theme
} from 'antd';
import { 
    UserOutlined, 
    MailOutlined, 
    PhoneOutlined, 
    LockOutlined, 
    ArrowRightOutlined,
    SafetyCertificateOutlined,
    ThunderboltFilled
} from '@ant-design/icons';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;

const AuthPortal = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('login');

    const onFinish = async (values) => {
        setIsLoading(true);
        try {
            const isLogin = activeTab === 'login';
            const endpoint = isLogin ? '/api/login' : '/api/register';
            const role = values.email === 'admin@reschedulex.com' ? 'admin' : 'user';
            
            const payload = isLogin 
                ? { email: values.email, password: values.password }
                : { ...values, role };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || 'System access denied. Please verify credentials.');
                setIsLoading(false);
                return;
            }

            if (isLogin) {
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                toast.success('Access Granted. Routing to dashboard...');
                navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
            } else {
                toast.success('Account established! Please sign in with your credentials.');
                setActiveTab('login');
                setIsLoading(false);
            }
        } catch {
            toast.error('Logistics server connection error. Retrying in background...');
            setIsLoading(false);
        }
    };

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    colorPrimary: '#2563eb',
                    borderRadius: 16,
                    colorBgContainer: 'rgba(15, 23, 42, 0.65)',
                    colorBorder: 'rgba(255, 255, 255, 0.1)',
                },
                components: {
                    Input: {
                        controlHeight: 48,
                        borderRadius: 12,
                        colorBgContainer: 'rgba(30, 41, 59, 0.5)',
                    },
                    Button: {
                        controlHeight: 48,
                        borderRadius: 12,
                        fontWeight: 700,
                    },
                    Tabs: {
                        titleFontSize: 16,
                        horizontalItemPadding: '12px 0',
                    }
                }
            }}
        >
            <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#020617] py-12">
                {/* Animated Background Mesh */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[130px] animate-[pulse_10s_infinite]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/15 blur-[130px] animate-[pulse_12s_infinite_2s]" />
                </div>

                <div className="relative z-10 w-full max-w-[480px] px-6">
                    <Card 
                        className="glass-panel border-white/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] overflow-hidden"
                        styles={{ body: { padding: '40px' } }}
                    >
                        {/* Custom Header */}
                        <div className="text-center mb-10">
                            <div className="inline-flex relative mb-6">
                                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full scale-150 animate-pulse" />
                                <div className="relative p-4 rounded-2xl bg-linear-to-br from-blue-600/20 to-indigo-600/20 text-blue-400 border border-blue-500/20">
                                    <ThunderboltFilled className="text-3xl" />
                                </div>
                            </div>
                            <Title level={2} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
                                {activeTab === 'login' ? 'ReScheduleX Hub' : 'Join Logistics'}
                            </Title>
                            <Text className="text-slate-400 font-medium block mt-2">
                                {activeTab === 'login' ? 'Secure authentication for product rescheduling' : 'Establish your enterprise logistics account'}
                            </Text>
                        </div>

                        <Tabs 
                            activeKey={activeTab} 
                            onChange={setActiveTab} 
                            centered
                            className="custom-tabs mb-6"
                            items={[
                                { key: 'login', label: 'SIGN IN' },
                                { key: 'register', label: 'REGISTER' },
                            ]}
                        />

                        <Form
                            layout="vertical"
                            onFinish={onFinish}
                            autoComplete="off"
                            requiredMark={false}
                        >
                            {activeTab === 'register' && (
                                <div className="overflow-hidden">
                                    <Form.Item
                                        name="name"
                                        rules={[{ required: true, message: 'Please input your full identity' }, { min: 3, message: 'Full identity too short' }]}
                                    >
                                        <Input 
                                            prefix={<UserOutlined className="text-slate-400 mr-2" />} 
                                            placeholder="Full Legal Name" 
                                        />
                                    </Form.Item>

                                    <Form.Item name="phone">
                                        <Input 
                                            prefix={<PhoneOutlined className="text-slate-400 mr-2" />} 
                                            placeholder="Secure Mobile ID" 
                                        />
                                    </Form.Item>
                                </div>
                            )}

                            <Form.Item
                                name="email"
                                rules={[
                                    { required: true, message: 'Identity email required' },
                                    { type: 'email', message: 'Invalid logistics email format' }
                                ]}
                            >
                                <Input 
                                    prefix={<MailOutlined className="text-slate-400 mr-2" />} 
                                    placeholder="Logistics Email (example@company.com)" 
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Security key missing' }, { min: 6, message: 'Security key below 6 bits' }]}
                            >
                                <Input.Password 
                                    prefix={<LockOutlined className="text-slate-400 mr-2" />} 
                                    placeholder="Nexus Authentication Key" 
                                />
                            </Form.Item>

                            <Form.Item className="mt-8 mb-0">
                                <Button 
                                    type="primary" 
                                    htmlType="submit" 
                                    block 
                                    loading={isLoading}
                                    className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/40 border-none group"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        {activeTab === 'login' ? 'INITIATE ACCESS' : 'ESTABLISH CONNECT'}
                                        <ArrowRightOutlined className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>

                    <Space className="w-full justify-center mt-10 text-slate-500">
                        <SafetyCertificateOutlined className="text-emerald-500" />
                        <Text className="text-slate-500 text-xs tracking-widest uppercase">
                            Encrypted Nexus Shield Active
                    </Text>
                </Space>
            </div>
        </div>
            
        </ConfigProvider>
    );
};

export default AuthPortal;
