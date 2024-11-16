import React from "react";
import "./home.css"; // Assuming you have an App.css for custom styling
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {useEffect,useState} from 'react'


// Define the username and streak as props or state values
const username = "Username"; // Replace with dynamic username if available
const streakCount = 5; // Replace with dynamic streak count if available

const Home = () => {

  const [name, setName]= useState('')

  useEffect(()=>{
    axios.get('http://localhost:8081/home')
    .then(res =>{
      if(res.data.valid){
        setName(res.data.Username)
      }else{
        navigate('/login')
      }
    })
    .catch(err=>console.log(err))
  },[])

  axios.defaults.withCredentials=true;
  const navigate = useNavigate();

  const quit = () => {
    axios.post('http://localhost:8081/logout') // Replace with your actual logout endpoint
      .then(() => {
        navigate('/'); // Redirect to login page after logout
      })
      .catch(err => console.error("Logout failed:", err));
  };
  

  const openGame = () => {
    navigate('/game');
  };
  
  return (
    <div className="containe">
      <header className="header">
        <div className="username">Username : {name}</div>
        <div className="streak">
          <span role="img" aria-label="streak">
            🔥
          </span>
          {streakCount}
        </div>
      </header>
      <main className="main-content">
        <button className="button" onClick={openGame}>Play</button>
        <button className="button">
          <span role="img" aria-label="streak">
            🌟
          </span>
          Special Mode
        </button>
        <button className="button" onClick={quit}>Quit</button>
      </main>
    </div>
  );
};

export default Home;
