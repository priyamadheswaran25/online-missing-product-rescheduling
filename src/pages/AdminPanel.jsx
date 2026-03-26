import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, Package, Check, X,
    Trash2, ShieldAlert, Search,
    Filter, Eye, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * AdminPanel Page
 * Allows administrators to approve or reject reschedule requests.
 */
const AdminPanel = () => {
    const [complaints, setComplaints] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    // Load all complaints on mount
    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const res = await fetch('/api/complaints');
                const data = await res.json();
                setComplaints(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchComplaints();
    }, []);

    const updateStatus = async (id, newStatus) => {
        try {
            const res = await fetch(`/api/complaints/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const updated = await res.json();
            
            setComplaints(complaints.map(c => c._id === id ? updated : c));
            if (selectedComplaint?._id === id) {
                setSelectedComplaint(updated);
            }
            toast.success(`Status updated to ${newStatus}`);
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const deleteComplaint = async (id) => {
        if (window.confirm('Admin: Permanently delete this record?')) {
            try {
                await fetch(`/api/complaints/${id}`, { method: 'DELETE' });
                setComplaints(complaints.filter(c => c._id !== id));
                toast.success('Record deleted permanently');
            } catch(err) {
                toast.error('Server error deleting record');
            }
        }
    };

    // Filter and Search Logic
    const filteredComplaints = complaints.filter(c => {
        const matchesSearch = c.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.orderId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="max-w-7xl mx-auto py-6 flex flex-col gap-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-rose-100 p-3 rounded-2xl">
                        <ShieldAlert className="w-8 h-8 text-rose-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Admin Control Center</h1>
                        <p className="text-slate-500">Review and manage all customer reschedule requests.</p>
                    </div>
                </div>
            </div>

            {/* Stats Quick View */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                <AdminStat cardTitle="Total Requests" count={complaints.length} icon={<Package className="text-blue-600" />} />
                <AdminStat cardTitle="Pending" count={complaints.filter(c => c.status === 'Pending').length} icon={<Clock className="text-amber-500" />} />
                <AdminStat cardTitle="Approved" count={complaints.filter(c => c.status === 'Approved').length} icon={<Check className="text-emerald-500" />} />
                <AdminStat cardTitle="Cancel" count={complaints.filter(c => c.status === 'Cancel').length} icon={<X className="text-rose-500" />} />
            </div>

            {/* Admin Search & Filter Bar */}
            <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center border border-rose-100">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by product, customer, or ID..."
                        className="input-field pl-10 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter className="w-5 h-5 text-slate-500" />
                    <select
                        className="input-field w-full md:w-48"
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
            <div className="glass-panel rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-widest">
                            <tr>
                                <th className="px-6 py-5">Customer Info</th>
                                <th className="px-6 py-5">Product Details</th>
                                <th className="px-6 py-5">Issue & Date</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-6 py-5 text-center">Admin Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredComplaints.length > 0 ? (
                                filteredComplaints.map((c) => (
                                    <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                                                    {c.userName.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800">{c.userName}</div>
                                                    <div className="text-xs text-slate-400">UID: {c.userId}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="font-semibold text-slate-700">{c.productName}</div>
                                            <div className="text-xs font-mono text-slate-400">#ORD-{c.orderId}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-sm font-medium text-slate-600">{c.issueType}</div>
                                            <div className="text-xs text-primary-600 font-bold mt-1">
                                                New Date: {new Date(c.rescheduleDate).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${c.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                                    c.status === 'Cancel' ? 'bg-rose-50 text-rose-600 border-rose-200' :
                                                        'bg-amber-50 text-amber-600 border-amber-200'
                                                }`}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-center items-center gap-2">
                                                {c.status === 'Pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => updateStatus(c._id, 'Approved')}
                                                            className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                                            title="Approve"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(c._id, 'Cancel')}
                                                            className="p-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                                            title="Cancel"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => deleteComplaint(c._id)}
                                                    className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                                                    title="Delete Permanent"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 text-slate-300">
                                            <Users className="w-16 h-16" />
                                            <p className="text-xl font-medium">No customer requests found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const AdminStat = ({ cardTitle, count, icon }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-2">
        <div className="w-11 h-11 bg-slate-50 flex items-center justify-center rounded-xl">
            {icon}
        </div>
        <div>
            <p className="text-3xl font-black text-slate-900">{count}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{cardTitle}</p>
        </div>
    </div>
);

export default AdminPanel;
