import React from 'react';
import '../styles/landingHeader.scss';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';


const LandingHeader = () => {

   const navigate = useNavigate();


  return (
    <header className="landing-header">
      {/* Background Decorative Elements */}
      <div className="grid-overlay"></div>
      <div className="glow-sphere top-right"></div>
      <div className="glow-sphere bottom-left"></div>

      <NavBar />

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
          <button className="primary-btn" onClick={() => navigate('/generatereport')}>
            Generate Your Plan — Free
          </button>
          <button className="secondary-btn">
            View Sample Reports
          </button>
        </div>

      </div>
    </header>
  );
};

export default LandingHeader;