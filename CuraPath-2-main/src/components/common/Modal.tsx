import React, { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = ''
}) => {
  const sizeClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
    full: 'max-w-full mx-4'
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog 
        as="div" 
        className="relative z-50" 
        onClose={closeOnOverlayClick ? onClose : () => {}}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-500"
              enterFrom="opacity-0 scale-90 translate-y-8 rotate-1"
              enterTo="opacity-100 scale-100 translate-y-0 rotate-0"
              leave="ease-in duration-300"
              leaveFrom="opacity-100 scale-100 translate-y-0 rotate-0"
              leaveTo="opacity-0 scale-90 translate-y-8 rotate-1"
            >
              <Dialog.Panel className={`w-full ${sizeClasses[size]} transform overflow-hidden medical-glass rounded-3xl shadow-2xl transition-all hover-medical relative ${className}`}>
                {/* Medical border effects */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary-100/30 via-white/20 to-primary-200/30 p-[1px]">
                  <div className="h-full w-full rounded-3xl bg-white/95"></div>
                </div>
                
                {/* Medical accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-t-3xl"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {(title || showCloseButton) && (
                    <div className="flex items-start justify-between p-8 pb-6">
                      <div className="flex-1">
                        {title && (
                          <Dialog.Title className="text-2xl font-bold medical-text-gradient mb-2">
                            {title}
                          </Dialog.Title>
                        )}
                        {description && (
                          <Dialog.Description className="text-sm text-slate-600 font-medium">
                            {description}
                          </Dialog.Description>
                        )}
                      </div>
                      {showCloseButton && (
                        <button
                          onClick={onClose}
                          className="ml-6 p-3 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all duration-300 hover:scale-110"
                        >
                          <XMarkIcon className="w-6 h-6" />
                        </button>
                      )}
                    </div>
                  )}
                  <div className={title || showCloseButton ? 'px-8 pb-8' : 'p-8'}>
                    {children}
                  </div>
                </div>
                
                {/* Holographic corner effects */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-bl-3xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-tr-3xl"></div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;