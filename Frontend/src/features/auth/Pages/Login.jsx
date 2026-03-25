import React, { useState } from 'react'
import '../auth.form.scss'
import { Link, useNavigate } from 'react-router'
import { useLogin } from '../Hooks/useAuth'


const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    

    const login = useLogin()
    const Navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()


        login.mutate(
            { email, password },
            {
                onSuccess: () => {
                    Navigate('/')
                }
            }
        )
    }


    return (
        <main>
            <div className='form-container'>

                <h1>Login</h1>

                <form onSubmit={handleSubmit}>

                    <div className='input-group'>
                        <label htmlFor='email'>Email</label>
                        <input
                            type='text'
                            id='email'
                            name='email'
                            placeholder='Enter Registerd Email'
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className='input-group'>
                        <label htmlFor='password'>Password</label>
                        <input
                            type='text'
                            id='password'
                            name='password'
                            placeholder='Enter Password'
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        className='button primary-button'
                        disabled={login.isPending}
                    >
                        {login.isPending ? "Loading..." : "Login"}
                    </button>
                </form>

                <p>
                    Dont Have Account ?? <Link to={'/register'}>Register To Make Account</Link>
                </p>
            </div>
        </main>
    )
}

export default Login
