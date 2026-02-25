import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';

/**
 * Register Page
 * Features validation, localStorage persistence, and modern UI.
 */
const Register = () => {
    const navigate = useNavigate();

    // 💡 useState: This hook allows us to create "state" variables.
    // When these variables change, React automatically re-renders the component.
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 💡 Form Validation: This logic ensures the data entered by the user
    // is in the correct format before we try to store it.
    const validate = () => {
        if (!formData.name || !formData.email || !formData.phone || !formData.password) {
            setError('All fields are required');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Invalid email format');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        return true;
    };

    const handleRegister = (e) => {
        e.preventDefault();
        setError('');

        if (!validate()) return;

        setIsLoading(true);

        // Simulate small delay
        setTimeout(() => {
            // 💡 localStorage: This is a way to save data in the user's browser
            // so it persists even if the page is refreshed.
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // Check if email already exists
            if (users.some(u => u.email === formData.email)) {
                setError('User already registered');
                setIsLoading(false);
                return;
            }

            // Add new user (default to 'user' role, unless email is admin@reschedulex.com)
            const newUser = {
                ...formData,
                id: Date.now(),
                role: formData.email === 'admin@reschedulex.com' ? 'admin' : 'user'
            };

            // 💡 localStorage.setItem: Save the updated users list back to browser storage
            localStorage.setItem('users', JSON.stringify([...users, newUser]));
            setIsLoading(false);

            // 💡 Navigation: Moving the user to the Login page after success
            navigate('/login', { state: { message: 'Registration successful! Please login.' } });
        }, 1000);
    };

    return (
        <div className="flex items-center justify-center py-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel w-full max-w-md p-8 rounded-3xl shadow-2xl"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Create Account</h2>
                    <p className="text-slate-500">Simplify your logistics today</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="flex flex-col gap-5">
                    {/* Full Name */}
                    <div className="relative">
                        <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="input-field pl-10"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    {/* Email */}
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

                    {/* Phone */}
                    <div className="relative">
                        <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            className="input-field pl-10"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    {/* Password */}
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
                        className="btn-primary py-3 text-lg mt-2 disabled:bg-slate-400"
                    >
                        {isLoading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <p className="text-center mt-8 text-slate-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-600 font-bold hover:underline">
                        Login here
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
