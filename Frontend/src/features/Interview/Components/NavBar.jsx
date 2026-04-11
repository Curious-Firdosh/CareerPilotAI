import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Diamond, LogOut, Zap, Home } from 'lucide-react';
import { useGetme, useLogout } from '../../auth/Hooks/useAuth';
import '../styles/NavBar.scss';

const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isHomePage = location.pathname === '/';
    const logOutMutation = useLogout();

    // Fetch user data safely
    const { data: user } = useGetme();

    const handleLogout = () => {
        logOutMutation.mutate();
    };

    return (
        <nav className="career-pilot-navbar">
            <div className="logo">
                CAREER<span className="highlight">PILOT</span> AI
            </div>

            <div className="nav-links">

                {/* CREDITS DISPLAY */}
                {user && (
                    <div className="credits-display">
                        <Diamond size={18} color="#1e90ff" fill="rgba(30, 144, 255, 0.2)" />
                        <span>{user?.credits} Credits</span>
                    </div>
                )}

                {/* UPGRADE BUTTON */}
                <button
                    className="secondary-btn"
                    onClick={() => navigate('/upgrade')}
                >
                    <Zap size={15} color="#ff2d78" /> Upgrade
                </button>

                {/* CONDITIONAL ACTION BUTTON */}
                {isHomePage ? (
                    <button
                        className="login-btn"
                        onClick={handleLogout}
                        disabled={logOutMutation.isPending}
                    >
                        LogOut
                        <LogOut size={15} />
                    </button>
                ) : (
                    <button
                        className="login-btn"
                        onClick={() => navigate('/')}
                    >
                        Go Home
                        <Home size={15} />
                    </button>
                )}
                
            </div>
        </nav>
    );
};

export default NavBar;