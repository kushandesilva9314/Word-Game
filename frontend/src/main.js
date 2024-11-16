import React from 'react';
import './main.css';


const main = () => {

    return (
        <div className="main">
     <div className="white-box">
        <h2 className='text-dark custom-margin'>How to Play</h2>
        <p>Guess the 5-letter word with in 5 tries. Each guess must be a valid word. Get a 4 streak to unlock a special mode.</p>
        <div className="buttons">
          <a href='/login'><button className="custom-button">Login</button></a>
          <a href='/register'><button className="custom-button" >Register</button></a>
        </div>
      </div>
    </div>
    );
  };
  
  export default main;