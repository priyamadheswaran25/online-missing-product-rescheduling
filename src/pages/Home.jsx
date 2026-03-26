import React from 'react';
import { Link } from 'react-router-dom';
import { 
    Typography, 
    Button, 
    Card, 
    Row, 
    Col, 
    Space,
    ConfigProvider
} from 'antd';
import { 
    TruckOutlined, 
    ClockCircleOutlined, 
    SecurityScanOutlined, 
    DashboardOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const Home = () => {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#2563eb',
                    borderRadius: 16,
                },
            }}
        >
            <div className="flex flex-col items-center gap-24 py-16 px-4 bg-slate-950 min-h-screen text-white">
                {/* Hero Section */}
                <section className="text-center max-w-4xl pt-20">
                    <div>
                        <Title level={1} style={{ color: 'white', fontSize: '64px', fontWeight: 900, marginBottom: '32px' }}>
                            Online Missing Product <br/>
                            <span className="text-blue-500">
                                Rescheduling
                            </span> System
                        </Title>
                        <Paragraph style={{ color: '#94a3b8', fontSize: '20px', marginBottom: '48px' }}>
                            Report, track, and automate your missing deliveries. 
                            <Text strong style={{ color: 'white' }}> ReScheduleX</Text> delivers a premium resolution experience.
                        </Paragraph>
                        
                        <Space size="middle" className="flex-wrap justify-center">
                            <Link to="/auth">
                                <Button 
                                    type="primary" 
                                    size="large" 
                                    style={{ height: '56px', padding: '0 40px', fontSize: '18px', fontWeight: 700, borderRadius: '12px' }}
                                >
                                    Get Started <ArrowRightOutlined />
                                </Button>
                            </Link>
                            <Link to="/auth">
                                <Button 
                                    size="large" 
                                    ghost
                                    style={{ height: '56px', padding: '0 40px', fontSize: '18px', fontWeight: 700, borderRadius: '12px' }}
                                >
                                    Log In
                                </Button>
                            </Link>
                        </Space>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="w-full max-w-6xl">
                    <Row gutter={[32, 32]}>
                        <Col xs={24} md={12} lg={6}>
                            <FeatureCard
                                icon={<TruckOutlined style={{ fontSize: '32px', color: '#3b82f6' }} />}
                                title="Instant Reporting"
                                description="Log missing items in seconds through our streamlined secure portal."
                            />
                        </Col>
                        <Col xs={24} md={12} lg={6}>
                            <FeatureCard
                                icon={<ClockCircleOutlined style={{ fontSize: '32px', color: '#3b82f6' }} />}
                                title="Smart Recovery"
                                description="Automated reschedule logic finds the fastest delivery windows."
                            />
                        </Col>
                        <Col xs={24} md={12} lg={6}>
                            <FeatureCard
                                icon={<SecurityScanOutlined style={{ fontSize: '32px', color: '#3b82f6' }} />}
                                title="Secure Track"
                                description="Real-time surveillance on your claims with end-to-end encryption."
                            />
                        </Col>
                        <Col xs={24} md={12} lg={6}>
                            <FeatureCard
                                icon={<DashboardOutlined style={{ fontSize: '32px', color: '#3b82f6' }} />}
                                title="Admin Control"
                                description="Advanced terminal for processors to manage global logistics."
                            />
                        </Col>
                    </Row>
                </section>
            </div>
        </ConfigProvider>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <Card 
        style={{ height: '100%', background: 'rgba(30, 41, 59, 0.5)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '24px' }}
        bodyStyle={{ padding: '40px' }}
    >
        <div style={{ background: 'rgba(59, 130, 246, 0.1)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            {icon}
        </div>
        <Title level={4} style={{ color: 'white', fontWeight: 800, marginBottom: '12px' }}>{title}</Title>
        <Paragraph style={{ color: '#94a3b8', margin: 0 }}>
            {description}
        </Paragraph>
    </Card>
);

export default Home;
