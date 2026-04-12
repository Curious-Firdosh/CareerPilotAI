import React, { useState, useEffect } from 'react';
import '../../Interview/styles/PremiumLoader.scss'; 

const loadingMessages = [
  "Waking up the AI engines...",
  "Establishing secure connection...",
  "Fetching your workspace...",
  "Just a few more seconds...",
];

const PremiumLoader = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Trigger the fade-out CSS class
      setFade(false);

      // 2. Wait for the fade-out to finish (300ms), then change text and fade back in
      setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
        setFade(true);
      }, 300); 

    }, 4500); // Cycle every 4.5 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="premium-loader-container">
      <div className="glass-card">
        <div className="content-wrapper">
          <div className="spinner"></div>
          
          <div className="message-container">
            <p className={`animated-text ${fade ? 'fade-in' : 'fade-out'}`}>
              {loadingMessages[messageIndex]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumLoader;