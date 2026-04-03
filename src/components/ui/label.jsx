import React from 'react';

const Label = React.forwardRef(({ children, className = '', ...props }, ref) => (
  <label
    ref={ref}
    className={`block text-sm font-medium text-gray-700 mb-1.5 ${className}`}
    {...props}
  >
    {children}
  </label>
));

Label.displayName = 'Label';

export { Label };
