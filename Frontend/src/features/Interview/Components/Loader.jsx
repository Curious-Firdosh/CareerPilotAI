import React, { useState, useEffect } from 'react';
import './loader.scss';

const Loader = ({ isComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) return 98; // Hold for API
        return prev + Math.floor(Math.random() * 5) + 1;
      });
    }, 150);


    return () => clearInterval(timer);
  }, [isComplete]);

  return (
    <div className="brutal-loader-overlay">
      <div className="loader-container">
        {/* The Animated Spinner Ring */}
        <div className="spinner-box">
          <div className="circle-outer"></div>
          <div className="circle-inner"></div>
          <div className="scan-line"></div>
          <div className="percentage-display">
            <span className="number">{progress}</span>
            <span className="unit">%</span>
          </div>
        </div>

        {/* Textual Feedback */}
        <div className="text-content">
          <h3 className="loading-status">ANALYZING CANDIDATE MATRIX</h3>
          <p className="loading-subtext">
            {progress < 40 && "Initializing neural parsing..."}
            {progress >= 40 && progress < 80 && "Evaluating skill-gap correlations..."}
            {progress >= 80 && progress < 100 && "Synthesizing final report..."}
            {progress === 100 && "Report Decrypted. Accessing..."}
          </p>
        </div>

        {/* Subtle Progress Bar at Bottom */}
        <div className="bottom-bar">
          <div className="fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;