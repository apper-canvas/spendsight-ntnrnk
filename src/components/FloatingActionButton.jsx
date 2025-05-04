import { motion } from 'framer-motion';
import { useState } from 'react';

const FloatingActionButton = ({
  icon,
  label,
  onClick,
  position = 'bottom-right',
  size = 'medium',
  color = 'primary',
  showLabel = false,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-16 right-4 md:bottom-8',
    'bottom-left': 'bottom-16 left-4 md:bottom-8',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'center-right': 'top-1/2 -translate-y-1/2 right-4',
    'center-left': 'top-1/2 -translate-y-1/2 left-4',
  };
  
  // Size classes
  const sizeClasses = {
    'small': 'w-8 h-8',
    'medium': 'w-10 h-10',
    'large': 'w-12 h-12',
  };
  
  const iconSizeClasses = {
    'small': 'w-3.5 h-3.5',
    'medium': 'w-5 h-5',
    'large': 'w-6 h-6',
  };
  
  // Color classes
  const colorClasses = {
    'primary': 'bg-primary text-white hover:bg-primary-dark focus:ring-primary',
    'secondary': 'bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary',
    'danger': 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    'success': 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500',
    'neutral': 'bg-surface-700 text-white hover:bg-surface-800 focus:ring-surface-700 dark:bg-surface-600 dark:hover:bg-surface-500',
  };
  
  return (
    <motion.button
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileTap={{ scale: 0.95 }}
      className={`fixed shadow-lg rounded-full ${positionClasses[position]} ${sizeClasses[size]} ${colorClasses[color]} z-20 focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      aria-label={label}
    >
      <div className="flex items-center justify-center">
        <span className={iconSizeClasses[size]}>
          {icon}
        </span>
      </div>
      
      {/* Label tooltip */}
      {(showLabel || isHovered) && label && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute right-full mr-2 bg-surface-800 dark:bg-surface-900 text-white px-2 py-1 rounded text-2xs whitespace-nowrap"
        >
          {label}
        </motion.div>
      )}
    </motion.button>
  );
};

export default FloatingActionButton;