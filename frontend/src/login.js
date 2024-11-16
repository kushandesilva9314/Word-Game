// src/LoginPage.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './login.css'; // Import the CSS file
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
import {useState, useEffect} from 'react'


const Login = () => {


  const [values, setValues] = useState({
    
    Username: '',
    Password: ''

  });


  const navigate = useNavigate(); 

  useEffect(()=>{
    axios.get('http://localhost:8081/home')
    .then(res =>{
      if(res.data.valid){
        navigate('/home');
      }else{
        navigate('/login');
      }
    })
    .catch(err=>console.log(err))
  },[])


  const handleInput = (event) => {
    setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));

  };

 axios.defaults.withCredentials=true;
  const handleSubmit = (event) =>{
  event.preventDefault();
  axios.post('http://localhost:8081/login',values)
  .then(res =>
  {
      if(res.data.Login){
      navigate('/home')}
      else{
        alert("No record")
      }
      console.log(res);
  })
  .catch(err =>console.log(err));
}

  return (
    <div className="login-container"><a href='/'>
      <div className="back-button">
        <FontAwesomeIcon icon={faArrowLeft} size="lg" />
      </div></a>
      <div className="login-box">
      <h2 className='text-dark mb-4'>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name='Username' onChange={handleInput} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name='Password' onChange={handleInput}  required />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        <center><p className="signup-link">Haven't got an account? <a href="/register">Sign up</a></p></center>
      </div>
    </div>
  );
};

export default Login;
