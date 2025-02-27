import React, { useState, useEffect } from "react";
import "./SafetyMeasures.css";
import { Link } from "react-router-dom";
import alertlogo from "./images/alertlogo.png";
import homeIcon from './images/home.png';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FaPhoneAlt, FaComments, FaShoppingCart, FaRobot } from "react-icons/fa";
import navigationIcon from './images/navigation.jpg';
import profileIcon from './images/profile.png';
import otherAlertsIcon from "./images/other_alerts.png"; 
import safetyIcon from "./images/safety.png";
import "./chatbot.css"
import { useNavigate } from "react-router-dom";

const safetyTips = [
  {
    title: "Stay Aware of Your Surroundings",
    description: "Avoid distractions like headphones in unknown areas. Always be conscious of who is around you.",
    image: "https://source.unsplash.com/400x250/?safety,woman"
  },
  {
    title: "Emergency Contacts",
    description: "Keep important numbers like 1091 (Women's Helpline) and close family on speed dial.",
    image: "https://source.unsplash.com/400x250/?phone,call"
  },
  {
    title: "Self-Defense Basics",
    description: "Learn basic self-defense moves to protect yourself in emergency situations.",
    image: "https://source.unsplash.com/400x250/?self-defense"
  },
  {
    title: "Mental Health Support",
    description: "Seek support if you're feeling overwhelmed. Therapy and helplines can be valuable resources.",
    image: "https://source.unsplash.com/400x250/?mentalhealth,support"
  },
  {
    title: "Safe Online Practices",
    description: "Do not share personal information with strangers online. Be cautious of social media privacy settings.",
    image: "https://source.unsplash.com/400x250/?cybersecurity,privacy"
  },
  {
    title: "Public Transport Safety",
    description: "Sit near the driver or in well-lit areas in public transport. Avoid empty compartments.",
    image: "https://source.unsplash.com/400x250/?bus,travel"
  },
  {
    title: "Financial Independence",
    description: "Learn about financial management and online banking security for better independence.",
    image: "https://source.unsplash.com/400x250/?finance,women"
  }
];

const SafetyMeasures = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const nextSlide = () => setCurrentIndex((prevIndex) => (prevIndex + 1) % safetyTips.length);
  const prevSlide = () => setCurrentIndex((prevIndex) => (prevIndex - 1 + safetyTips.length) % safetyTips.length);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  // Create the chatbot on mount
  useEffect(() => {
    createChatbot(); // This will set up the chatbot
  }, []);

  return (
    <div className="safety-container">
      <h1 className="safety-title">Safety Measures for Women</h1>
      <div className="slideshow">
        <button className="nav-btn left" onClick={prevSlide}><FaArrowLeft /></button>
        <div className="slide">
          <img src={safetyTips[currentIndex].image} alt="Safety Tip" className="slide-image" />
          <h2>{safetyTips[currentIndex].title}</h2>
          <p>{safetyTips[currentIndex].description}</p>
        </div>
        <button className="nav-btn right" onClick={nextSlide}><FaArrowRight /></button>
      </div>

      <div className="grid-container">
        <div className="grid-item emergency-section">
          <h2><FaPhoneAlt /> Women's Helpline</h2>
          <ul>
            <li>1091 (Women's Helpline)</li>
            <li>112 (General Emergency)</li>
            <li>181 (Domestic Abuse)</li>
          </ul>
        </div>

        <div className="grid-item stories-section">
          <h2><FaComments /> Women's Safety Stories</h2>
          <ul>
            <li>Share experiences, report incidents, and help others stay safe.</li>
          </ul>
          <button className="discussion-btn">Join the Discussion</button>
        </div>

        <div className="grid-item gadgets-section">
          <h2><FaShoppingCart /> Recommended Safety Gadgets</h2>
          <ul>
            <li>Pepper Spray</li>
            <li>Personal Safety Alarm</li>
            <li>GPS Tracker</li>
            <li>Anti-Harassment Wearables</li>
          </ul>
        </div>

        <div className="grid-item chatbot-section">
          <h2><FaRobot /> Safety Chatbot</h2>
          <ul>
            <li>Ask for safety tips, emergency contacts, or report incidents anonymously.</li>
          </ul>
          <button className="chat-btn">Chat Now</button>
        </div>
      </div>

      <div className="navbar">
        <div className="nav-item">
          <Link to="/" className="nav-link">
            <img src={homeIcon} alt="Home" className="contact-image" />
            <span className="nav-text">Home</span>
          </Link>
        </div>

        <div className="nav-item">
          <Link to="/navigation" className="nav-link">
            <img src={navigationIcon} alt="Navigation" className="contact-image" />
            <span className="nav-text">Navigation</span>
          </Link>
        </div>

        <div className="nav-item">
          <Link to="/profile" className="nav-link">
            <img src={profileIcon} alt="Profile" className="contact-image" />
            <span className="nav-text">Profile</span>
          </Link>
        </div>

        <div className="nav-item">
          <Link to="/other-alerts" className="nav-link">
            <img src={otherAlertsIcon} alt="Other Alerts" className="contact-image" />
            <span className="nav-text">Other Alerts <span style={{ color: "red" }}>!</span></span>
          </Link>
        </div>

        <div className="nav-item">
          <Link to="/safetymeasures" className="nav-link">
            <img src={safetyIcon} alt="Safety Measures" className="contact-image" />
            <span className="nav-text">Safety Measures</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Add this function to your script
function createChatbot() {
  // Check if the chatbot container already exists
  if (document.getElementById('chatbot-container')) return;

  // Create the chatbot container and add it to the body
  const chatbotContainer = document.createElement('div');
  chatbotContainer.id = 'chatbot-container';
  chatbotContainer.style.display = 'none';
  document.body.appendChild(chatbotContainer);

  // Create the chat window (hidden initially)
  const chatWindow = document.createElement('div');
  chatWindow.id = 'chat-window';
  chatbotContainer.appendChild(chatWindow);

  // Create chatbox to hold messages
  const chatbox = document.createElement('div');
  chatbox.id = 'chatbox';
  chatWindow.appendChild(chatbox);

   // Create the close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '×'; // Close symbol
    closeButton.classList.add('close-btn');
    chatWindow.appendChild(closeButton);

  // Create an input field for user to type messages
  const userInput = document.createElement('input');
  userInput.id = 'user-input';
  userInput.placeholder = 'Type a message...';
  chatWindow.appendChild(userInput);

  // Create a send button
  const sendButton = document.createElement('button');
  sendButton.textContent = 'Send';
  sendButton.id = 'send-btn';
  chatWindow.appendChild(sendButton);

  // Event listener for send button to process user input
  sendButton.addEventListener('click', function () {
    const message = userInput.value.trim();
    if (message) {
      displayMessage(message, 'user');
      userInput.value = ''; // Clear input field
      sendToBot(message);
    }
  });

   // Event listener for close button to hide the chatbot
    closeButton.addEventListener('click', function () {
        chatbotContainer.style.display = 'none';
    });

  // Function to display messages in the chatbox
  function displayMessage(message, sender) {
    const messageElement = document.createElement('p');
    messageElement.classList.add(sender);
    messageElement.textContent = message;
    chatbox.appendChild(messageElement);
    chatbox.scrollTop = chatbox.scrollHeight; // Auto-scroll to the bottom
  }

  // Function to send the message to the bot and get a reply (using DeepSeek AI API)
  async function sendToBot(userMessage) {
    try {
      const response = await fetch('https://api.deepseek.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'sk-2f855f2aea944873af52a119e80038fd', // Replace with your actual API key
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      const botReply = data.reply || "Sorry, I didn't understand that.";
      displayMessage(botReply, 'bot');
    } catch (error) {
      console.error('Error with API call:', error);
      displayMessage('Sorry, there was an issue. Please try again later.', 'bot');
    }
  }

  // Function to show the chatbot when the "Chat Now" button is clicked
  const chatNowButton = document.querySelector('.chat-btn');
  chatNowButton.addEventListener('click', function () {
    chatbotContainer.style.display = chatbotContainer.style.display === 'none' ? 'block' : 'none';
  });
}

export default SafetyMeasures;

