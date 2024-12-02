import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Validation from './SignupValidation'
import axios from 'axios'

//code learned from https://youtu.be/F53MPHqOmYI?si=XuTNyzR7o-POqHBF

function Signup() {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password:''
    })


    const navigate = useNavigate();
    const [errors, setErrors] = useState({})


const handleInput = (event) => {
    // Fix the value assignment
    setValues(prev => ({
        ...prev, 
        [event.target.name]: event.target.value  // Remove the array brackets
    }))
}

const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        const response = await axios.post('http://localhost:8081/signup', values, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (response.status === 200) {
          navigate('/');
        }
      } catch (error) {
        if (error.response) {
          alert(error.response.data.message);
        } else {
          alert('Network error occurred');
        }
        console.error('Full error:', error);
      }
}

  return (
    <div style={{ backgroundColor: '#F0FFF0' }} className="d-flex justify-content-center align-items-center vh-100">
        <div className="bg-white p-3 rounded w-25">
        <h1 className="text-center"><strong>Welcome to SnackHack!</strong></h1>
            <h2>Sign Up</h2>
            <form action="" onSubmit = {handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name"><strong>Name</strong></label>
                    <input type="text" placeholder='Enter Name' name = 'name'
                    onChange = {handleInput} className='form-control rounded-0'/>
                    {errors.name && <span className = 'text-danger'>{errors.name}</span>}
                </div>
                <div className="mb-3">
                    <label htmlFor="email"><strong>Email</strong></label>
                    <input type="email" placeholder='Enter Email' name = 'email'
                    onChange = {handleInput} className='form-control rounded-0'/>
                    {errors.email && <span className = 'text-danger'>{errors.email}</span>}
                </div>
                <div className="mb-3">
                    <label htmlFor="password"><strong>Password</strong></label>
                    <input type="password" placeholder='Enter Password' name = 'password'
                    onChange = {handleInput} className='form-control rounded-0'/>
                    {errors.password && <span className = 'text-danger'>{errors.password}</span>}
                </div>
                <button style={{ borderRadius: '20px' }} type = 'submit' className='btn btn-success w-100 '>Sign up</button>
                <div className="mb-3"></div>
                <p>Password must include:</p>
                <ul>
                    <li>One capital letter</li>
                    <li>One lowercase letter</li>
                    <li>At least 8 characters</li>
                    <li>Only letters and/or numbers</li>
                </ul>
                <Link to="/" className='btn btn-outline-success w-100' style={{ borderRadius: '20px' }}>Login</Link>
            </form>
        </div>
    </div>
  )
}


export default Signup
