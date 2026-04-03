import React, { useState, useEffect } from 'react';
import '../styles/PdfLoader.scss';

const loadingMessages = [
  "Extracting resume data...",
  "Synthesizing job description...",
  "Optimizing for ATS compliance...",
  "Applying premium LaTeX styling...",
  "Compiling HTML layout...",
  "Spinning up Chromium engine...",
  "Painting PDF document..."
];

export const PdfLoader = () => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Simulate progress bar filling up to 90% (leaving 10% for the actual download to finish)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90; 
        }
        // Randomize the jump slightly so it feels organic
        return prev + Math.floor(Math.random() * 10) + 1;
      });
    }, 600);

    // Cycle through the "hacker/tech" loading messages
    const textInterval = setInterval(() => {
      setMessageIndex((prev) => {
        if (prev < loadingMessages.length - 1) return prev + 1;
        return prev; // Stop at the last message
      });
    }, 1800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, []);

  return (
    <div className="pdf-loader-overlay">
      <div className="loader-container">
        
        {/* The Spinners & Dots */}
        <div className="spinner-box">
          <div className="circle-outer"></div>
          <div className="circle-inner"></div>
          <div className="scan-line"></div>
          
          <div className="ai-spinner">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>

        {/* Text & Progress */}
        <div className="text-content">
          <div className="loading-status">Generating PDF</div>
          <div className="loading-subtext"> {loadingMessages[messageIndex]}</div>
        </div>

        <div className="bottom-bar">
          <div className="fill" style={{ width: `${progress}%` }}></div>
        </div>

      </div>
    </div>
  );
};