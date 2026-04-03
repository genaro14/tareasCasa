import React from 'react';

const Button = ({ children, onClick, variant = 'primary', size = 'default', className = '', ...props }) => {
  let bgColor = '';
  let hoverBgColor = '';
  let textColor = 'text-white';

  switch (variant) {
    case 'destructive':
      bgColor = 'bg-destructive';
      hoverBgColor = 'hover:bg-red-700';
      break;
    case 'outline':
      bgColor = 'bg-transparent border border-gray-300';
      hoverBgColor = 'hover:bg-gray-100';
      textColor = 'text-foreground';
      break;
    case 'secondary':
      bgColor = 'bg-gray-200';
      hoverBgColor = 'hover:bg-gray-300';
      textColor = 'text-foreground';
      break;
    case 'ghost':
      bgColor = 'bg-transparent';
      hoverBgColor = 'hover:bg-gray-100';
      textColor = 'text-gray-700';
      break;
    case 'link':
      bgColor = 'bg-transparent';
      hoverBgColor = 'hover:underline';
      textColor = 'text-accent';
      break;
    case 'accent':
      bgColor = 'bg-accent';
      hoverBgColor = 'hover:bg-indigo-700';
      break;
    default:
      bgColor = 'bg-primary';
      hoverBgColor = 'hover:bg-teal-700';
  }

  const sizeClasses = size === 'sm' ? 'py-1.5 px-3 text-sm' : 'py-2.5 px-5';

  return (
    <button
      className={`${bgColor} ${hoverBgColor} ${textColor} ${sizeClasses} font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 inline-flex items-center justify-center whitespace-nowrap ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };
export default Button;
