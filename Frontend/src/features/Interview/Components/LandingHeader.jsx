import React from 'react';
import '../styles/landingHeader.scss';
import { useNavigate } from 'react-router';
import { Diamond, LogOut, Zap } from 'lucide-react';
import { useGetme, useLogout } from '../../auth/Hooks/useAuth';

const LandingHeader = () => {
  const navigate = useNavigate();
  const logOutMutation = useLogout();

  // Fetch user data safely
  const { data: userData } = useGetme();
  const user = userData?.data;

  const handleLogout = () => {
    logOutMutation.mutate();
  };

  
  // Assuming navigate is already defined via useNavigate() in your component

  if (user && user.credits === 0) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4rem 1rem'
      }}>
        <div style={{
          background: '#161b22', // Matches your $bg-card
          border: '1px solid #30363d', // Matches your $border-color
          borderRadius: '16px',
          padding: '3rem 2rem',
          textAlign: 'center',
          maxWidth: '450px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
        }}>
          {/* Grayed out diamond to visually represent empty credits */}
          <Diamond size={48} color="#7d8590" strokeWidth={1.5} style={{ marginBottom: '1rem' }} />

          <h2 style={{
            color: '#e6edf3',
            fontSize: '1.75rem',
            fontWeight: '600',
            margin: '0 0 0.75rem 0'
          }}>
            Out of Credits
          </h2>

          <p style={{
            color: '#7d8590',
            fontSize: '1rem',
            lineHeight: '1.5',
            margin: '0 0 2rem 0'
          }}>
            You have used up all your AI generations. Upgrade your plan to continue building personalized interview strategies and land your dream role.
          </p>

          <button
            // Reusing your existing primary button style logic
            className="primary-button"
            onClick={() => navigate('/upgrade')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              backgroundColor: '#ff2d78', // Your accent color
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <Zap size={18} fill="currentColor" />
            Upgrade to Premium
          </button>
        </div>
      </div>
    );
  }

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

        <div className="nav-links" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>

          {/* CREDITS DISPLAY */}
          {user && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#e6edf3',
                fontWeight: '600',
                paddingRight: '0.5rem'
              }}
            >
              <Diamond size={18} color="#1e90ff" fill="rgba(30, 144, 255, 0.2)" />
              <span>{user.credits} Credits</span>
            </div>
          )}

          {/* UPGRADE BUTTON */}
          <button
            className="secondary-btn"
            onClick={() => navigate('/upgrade')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '8px 16px' }}
          >
            <Zap size={15} color="#ff2d78" /> Upgrade
          </button>

          {/* LOGOUT BUTTON */}
          <button
            className="login-btn"
            onClick={handleLogout}
            disabled={logOutMutation.isPending}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            {'LogOut'}
            <LogOut size={15} />
          </button>
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