import React from 'react';
import { useTheme } from '../layout/themeColor/ThemeContext';
import { Tag as AntdTag } from 'antd';
import { CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

const Tag = ({ children, style, className, status, ...rest }) => {
  const { theme } = useTheme();

  // Define theme-based styles
  const themeStyles = {
    backgroundColor:
      theme === 'light'
        ? status === true
          ? '#d8f685'
          : status === false
          ? '#ffd0d0'
          : undefined
        : status === true
        ? '#7f9e28'
        : status === false
        ? '#af1d1d'
        : undefined,
    color: theme === 'light' ? 'black' : 'white',
  };

  // Combine user-provided styles with theme-based styles
  const combinedStyles = {
    ...themeStyles,
    ...style, // Ensure user's custom styles are merged correctly
  };

  // Conditionally render the icon based on the status prop
  const icon =
    status !== undefined
      ? status === true
        ? <CheckCircleOutlined />
        : <CloseCircleOutlined style={{ color: 'red' }} />
      : null;

  return (
    <AntdTag className={className} style={combinedStyles} {...rest} icon={icon}>
      {children}
    </AntdTag>
  );
};

export default Tag;
