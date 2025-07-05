import React from 'react';
import classNames from 'classnames';

export const Button = ({ children, className, ...props }) => {
  return (
    <button
      className={classNames(
        'inline-flex items-center justify-center font-medium rounded-xl px-4 py-2',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
