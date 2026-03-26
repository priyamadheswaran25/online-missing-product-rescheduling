/* cspell:disable */
import React, { useState, useEffect } from 'react';
import {
    Table,
    Card,
    Button,
    Row,
    Col,
    Typography,
    Tag,
    Space,
    Input,
    Select,
    Popconfirm,
    Avatar,
    Statistic,
    ConfigProvider,
    theme,
    Tooltip
} from 'antd';
import {
    SearchOutlined,
    FilterOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    DeleteOutlined,
    ClockCircleOutlined,
    SafetyCertificateOutlined,
    ContainerOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

const { Title, Text, Paragraph } = Typography;

const AdminPanel = () => {
    const [complaints, setComplaints] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/complaints');
            const data = await res.json();
            setComplaints(data);
        } catch {
            toast.error('Logistics override failed result synced');
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const res = await fetch(`/api/complaints/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const updated = await res.json();
            setComplaints(complaints.map(c => c._id === id ? updated : c));
            toast.success(`Operational status: ${newStatus.toUpperCase()}`);
        } catch {
            toast.error('Privileged status update failure');
        }
    };

    const deleteComplaint = async (id) => {
        try {
            await fetch(`/api/complaints/${id}`, { method: 'DELETE' });
            setComplaints(complaints.filter(c => c._id !== id));
            toast.success('Record expunged from terminal');
        } catch {
            toast.error('System processing error');
        }
    };

    const filteredComplaints = complaints.filter(c => {
        const matchesSearch = c.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.orderId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const columns = [
        {
            title: 'OPERATOR / CLIENT',
            key: 'user',
            render: (_, record) => (
                <Space>
                    <Avatar 
                        className="bg-rose-500 font-bold"
                        style={{ verticalAlign: 'middle' }}
                    >
                        {record.userName.charAt(0).toUpperCase()}
                    </Avatar>
                    <div className="flex flex-col gap-0.5 leading-none">
                        <Text strong className="text-white text-sm">{record.userName}</Text>
                        <Text className="text-[10px] text-slate-500 font-mono tracking-tight">{record.userId}</Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'ASSET SPECIFICATIONS',
            key: 'asset',
            render: (_, record) => (
                <div className="flex flex-col gap-0.5 leading-none">
                    <Text strong className="text-slate-300">{record.productName}</Text>
                    <Text code className="text-[10px] text-blue-400 font-mono">ID: {record.orderId}</Text>
                </div>
            ),
        },
        {
            title: 'ANOMALY / SCHEDULE',
            key: 'schedule',
            render: (_, record) => (
                <div className="flex flex-col gap-0.5 leading-none">
                    <Text className="text-slate-400 text-xs uppercase font-bold">{record.issueType}</Text>
                    <Text className="text-rose-400 text-[10px] font-mono">
                        TARGET: {dayjs(record.rescheduleDate).format('YYYY-MM-DD')}
                    </Text>
                </div>
            ),
        },
        {
            title: 'NETWORK STATUS',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'gold';
                let icon = <ClockCircleOutlined />;
                if (status === 'Approved') { color = 'success'; icon = <CheckCircleOutlined />; }
                if (status === 'Cancel') { color = 'error'; icon = <CloseCircleOutlined />; }
                return (
                    <Tag icon={icon} color={color} className="font-bold border-none px-3 py-0.5">
                        {status.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: 'AUTHENTICATION OVERRIDE',
            key: 'actions',
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    {record.status === 'Pending' && (
                        <>
                            <Tooltip title="Approve Request">
                                <Button 
                                    type="text" 
                                    icon={<CheckCircleOutlined />} 
                                    onClick={() => updateStatus(record._id, 'Approved')}
                                    className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10"
                                />
                            </Tooltip>
                            <Tooltip title="Reject Request">
                                <Button 
                                    type="text" 
                                    icon={<CloseCircleOutlined />} 
                                    onClick={() => updateStatus(record._id, 'Cancel')}
                                    className="text-amber-500 hover:text-amber-400 hover:bg-amber-500/10"
                                />
                            </Tooltip>
                        </>
                    )}
                    <Popconfirm
                        title="Expunge Record"
                        description="Are you sure you want to permanently delete this logistics report?"
                        onConfirm={() => deleteComplaint(record._id)}
                        okText="Expunge"
                        cancelText="Abort"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Delete Permanently">
                            <Button 
                                type="text" 
                                danger 
                                icon={<DeleteOutlined />} 
                                className="text-slate-500 hover:text-rose-500 hover:bg-rose-500/10"
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    colorPrimary: '#f43f5e',
                    borderRadius: 16,
                    colorBgContainer: '#0f172a',
                    colorBorderSecondary: 'rgba(255,255,255,0.05)'
                },
                components: {
                    Table: {
                        headerBg: '#1e293b',
                    }
                }
            }}
        >
            <div className="max-w-7xl mx-auto py-12 px-6 space-y-12">
                {/* Admin Header */}
                <div className="flex items-center gap-6">
                    <div className="bg-rose-900/30 p-5 rounded-3xl border border-rose-500/20 shadow-2xl shadow-rose-900/20">
                        <SafetyCertificateOutlined className="text-4xl text-rose-500" />
                    </div>
                    <div>
                        <Title level={1} className="m-0! font-black! tracking-tight!">Privileged Terminal</Title>
                        <Text className="text-slate-500 font-medium text-lg italic">Global Logistics Oversight & Protocol Management</Text>
                    </div>
                </div>

                {/* System Statistics */}
                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={6}>
                        <AdminStatCard title="TOTAL CLAIMS" value={complaints.length} icon={<ContainerOutlined />} color="#6366f1" />
                    </Col>
                    <Col xs={24} sm={6}>
                        <AdminStatCard title="AWAITING ACTION" value={complaints.filter(c => c.status === 'Pending').length} icon={<ClockCircleOutlined />} color="#eab308" />
                    </Col>
                    <Col xs={24} sm={6}>
                        <AdminStatCard title="VERIFIED" value={complaints.filter(c => c.status === 'Approved').length} icon={<SafetyCertificateOutlined />} color="#10b981" />
                    </Col>
                    <Col xs={24} sm={6}>
                        <AdminStatCard title="VOIDED" value={complaints.filter(c => c.status === 'Cancel').length} icon={<CloseCircleOutlined />} color="#f43f5e" />
                    </Col>
                </Row>

                {/* Management Hub */}
                <Card className="border-white/5 shadow-2xl rounded-4xl overflow-hidden bg-slate-900/50 backdrop-blur-xl">
                    <div className="flex flex-col md:flex-row gap-6 mb-10 items-center p-6 bg-white/5 rounded-3xl">
                        <div className="flex-1 w-full">
                            <Input
                                placeholder="Search by asset, operator, or encrypted ID..."
                                prefix={<SearchOutlined className="text-slate-500 mr-2" />}
                                className="h-14 bg-slate-900 border-white/5 rounded-2xl hover:border-rose-500/50"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="w-full md:w-72">
                            <Select
                                className="w-full h-14"
                                value={statusFilter}
                                onChange={setStatusFilter}
                                suffixIcon={<FilterOutlined />}
                                options={[
                                    { value: 'All', label: 'All Operations' },
                                    { value: 'Pending', label: 'Awaiting Action' },
                                    { value: 'Approved', label: 'Verified Only' },
                                    { value: 'Cancel', label: 'Voided Only' },
                                ]}
                            />
                        </div>
                    </div>

                    <Table 
                        columns={columns} 
                        dataSource={filteredComplaints} 
                        rowKey="_id"
                        loading={isLoading}
                        pagination={{ pageSize: 10, position: ['bottomCenter'] }}
                        className="admin-table"
                    />
                </Card>
            </div>

        </ConfigProvider>
    );
};

const AdminStatCard = ({ title, value, icon, color }) => (
    <Card className="border-none shadow-xl rounded-4xl bg-slate-900/80 border border-white/5 group relative overflow-hidden">
        <Statistic
            title={<Text className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">{title}</Text>}
            value={value}
            prefix={React.cloneElement(icon, { style: { color, marginRight: '16px', fontSize: '28px' } })}
            valueStyle={{ color: '#fff', fontWeight: 900, fontSize: '42px', display: 'flex', alignItems: 'center' }}
            className="p-1"
        />
        <div 
            className="absolute bottom-0 left-0 h-1.5 transition-all duration-700 w-0 group-hover:w-full" 
            style={{ backgroundColor: color }}
        />
    </Card>
);

export default AdminPanel;
