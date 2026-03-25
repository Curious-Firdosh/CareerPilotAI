import React, { useState } from 'react'
import '../auth.form.scss'
import { Link, useNavigate } from 'react-router'
import { useRegister } from '../Hooks/useAuth'


const Register = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const[username , setUsername] = useState('')

    const RegisterUser = useRegister()
    const Navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        
        RegisterUser.mutate(
            {username , email , password},
            {
                onSuccess : () => {
                    Navigate('/')
                }
            }
        )
       
    }




    return (
        <main>
            <div className='form-container'>

                <h1>Create An Account To Contineue</h1>


                <form onSubmit={handleSubmit}>


                    <div className='input-group'>
                        <label htmlFor='username'>Username</label>
                        <input 
                            type='text' 
                            id='username' 
                            name='username' 
                            placeholder='Enter Username' 
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>



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
                        type='submit'
                        disabled = {RegisterUser.isPending}
                    >
                        {RegisterUser.isPending ? "Creating...." : "Register"}
                    </button>

                </form>

                <p >
                    Already Have an Account ?? <Link to={'/login'}>Login</Link>
                </p>
            </div>
        </main>
    )
}

export default Register
