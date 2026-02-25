import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Package, LogOut, LayoutDashboard, UserCircle, Bell } from 'lucide-react';

/**
 * Navbar Component
 * Responsive navigation with authentication state handling.
 */
const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    // Use useEffect to check auth state from localStorage on mount and when path changes
    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('currentUser'));
        setUser(loggedInUser);
    }, [location]);

    const handleLogout = () => {
        // Clear session and redirect to home
        localStorage.removeItem('currentUser');
        setUser(null);
        navigate('/');
    };

    return (
        <nav className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
                <div className="bg-primary-600 p-2 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                    <Package className="text-white w-6 h-6" />
                </div>
                <span className="text-2xl font-bold gradient-text">ReScheduleX</span>
            </Link>

            <div className="flex items-center gap-6">
                {!user ? (
                    <>
                        <Link to="/login" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">
                            Login
                        </Link>
                        <Link to="/register" className="btn-primary">
                            Register
                        </Link>
                    </>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link
                            to="/dashboard"
                            className={`flex items-center gap-2 font-medium transition-colors ${location.pathname === '/dashboard' ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'}`}
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            <span className="hidden md:inline">Dashboard</span>
                        </Link>

                        {user.role === 'admin' && (
                            <Link
                                to="/admin"
                                className={`flex items-center gap-2 font-medium transition-colors ${location.pathname === '/admin' ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'}`}
                            >
                                <Bell className="w-5 h-5" />
                                <span className="hidden md:inline">Admin Panel</span>
                            </Link>
                        )}

                        <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
                            <span className="text-sm font-semibold text-slate-700 hidden sm:inline">
                                Hi, {user.name.split(' ')[0]}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
