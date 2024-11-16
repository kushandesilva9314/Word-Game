import React from 'react';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import './App.css';
import LoginPage from './login';
import RegisterPage from './register';
import MainPage from './main';
import HomePage from './home';
import GamePage from './game';



function App() {
  return (
    <div className="App">
      
      < BrowserRouter>
      <Routes>
      <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/game" element={<GamePage />} />    
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
