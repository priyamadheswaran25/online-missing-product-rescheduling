import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PlusCircle, Search, Filter, Trash2, CheckCircle,
    Clock, AlertCircle, Package, Calendar, MapPin,
    ChevronDown, X, Edit
} from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Dashboard Page
 * Main user interface for reporting and tracking missing products.
 */
const Dashboard = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('currentUser')));
    const [showForm, setShowForm] = useState(false);
    const [complaints, setComplaints] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        orderId: '',
        productName: '',
        deliveryDate: '',
        issueType: 'Not Delivered',
        rescheduleDate: '',
        address: '',
        status: 'Pending'
    });

    // 💡 useEffect: This hook runs a piece of code automatically.
    // We use it here to pull data from localStorage as soon as the Dashboard loads.
    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const res = await fetch('/api/complaints');
                const data = await res.json();
                const userComplaints = data.filter(c => c.userId === user.id);
                setComplaints(userComplaints);
            } catch (err) {
                console.error(err);
            }
        };
        fetchComplaints();
    }, [user.id]); // The [user.id] means "re-run this if the user's ID changes"

    const handleSubmit = (e) => {
        e.preventDefault();
        // 💡 Form Validation check
        if (!formData.orderId || !formData.productName || !formData.deliveryDate || !formData.rescheduleDate || !formData.address) {
            alert('Please fill all fields');
            return;
        }

        const processSubmission = async () => {
            try {
                if (isEditing) {
                    const res = await fetch(`/api/complaints/${formData._id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ...formData, userId: user.id, userName: user.name })
                    });
                    const updatedComplaint = await res.json();
                    setComplaints(complaints.map(c => c._id === updatedComplaint._id ? updatedComplaint : c));
                    toast.success('Report updated successfully!');
                } else {
                    const newComplaintData = {
                        ...formData,
                        userId: user.id,
                        userName: user.name,
                    };
                    const res = await fetch('/api/complaints', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newComplaintData)
                    });
                    const newComplaint = await res.json();
                    setComplaints([newComplaint, ...complaints]);
                    toast.success('Complaint submitted successfully!');
                }
            } catch (err) {
                toast.error('Server error!');
            }
        };
        processSubmission();

        setFormData({
            orderId: '',
            productName: '',
            deliveryDate: '',
            issueType: 'Not Delivered',
            rescheduleDate: '',
            address: '',
            status: 'Pending'
        });
        setIsEditing(false);
        setShowForm(false);

        setTimeout(() => setMessage(null), 3000);
    };

    const handleEdit = (complaint) => {
        setFormData(complaint);
        setIsEditing(true);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this report?')) {
            try {
                await fetch(`/api/complaints/${id}`, { method: 'DELETE' });
                setComplaints(complaints.filter(c => c._id !== id));
                toast.success('Report deleted successfully');
            } catch (err) {
                toast.error('Server error!');
            }
        }
    };

    // Filter and Search Logic
    const filteredComplaints = complaints.filter(c => {
        const matchesSearch = c.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.orderId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="max-w-6xl mx-auto py-6 flex flex-col gap-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Welcome, {user.name}</h1>
                    <p className="text-slate-500">Manage your reported missing products and reschedule deliveries.</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary flex items-center gap-2 px-6 py-3"
                >
                    <PlusCircle className="w-5 h-5" />
                    Report Missing Product
                </button>
            </div>

            {/* Stats Quick View */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatCard
                    icon={<Clock className="text-amber-600" />}
                    label="Pending"
                    count={complaints.filter(c => c.status === 'Pending').length}
                    color="bg-amber-50"
                />
                <StatCard
                    icon={<CheckCircle className="text-emerald-600" />}
                    label="Approved"
                    count={complaints.filter(c => c.status === 'Approved').length}
                    color="bg-emerald-50"
                />
                <StatCard
                    icon={<X className="text-rose-600" />}
                    label="Cancel"
                    count={complaints.filter(c => c.status === 'Cancel').length}
                    color="bg-rose-50"
                />
            </div>

            {/* Search & Filter Bar */}
            <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by product name or order ID..."
                        className="input-field pl-10 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter className="w-5 h-5 text-slate-500" />
                    <select
                        className="input-field w-full md:w-40"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Cancel">Cancel</option>
                    </select>
                </div>
            </div>

            {/* Table Section */}
            <div className="glass-panel rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Order Info</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Issue Type</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Reschedule Date</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 italic md:not-italic">
                            {filteredComplaints.length > 0 ? (
                                filteredComplaints.map((c) => (
                                    <tr key={c._id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-800">{c.productName}</div>
                                            <div className="text-xs text-slate-400 font-mono">ID: {c.orderId}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                                {c.issueType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 text-sm">
                                            {new Date(c.rescheduleDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${c.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                                                c.status === 'Cancel' ? 'bg-rose-100 text-rose-700' :
                                                    'bg-amber-100 text-amber-700'
                                                }`}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-start items-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(c)}
                                                    className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(c._id)}
                                                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-2 opacity-40">
                                            <Package className="w-12 h-12" />
                                            <p className="text-lg">No reports found matching your criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Form */}
            <AnimatePresence>
                {showForm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowForm(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                                <h2 className="text-2xl font-bold text-slate-800">{isEditing ? 'Edit Missing Product Report' : 'Report Missing Product'}</h2>
                                <button
                                    onClick={() => {
                                        setShowForm(false);
                                        setIsEditing(false);
                                        setFormData({
                                            orderId: '', productName: '', deliveryDate: '',
                                            issueType: 'Not Delivered', rescheduleDate: '', address: '', status: 'Pending'
                                        });
                                    }}
                                    className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto">
                                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Order ID</label>
                                        <div className="relative">
                                            <Package className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="e.g. #ORD12345"
                                                className="input-field pl-10"
                                                value={formData.orderId}
                                                onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Product Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Wireless Headphones"
                                            className="input-field"
                                            value={formData.productName}
                                            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Original Delivery Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                                            <input
                                                type="date"
                                                className="input-field pl-10"
                                                value={formData.deliveryDate}
                                                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Issue Type</label>
                                        <div className="relative">
                                            <AlertCircle className="absolute left-3 top-2.5 w-5 h-5 text-slate-400 pt-0.5" />
                                            <select
                                                className="input-field pl-10"
                                                value={formData.issueType}
                                                onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                                            >
                                                <option>Not Delivered</option>
                                                <option>Delivered to Wrong Address</option>
                                                <option>Damaged Product</option>
                                                <option>Missing Item</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                                        <select
                                            className="input-field"
                                            value={formData.status || 'Pending'}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Cancel">Cancel</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Preferred Reschedule Date</label>
                                        <input
                                            type="date"
                                            className="input-field"
                                            min={new Date().toISOString().split('T')[0]}
                                            value={formData.rescheduleDate}
                                            onChange={(e) => setFormData({ ...formData, rescheduleDate: e.target.value })}
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Delivery Address</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                            <textarea
                                                rows="3"
                                                placeholder="Enter full delivery address..."
                                                className="input-field pl-10 pt-2"
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 flex gap-4 pt-4 border-t">
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="flex-1 btn-secondary"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 btn-primary"
                                        >
                                            Submit Report
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const StatCard = ({ icon, label, count, color }) => (
    <div className={`p-6 rounded-2xl flex items-center gap-4 border border-slate-100 shadow-sm ${color}`}>
        <div className="p-3 bg-white rounded-xl shadow-sm">
            {icon}
        </div>
        <div>
            <p className="text-sm font-semibold text-slate-500">{label}</p>
            <p className="text-2xl font-bold text-slate-800">{count}</p>
        </div>
    </div>
);

export default Dashboard;
