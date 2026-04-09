import React, { useState } from 'react'
import '../auth.form.scss'
import { Link, useNavigate } from 'react-router-dom'
import { useLogin } from '../Hooks/useAuth'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const login = useLogin()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        login.mutate(
            { email, password },
            {
                onSuccess: () => {
                    navigate('/')
                }
            }
        )
    }

    return (
        <main className="auth-layout">
            {/* LEFT SIDE: AI Branding & Quote */}
            <div className="auth-brand">
                <div className="brand-content">
                    {/* Replace this div with your actual <img src={logo} /> */}
                    <div className="logo-placeholder">

                        <div className="logo">
                            CAREER<span className="highlight">PILOT</span> AI
                        </div>
                    </div>

                    <div className="quote-container">
                        <h2>"Master your next interview with the precision of Artificial Intelligence."</h2>
                        <p>Join thousands of professionals landing their dream jobs.</p>
                    </div>
                </div>

                {/* Decorative AI Glow Elements */}
                <div className="glow-orb orb-1"></div>
                <div className="glow-orb orb-2"></div>
            </div>

            {/* RIGHT SIDE: The Form */}
            <div className="auth-form-wrapper">
                <div className='form-container'>
                    <h1>Welcome back</h1>
                    <p className="subtitle">Log in to your account to continue</p>

                    <form onSubmit={handleSubmit}>
                        <div className='input-group'>
                            <label htmlFor='email'>Email Address</label>
                            <input
                                type='email'
                                id='email'
                                name='email'
                                placeholder='name@company.com'
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className='input-group'>
                            <label htmlFor='password'>Password</label>
                            <input
                                type='password'
                                id='password'
                                name='password'
                                placeholder='••••••••'
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            className='button primary-button'
                            disabled={login.isPending}
                            type="submit"
                        >
                            {login.isPending ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <p className="footer-text">
                        Don't have an account?{" "}
                        <Link to="/register" className="link-button">
                            Start for free
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    )
}

export default Login