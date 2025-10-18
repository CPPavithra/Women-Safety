import React from 'react';
import './LoginPage.css'; // Import the new CSS
import sihpic from './images/sih.png'; 

const LoginPage = ({ onLogin }) => { // Kept 'onLogin' prop
  return (
    <div className="login-page"> 
      <div className="login-container">
        <h1>SHE-curity</h1>
        <h4>Empowering Safety, <br /> Every step of the way.</h4>
        
        <div className="main-image-wrapper"> 
          <img src={sihpic} alt="Empowering Safety" className="main-image" />
        </div>
        
        {/* Kept 'login-button' class and 'Login' text */}
        <button className="login-button" onClick={onLogin}>
          Get Started 
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
