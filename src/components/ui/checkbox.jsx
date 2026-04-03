import React from 'react';

const Checkbox = ({ id, checked, onCheckedChange, className = '', ...props }) => (
  <input
    id={id}
    type="checkbox"
    checked={checked}
    onChange={(e) => onCheckedChange?.(e.target.checked)}
    className={`h-5 w-5 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 cursor-pointer transition-colors ${className}`}
    {...props}
  />
);

export { Checkbox };
