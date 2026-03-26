import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const AuthPortal = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });

    // Real-time Validation States
    const [validations, setValidations] = useState({
        name: false,
        email: false,
        password: {
            length: false,
            letter: false,
            number: false,
            special: false
        }
    });

    useEffect(() => {
        setValidations({
            name: formData.name.length >= 3 && /[A-Za-z]/.test(formData.name) && /\d/.test(formData.name),
            email: /^[^\s@]+@gmail\.com$/.test(formData.email),
            password: {
                length: formData.password.length >= 6,
                letter: /[a-zA-Z]/.test(formData.password),
                number: /\d/.test(formData.password),
                special: /[@$!%*?&]/.test(formData.password)
            }
        });
    }, [formData]);

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!isLogin) {
            if (!validations.name || !validations.email || !validations.password.length || !validations.password.letter || !validations.password.number || !validations.password.special) {
                toast.error('Please satisfy all real-time requirements.');
                return;
            }
        }

        setIsLoading(true);

        try {
            const endpoint = isLogin ? '/api/login' : '/api/register';
            const role = formData.email === 'admin@reschedulex.com' ? 'admin' : 'user';
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(isLogin ? { email: formData.email, password: formData.password } : { ...formData, role })
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || 'Authentication failed');
                setIsLoading(false);
                return;
            }

            if (isLogin) {
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                toast.success('Welcome back!');
                navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
            } else {
                toast.success('Registration successful! Please sign in.');
                setIsLogin(true);
                setIsLoading(false);
            }
        } catch (err) {
            toast.error('System connection error. Verify backend status.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary-600/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.8)_100%)]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-[440px] px-6"
            >
                <div className="glass-panel backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-slate-900/40">
                    <div className="text-center mb-8">
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 12 }}
                            className="inline-flex p-3 rounded-2xl bg-primary-500/10 text-primary-400 mb-4"
                        >
                            <Zap className="w-8 h-8 fill-current" />
                        </motion.div>
                        <h2 className="text-3xl font-black text-white tracking-tight">
                            {isLogin ? 'Welcome Back' : 'Create Access'}
                        </h2>
                        <p className="text-slate-400 mt-2 text-sm">
                            {isLogin ? 'Secure access to your rescheduling hub' : 'Join the elite product logistics platform'}
                        </p>
                    </div>

                    <div className="flex p-1 bg-slate-800/50 rounded-2xl mb-8">
                        <button
                            onClick={() => { setIsLogin(true); }}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${isLogin ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => { setIsLogin(false); }}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${!isLogin ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            Register
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.form
                            key={isLogin ? 'login' : 'register'}
                            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                            onSubmit={handleAuth}
                            className="space-y-4"
                        >
                            {!isLogin && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-4 overflow-hidden">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className={`w-5 h-5 transition-colors ${validations.name ? 'text-primary-400' : 'text-slate-500 group-focus-within:text-primary-500'}`} />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Full Name (John123)"
                                            required
                                            className="w-full bg-slate-800/30 border border-slate-700/50 text-white pl-11 pr-4 py-3.5 rounded-2xl outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all placeholder:text-slate-600"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Phone className="w-5 h-5 text-slate-500 group-focus-within:text-primary-500" />
                                        </div>
                                        <input
                                            type="tel"
                                            placeholder="Mobile Number"
                                            className="w-full bg-slate-800/30 border border-slate-700/50 text-white pl-11 pr-4 py-3.5 rounded-2xl outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all placeholder:text-slate-600"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </motion.div>
                            )}

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className={`w-5 h-5 transition-colors ${validations.email ? 'text-primary-400' : 'text-slate-500 group-focus-within:text-primary-500'}`} />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Gmail Address"
                                    required
                                    className="w-full bg-slate-800/30 border border-slate-700/50 text-white pl-11 pr-4 py-3.5 rounded-2xl outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all placeholder:text-slate-600"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-slate-500 group-focus-within:text-primary-500" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Secret Key"
                                    required
                                    className="w-full bg-slate-800/30 border border-slate-700/50 text-white pl-11 pr-12 py-3.5 rounded-2xl outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all placeholder:text-slate-600"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {!isLogin && (
                                <div className="grid grid-cols-2 gap-2 text-[10px] uppercase font-bold tracking-wider pt-2">
                                    <Requirement met={validations.password.length} text="6+ Characters" />
                                    <Requirement met={validations.password.letter} text="1+ Letter" />
                                    <Requirement met={validations.password.number} text="1+ Number" />
                                    <Requirement met={validations.password.special} text="Special Char" />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-bold py-4 rounded-2xl shadow-[0_10px_20px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        {isLogin ? 'Enter Hub' : 'Create Account'}
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </motion.form>
                    </AnimatePresence>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-slate-500 text-sm">
                        Enterprise Grade Security via MongoDB Atlas
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

const Requirement = ({ met, text }) => (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${met ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-800/30 border-slate-700/50 text-slate-500'}`}>
        <div className={`w-1 h-1 rounded-full ${met ? 'bg-emerald-400' : 'bg-slate-600'}`} />
        {text}
    </div>
);

export default AuthPortal;
