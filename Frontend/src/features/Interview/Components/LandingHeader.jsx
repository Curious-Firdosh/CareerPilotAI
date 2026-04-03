import React from 'react';
import '../styles/landingHeader.scss';
import { useNavigate } from 'react-router';

const  LandingHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="landing-header">
      {/* Background Decorative Elements */}
      <div className="grid-overlay"></div>
      <div className="glow-sphere top-right"></div>
      <div className="glow-sphere bottom-left"></div>

      {/* Navigation */}
      <nav className="navbar">
        <div className="logo">
          CAREER<span className="highlight">PILOT</span> AI
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it Works</a>
          <button className="login-btn">Login</button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="hero-content">
        <div className="status-badge">
          <span className="dot"></span> SYSTEM ONLINE: VERSION 3.0.2
        </div>
        
        <h1 className="main-heading">
          Master Your Next <br />
          <span className="text-gradient">Technical Interview</span>
        </h1>

        <p className="subtext">
          Upload your resume and the job description. Our AI simulates high-stakes 
          technical rounds, identifies critical skill gaps, and builds a 
          personalized roadmap to your dream offer.
        </p>

        <div className="cta-group">
          <button className="primary-btn" onClick={() => navigate('/home')}>
            Generate Your Plan — Free
          </button>
          <button className="secondary-btn">
            View Sample Reports
          </button>
        </div>

        <div className="trust-bar">
          <span>TRUSTED BY DEVS AT:</span>
          <div className="company-logos">
            <span>GOOGLE</span>
            <span>META</span>
            <span>STRIPE</span>
            <span>VERCEL</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;