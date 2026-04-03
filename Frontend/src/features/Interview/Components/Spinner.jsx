import React from 'react';
import '../styles/Spinner.scss';

const LoadingSpinner = ({ isLoading, children }) => {
  if (!isLoading) return children;

  return (
    <div className="spinner-container">
      <div className="ai-spinner">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
      <p>Loading...</p>
    </div>
  );
};

export default LoadingSpinner;