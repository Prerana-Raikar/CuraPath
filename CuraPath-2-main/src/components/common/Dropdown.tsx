import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  divider?: boolean;
}

interface DropdownProps {
  label: string;
  items: DropdownItem[];
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  items,
  variant = 'secondary',
  size = 'md',
  className = ''
}) => {
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300',
    outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <Menu as="div" className={`relative inline-block text-left ${className}`}>
      <div>
        <Menu.Button className={`inline-flex justify-center items-center w-full rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${variantClasses[variant]} ${sizeClasses[size]}`}>
          {label}
          <ChevronDownIcon className="ml-2 -mr-1 h-5 w-5" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {items.map((item, index) => (
              <Fragment key={index}>
                {item.divider && <div className="border-t border-gray-100 my-1" />}
                <Menu.Item disabled={item.disabled}>
                  {({ active }) => (
                    <button
                      onClick={item.onClick}
                      disabled={item.disabled}
                      className={`group flex items-center w-full px-4 py-2 text-sm ${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {item.icon && (
                        <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                      )}
                      {item.label}
                    </button>
                  )}
                </Menu.Item>
              </Fragment>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Dropdown;