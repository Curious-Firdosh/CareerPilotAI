import React, { useState } from 'react'
import '../auth.form.scss'
import { Link, useNavigate } from 'react-router'
import { useRegister } from '../Hooks/useAuth'

const Register = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')

    const RegisterUser = useRegister()
    const Navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()

        RegisterUser.mutate(
            { username, email, password },
            {
                onSuccess: () => {
                    Navigate('/')
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
                        <h2>"Unlock your potential. Build your personalized interview strategy today."</h2>
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
                    <h1>Create an Account</h1>
                    <p className="subtitle">Start your journey with Interviewlyyy</p>

                    <form onSubmit={handleSubmit}>
                        <div className='input-group'>
                            <label htmlFor='username'>Username</label>
                            <input
                                type='text'
                                id='username'
                                name='username'
                                placeholder='Enter Username'
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className='input-group'>
                            <label htmlFor='email'>Email</label>
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
                            type='submit'
                            disabled={RegisterUser.isPending}
                        >
                            {RegisterUser.isPending ? "Creating..." : "Register"}
                        </button>
                    </form>

                    <p className="footer-text">
                        Already have an account? <Link to={'/login'}>Log in here</Link>
                    </p>
                </div>
            </div>
        </main>
    )
}

export default Register