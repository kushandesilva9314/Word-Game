// src/LoginPage.js
import React from 'react';
import {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './register.css'; // Import the CSS file
import axios from 'axios';
import {useNavigate} from 'react-router-dom'

const Register = () => {
    
    const [values, setValues] = useState({
        Email: '',
        Username: '',
        Password: ''
    });

    const navigate = useNavigate(); 

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = async (event) =>{
        event.preventDefault();
        axios.post('http://localhost:8081/register',values)
        .then(res =>
        {
            console.log(res);
            navigate('/login')
        })
        .catch(err =>console.log(err));
    }

    return (
<div className="register-container">
<a href='/'>
      <div className="back-button">
        <FontAwesomeIcon icon={faArrowLeft} size="lg" />
      </div></a>
            
            <div className="form-container">
            <form onSubmit={handleSubmit}>
            <center><h2>Sign up</h2></center>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name='Email'
                      onChange={handleInput}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        name='Username'
                    onChange={handleInput}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        name='Password'
                      onChange={handleInput}
                        required
                    />
                </div>
                <center><button type="submit" className='reg-button'>Register</button></center>
            </form>
            <p className='Reg-Link'>
                Already have an account? <a href="/login">Login here</a>
            </p>
            </div>
        </div>
    );
};

export default Register;