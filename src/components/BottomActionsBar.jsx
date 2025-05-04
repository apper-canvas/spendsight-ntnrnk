import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import getIcon from '../utils/iconUtils';

const CloseIcon = getIcon('X');

const BottomActionsBar = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'bottom',
  height = 'auto',
}) => {
  const positionVariants = {
    bottom: {
      hidden: { y: 100, opacity: 0 },
      visible: { y: 0, opacity: 1 },
      exit: { y: 100, opacity: 0 }
    },
    top: {
      hidden: { y: -100, opacity: 0 },
      visible: { y: 0, opacity: 1 },
      exit: { y: -100, opacity: 0 }
    },
    right: {
      hidden: { x: 100, opacity: 0 },
      visible: { x: 0, opacity: 1 },
      exit: { x: 100, opacity: 0 }
    },
    left: {
      hidden: { x: -100, opacity: 0 },
      visible: { x: 0, opacity: 1 },
      exit: { x: -100, opacity: 0 }
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const heightClasses = {
    'auto': 'max-h-[70vh]',
    'small': 'h-24',
    'medium': 'h-48',
    'large': 'h-72',
    'full': 'h-[calc(100vh-5rem)]',
  };

  const positionClasses = {
    'bottom': 'bottom-12 md:bottom-0 left-0 right-0',
    'top': 'top-12 md:top-0 left-0 right-0',
    'right': 'right-0 top-0 bottom-0',
    'left': 'left-0 top-0 bottom-0',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay - SLDS modal backdrop */}
          <motion.div
            key="backdrop"
            className="slds-modal__backdrop"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={backdropVariants}
            onClick={onClose}
          />
          
          {/* Action bar - SLDS modal container */}
          <motion.div
            key="actionbar"
            className={`fixed ${positionClasses[position]} ${heightClasses[height]} bg-white dark:bg-surface-800 shadow-card dark:shadow-none border border-surface-200 dark:border-surface-700 rounded-t-md md:rounded-none z-50 overflow-hidden`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={positionVariants[position]}
          >
            {/* Header with title and close button - SLDS modal header */}
            <div className="slds-modal__header">
              <h3 className="text-sm font-medium text-surface-800 dark:text-surface-100">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500 dark:text-surface-400"
                aria-label="Close"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>
            
            {/* Content - SLDS modal content */}
            <div className="slds-modal__content">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BottomActionsBar;