import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';

/**
 * Login Page
 * Features validation against localStorage and session management.
 */
const Login = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(state?.message || '');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.email || !formData.password) {
            setError('Please enter both email and password');
            return;
        }

        setIsLoading(true);

        // Simulate network delay
        setTimeout(() => {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === formData.email && u.password === formData.password);

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                setIsLoading(false);
                navigate('/dashboard');
            } else {
                setError('Invalid credentials');
                setIsLoading(false);
            }
        }, 800);
    };

    return (
        <div className="flex items-center justify-center py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel w-full max-w-md p-8 rounded-3xl shadow-2xl"
            >
                <div className="text-center mb-8">
                    <div className="bg-primary-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <LogIn className="w-8 h-8 text-primary-600" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Welcome Back</h2>
                    <p className="text-slate-500">Login to manage your deliveries</p>
                </div>

                {success && (
                    <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-r-lg animate-fade-in">
                        {success}
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg animate-fade-in">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="flex flex-col gap-6">
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="input-field pl-10"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            className="input-field pl-10 pr-10"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-3 text-slate-400 hover:text-primary-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary py-3 text-lg disabled:bg-slate-400 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Signing in...
                            </>
                        ) : 'Sign In'}
                    </button>
                </form>

                <p className="text-center mt-8 text-slate-600">
                    New to ReScheduleX?{' '}
                    <Link to="/register" className="text-primary-600 font-bold hover:underline">
                        Register now
                    </Link>
                </p>

                {/* Tip for Admin */}
                <div className="mt-8 p-4 bg-sky-50 rounded-xl border border-sky-100 text-xs text-sky-700">
                    <p className="font-bold mb-1 underline">Pro Tip:</p>
                    Register with <span className="font-mono">admin@reschedulex.com</span> to automatically gain admin permissions.
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
