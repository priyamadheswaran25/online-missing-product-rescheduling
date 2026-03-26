import React, { useState, useEffect, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
    Table,
    Modal,
    Form,
    Input,
    Button,
    Card,
    DatePicker,
    Select,
    Tag,
    Space,
    Typography,
    Row,
    Col,
    Statistic,
    Empty,
    ConfigProvider,
    theme,
    Tooltip
} from 'antd';
import {
    PlusOutlined,
    SearchOutlined,
    FilterOutlined,
    DeleteOutlined,
    EditOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    EnvironmentOutlined,
    BarcodeOutlined,
    CalendarOutlined,
    InfoCircleOutlined,
    ThunderboltFilled
} from '@ant-design/icons';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const Dashboard = () => {
    const [user] = useState(() => JSON.parse(localStorage.getItem('currentUser')));
    const [complaints, setComplaints] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingComplaint, setEditingComplaint] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [form] = Form.useForm();

    const fetchComplaints = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/complaints');
            const data = await res.json();
            const userComplaints = data.filter(c => c.userId === user.id);
            setComplaints(userComplaints);
        } catch {
            toast.error('Failed to sync with logistics database');
        } finally {
            setIsLoading(false);
        }
    }, [user.id]);

    useEffect(() => {
        fetchComplaints();
    }, [fetchComplaints]);

    const handleSubmit = async (values) => {
        setIsLoading(true);
        try {
            const payload = {
                ...values,
                deliveryDate: values.deliveryDate.toISOString(),
                rescheduleDate: values.rescheduleDate.toISOString(),
                userId: user.id,
                userName: user.name,
                status: editingComplaint ? editingComplaint.status : 'Pending'
            };

            const url = editingComplaint ? `/api/complaints/${editingComplaint._id}` : '/api/complaints';
            const method = editingComplaint ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await res.json();

            if (editingComplaint) {
                setComplaints(complaints.map(c => c._id === result._id ? result : c));
                toast.success('Report parameters updated');
            } else {
                setComplaints([result, ...complaints]);
                toast.success('New report logged successfully');
            }
            handleCancel();
        } catch {
            toast.error('System processing error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (record) => {
        setEditingComplaint(record);
        form.setFieldsValue({
            ...record,
            deliveryDate: dayjs(record.deliveryDate),
            rescheduleDate: dayjs(record.rescheduleDate),
        });
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingComplaint(null);
        form.resetFields();
    };

    const handleDelete = async (id) => {
        Modal.confirm({
            title: 'Confirm Deletion',
            content: 'This action will permanently remove the logistics report. Continue?',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            centered: true,
            onOk: async () => {
                try {
                    await fetch(`/api/complaints/${id}`, { method: 'DELETE' });
                    setComplaints(complaints.filter(c => c._id !== id));
                    toast.success('Report expunged');
                } catch {
                    toast.error('Deletion failed');
                }
            }
        });
    };

    const filteredComplaints = complaints.filter(c => {
        const matchesSearch = c.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.orderId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const columns = [
        {
            title: 'LOGISTICS ID',
            dataIndex: 'orderId',
            key: 'orderId',
            render: (text) => <Text code className="text-blue-400 font-mono">{text}</Text>,
        },
        {
            title: 'PRODUCT ASSET',
            dataIndex: 'productName',
            key: 'productName',
            render: (text) => <Text strong className="text-white">{text}</Text>,
        },
        {
            title: 'ISSUE TYPE',
            dataIndex: 'issueType',
            key: 'issueType',
            render: (tag) => (
                <Tag color="cyan" className="uppercase font-bold text-[10px] tracking-wider border-none">
                    {tag}
                </Tag>
            ),
        },
        {
            title: 'RE-DELIVERY',
            dataIndex: 'rescheduleDate',
            key: 'rescheduleDate',
            render: (date) => <Text className="text-slate-400">{dayjs(date).format('MMM DD, YYYY')}</Text>,
        },
        {
            title: 'STATUS',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'gold';
                let icon = <ClockCircleOutlined />;
                if (status === 'Approved') { color = 'success'; icon = <CheckCircleOutlined />; }
                if (status === 'Cancel') { color = 'error'; icon = <CloseCircleOutlined />; }
                return (
                    <Tag icon={icon} color={color} className="font-bold border-none">
                        {status.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: 'ACTIONS',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Modify Report">
                        <Button 
                            type="text" 
                            icon={<EditOutlined />} 
                            onClick={() => handleEdit(record)}
                            className="text-slate-500 hover:text-blue-400"
                        />
                    </Tooltip>
                    <Tooltip title="Delete Report">
                        <Button 
                            type="text" 
                            danger 
                            icon={<DeleteOutlined />} 
                            onClick={() => handleDelete(record._id)}
                            className="text-slate-500 hover:text-rose-500"
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    colorPrimary: '#2563eb',
                    borderRadius: 16,
                    colorBgContainer: '#0f172a',
                    colorBorderSecondary: 'rgba(255,255,255,0.05)'
                },
                components: {
                    Table: {
                        headerBg: '#1e293b',
                    },
                    Modal: {
                        contentBg: '#1e293b',
                        headerBg: '#1e293b',
                    }
                }
            }}
        >
            <div className="max-w-7xl mx-auto py-10 px-6 space-y-10">
                {/* Dashboard Header */}
                <Row justify="space-between" align="middle" gutter={[16, 16]}>
                    <Col xs={24} md={16}>
                        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                            <Title level={2} className="m-0! font-black!">Terminal Hub: {user.name}</Title>
                            <Text className="text-slate-500 font-medium">Monitoring encrypted logistics reports and rescheduling operations.</Text>
                        </motion.div>
                    </Col>
                    <Col xs={24} md={8} className="text-right">
                        <Button 
                            type="primary" 
                            size="large" 
                            icon={<PlusOutlined />} 
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-500 h-14 px-8 font-bold rounded-2xl shadow-xl shadow-blue-900/30 border-none"
                        >
                            Report Missing Product
                        </Button>
                    </Col>
                </Row>

                {/* Statistics Overview */}
                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={8}>
                        <StatCard 
                            title="PENDING VERIFICATION" 
                            value={complaints.filter(c => c.status === 'Pending').length}
                            icon={<ClockCircleOutlined />}
                            color="#eab308"
                        />
                    </Col>
                    <Col xs={24} sm={8}>
                        <StatCard 
                            title="APPROVED RESOLUTIONS" 
                            value={complaints.filter(c => c.status === 'Approved').length}
                            icon={<CheckCircleOutlined />}
                            color="#10b981"
                        />
                    </Col>
                    <Col xs={24} sm={8}>
                        <StatCard 
                            title="VOIDED CLAIMS" 
                            value={complaints.filter(c => c.status === 'Cancel').length}
                            icon={<CloseCircleOutlined />}
                            color="#f43f5e"
                        />
                    </Col>
                </Row>

                {/* Operations Control Panel */}
                <Card className="border-white/5 shadow-2xl overflow-hidden rounded-4xl">
                    <div className="flex flex-col md:flex-row gap-6 mb-8 items-center bg-slate-800/20 p-6 rounded-3xl border border-white/5">
                        <div className="flex-1 w-full relative">
                            <Input
                                placeholder="Filter by product name, order ID or carrier info..."
                                prefix={<SearchOutlined className="text-slate-500 mr-2" />}
                                className="h-12 bg-slate-900 border-white/5 rounded-xl hover:border-blue-500/50"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="w-full md:w-64">
                            <Select
                                className="w-full h-12"
                                value={statusFilter}
                                onChange={setStatusFilter}
                                suffixIcon={<FilterOutlined />}
                                options={[
                                    { value: 'All', label: 'All Operations' },
                                    { value: 'Pending', label: 'Pending' },
                                    { value: 'Approved', label: 'Approved' },
                                    { value: 'Cancel', label: 'Voided' },
                                ]}
                            />
                        </div>
                    </div>

                    <Table 
                        columns={columns} 
                        dataSource={filteredComplaints} 
                        rowKey="_id"
                        loading={isLoading}
                        pagination={{ pageSize: 8, position: ['bottomCenter'] }}
                        className="custom-table"
                        locale={{ emptyText: <Empty description="No logistics reports found" /> }}
                    />
                </Card>

                {/* Logistics Form Modal */}
                <Modal
                    title={<Title level={3} className="m-0! text-white">{editingComplaint ? 'Modify Logistics Report' : 'Initialize Logistics Claim'}</Title>}
                    open={isModalOpen}
                    onCancel={handleCancel}
                    footer={null}
                    width={720}
                    className="premium-modal"
                    centered
                    destroyOnClose
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        className="pt-6"
                        requiredMark={false}
                    >
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="orderId"
                                    label="TRACKING ID"
                                    rules={[{ required: true, message: 'Tracking reference required' }]}
                                >
                                    <Input prefix={<BarcodeOutlined />} placeholder="e.g. #ORD12345" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="productName"
                                    label="ASSET NAME"
                                    rules={[{ required: true, message: 'Product name required' }]}
                                >
                                    <Input placeholder="e.g. Quantum Processor X1" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="deliveryDate"
                                    label="INCIDENT DATE"
                                    rules={[{ required: true, message: 'Original date required' }]}
                                >
                                    <DatePicker className="w-full" prefix={<CalendarOutlined />} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="issueType"
                                    label="ANOMALY TYPE"
                                    initialValue="Not Delivered"
                                >
                                    <Select options={[
                                        { value: 'Not Delivered', label: 'Not Delivered' },
                                        { value: 'Delivered to Wrong Address', label: 'Wrong Destination' },
                                        { value: 'Damaged Product', label: 'Compromised Asset' },
                                        { value: 'Missing Item', label: 'Partial Incomplete' },
                                    ]} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="rescheduleDate"
                                    label="RE-DELIVERY TARGET"
                                    rules={[{ required: true, message: 'Target date required' }]}
                                >
                                    <DatePicker 
                                        className="w-full" 
                                        disabledDate={(current) => current && current < dayjs().startOf('day')}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="SECURITY STATUS"
                                    tooltip={{ title: 'Admin override required to change status', icon: <InfoCircleOutlined /> }}
                                >
                                    <Input value={editingComplaint?.status || 'Pending'} disabled />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            name="address"
                            label="DESTINATION PARAMETERS"
                            rules={[{ required: true, message: 'Full address required' }]}
                        >
                            <TextArea rows={4} prefix={<EnvironmentOutlined />} placeholder="Enter full delivery destination coordinates..." />
                        </Form.Item>

                        <Form.Item className="mb-0 pt-6 flex justify-end">
                            <Space size="middle">
                                <Button onClick={handleCancel} size="large" className="rounded-xl px-8 h-12">Cancel</Button>
                                <Button 
                                    type="primary" 
                                    htmlType="submit" 
                                    size="large" 
                                    loading={isLoading}
                                    className="bg-blue-600 hover:bg-blue-500 rounded-xl px-12 h-12 font-bold shadow-lg shadow-blue-900/20 border-none"
                                >
                                    {editingComplaint ? 'Update Parameters' : 'Authorize Claim'}
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
            
        </ConfigProvider>
    );
};

const StatCard = ({ title, value, icon, color }) => (
    <Card className="border-none shadow-xl rounded-3xl overflow-hidden group">
        <Statistic
            title={<Text className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{title}</Text>}
            value={value}
            prefix={React.cloneElement(icon, { style: { color, marginRight: '12px', fontSize: '24px' } })}
            valueStyle={{ color: '#fff', fontWeight: 900, fontSize: '36px', display: 'flex', alignItems: 'center' }}
            className="p-2"
        />
        <div 
            className="absolute bottom-0 left-0 h-1 transition-all duration-500 w-0 group-hover:w-full" 
            style={{ backgroundColor: color }}
        />
    </Card>
);

export default Dashboard;
