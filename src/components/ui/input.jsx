import React from 'react';
import classNames from 'classnames';

export const Input = ({ className, ...props }) => {
  return (
    <input
      className={classNames(
        'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
        className
      )}
      {...props}
    />
  );
};
