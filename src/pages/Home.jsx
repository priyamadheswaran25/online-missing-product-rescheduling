import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Clock, BarChart3 } from 'lucide-react';

/**
 * Home Page
 * Hero section and feature highlights.
 */
const Home = () => {
    return (
        <div className="flex flex-col items-center gap-20 py-12">
            {/* Hero Section */}
            <section className="text-center max-w-4xl px-4 animate-fade-in">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
                        Online Missing Product <span className="gradient-text">Rescheduling</span> System
                    </h1>
                    <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
                        Report, Track and Reschedule Your Missing Deliveries Easily.
                        ReScheduleX ensures your logistics problems are solved with a few clicks.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/register" className="btn-primary text-lg px-8 py-3">
                            Get Started Now
                        </Link>
                        <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                            Login to Account
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Features Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl px-4">
                <FeatureCard
                    icon={<Truck className="w-8 h-8 text-blue-600" />}
                    title="Easy Reporting"
                    description="Log your missing items instantly with our intuitive dashboard."
                />
                <FeatureCard
                    icon={<Clock className="w-8 h-8 text-blue-600" />}
                    title="Smart Rescheduling"
                    description="Pick a new delivery date that works best for your schedule."
                />
                <FeatureCard
                    icon={<ShieldCheck className="w-8 h-8 text-blue-600" />}
                    title="Secure Tracking"
                    description="Monitor your requests and get updates on approval status."
                />
                <FeatureCard
                    icon={<BarChart3 className="w-8 h-8 text-blue-600" />}
                    title="Admin Oversight"
                    description="Efficient management panel for processing all user claims."
                />
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <motion.div
        whileHover={{ y: -10 }}
        className="glass-panel p-8 rounded-2xl flex flex-col gap-4 text-center md:text-left transition-all hover:shadow-xl"
    >
        <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
    </motion.div>
);

export default Home;
