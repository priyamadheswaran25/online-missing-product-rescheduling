import React from 'react';
import { motion } from 'framer-motion';

/**
 * LoadingSpinner Component
 * Uses framer-motion for smooth, modern animation.
 */
const LoadingSpinner = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
            <motion.div
                className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.p
                className="mt-4 text-primary-600 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                Loading...
            </motion.p>
        </div>
    );
};

export default LoadingSpinner;
