import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Validation from './LoginValidation'
import axios from 'axios'

//code learned from https://youtu.be/F53MPHqOmYI?si=XuTNyzR7o-POqHBF

function Login() {
    const [values, setValues] = useState({
        email: '',
        password:''
    })

    const navigate = useNavigate();


    const [errors, setErrors] = useState({})


    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
    }


    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(Validation(values))
        if(errors.email === "" && errors.password === ""){
            axios.post('http://localhost:8081/login', values)
            .then(res => {
                if(res.data === "Success"){
                    navigate('/home')
                } else {
                    alert("No record exists")
                }
            })
            .catch(error => console.log(error));
        }
    }


  return (
    <div style={{ backgroundColor: '#F0FFF0' }} className="d-flex justify-content-center align-items-center vh-100">
        <div className="bg-white p-3 rounded w-25">
        <h1 className="text-center"><strong>Welcome to SnackHack!</strong></h1>
        <h2>Login</h2>
            <form action="" onSubmit = {handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email"><strong>Email</strong></label>
                    <input type="email" placeholder='Enter Email' name='email'
                    onChange = {handleInput} className='form-control rounded-0'/>
                    {errors.email && <span className = 'text-danger'>{errors.email}</span>}
                </div>
                <div className="mb-3">
                    <label htmlFor="password"><strong>Password</strong></label>
                    <input type="password" placeholder='Enter Password' name='password'
                    onChange = {handleInput} className='form-control rounded-0'/>
                    {errors.password && <span className = 'text-danger'>{errors.password}</span>}
                </div>
                <button style={{ borderRadius: '20px' }} type = 'submit' className='btn btn-success w-100'>Log in</button>
                <div className = "mb-3"> </div>
                <Link to="/signup" className='btn btn-outline-success w-100' style={{ borderRadius: '20px' }}>Create Account</Link>
            </form>
        </div>
    </div>
  )
}

export default Login
