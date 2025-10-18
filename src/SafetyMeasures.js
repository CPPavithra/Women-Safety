import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from './NavBar'; // Import the unified Navbar

// --- Self-Contained Assets ---

// 1. SVG Icons (replaces react-icons and file imports)
const BackIcon = () => <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>;
const ArrowLeftIcon = () => <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>;
const ArrowRightIcon = () => <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>;
const PhoneIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const CommentsIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
const GadgetsIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h-1a4 4 0 0 0-4-4h-2a4 4 0 0 0-4 4H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2z"></path><path d="M12 18v-2M12 12V4M12 12h-2m4 0h-2"></path></svg>;
const RobotIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8V4m0 4H8m4 0h4M8 12v4m8-4v4m-4-4h.01M8 16h8"></path><rect x="4" y="2" width="16" height="20" rx="2"></rect></svg>;
const SendIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>;
const CloseIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

// 2. Embedded CSS for the entire page
const SafetyMeasuresStyles = () => <style>{`
  /* Main Page Container */
  .safety-container {
    display: flex; flex-direction: column; min-height: 100vh;
    background-color: #1A1D2F; color: #F0F0F0;
    font-family: 'Poppins', sans-serif;
    padding: 1rem; padding-bottom: 100px;
  }
  .safety-header {
    width: 100%; display: flex; align-items: center; justify-content: center;
    position: relative; padding: 1rem 0;
  }
  .safety-title { font-size: 1.5rem; font-weight: 600; text-align: center; margin: 0; }

  /* Slideshow/Carousel */
  .slideshow {
    position: relative; width: 100%; max-width: 600px;
    margin: 1.5rem auto; border-radius: 20px;
    overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  }
  .slide {
    position: relative; text-align: center; color: white;
    min-height: 250px; display: flex; flex-direction: column;
    align-items: center; justify-content: flex-end;
    padding: 1.5rem; box-sizing: border-box;
  }
  .slide-image {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    object-fit: cover; z-index: 1;
    filter: brightness(0.6);
  }
  .slide h2, .slide p { position: relative; z-index: 2; text-shadow: 0 2px 5px rgba(0,0,0,0.5); }
  .slide h2 { font-size: 1.4rem; margin: 0 0 0.5rem 0; }
  .slide p { font-size: 0.9rem; margin: 0; }
  .nav-btn {
    position: absolute; top: 50%; transform: translateY(-50%);
    background: rgba(0,0,0,0.4); border: none; color: white;
    border-radius: 50%; width: 40px; height: 40px;
    cursor: pointer; z-index: 3; display: flex;
    align-items: center; justify-content: center;
    transition: background-color 0.2s ease;
  }
  .nav-btn:hover { background: rgba(0,0,0,0.7); }
  .nav-btn.left { left: 10px; }
  .nav-btn.right { right: 10px; }
  .nav-btn svg { width: 20px; height: 20px; }

  /* Grid Container */
  .grid-container {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px; width: 100%; max-width: 800px; margin: 1.5rem auto 0;
  }
  .grid-item {
    background: #2A2D3F; border-radius: 15px; padding: 20px;
    display: flex; flex-direction: column;
    border: 1px solid #3a3e52;
  }
  .grid-item h2 {
    display: flex; align-items: center; gap: 10px;
    font-size: 1.1rem; font-weight: 600; margin: 0 0 15px 0; color: #FFFFFF;
  }
  .grid-item h2 svg { width: 24px; height: 24px; stroke: #007BFF; }
  .grid-item ul { list-style: none; padding: 0; margin: 0 0 15px 0; flex-grow: 1; }
  .grid-item li { font-size: 0.9rem; color: #B0B0B0; margin-bottom: 8px; line-height: 1.5; }
  .grid-btn {
    background-color: #007BFF; color: white; border: none; padding: 10px 15px;
    border-radius: 8px; cursor: pointer; font-weight: 500; align-self: flex-start;
    transition: background-color 0.2s ease;
  }
  .grid-btn:hover { background-color: #0056b3; }

  /* Chatbot styles */
  .chatbot-overlay {
    position: fixed; bottom: 90px; right: 25px;
    width: 90%; max-width: 380px; height: 70%; max-height: 500px;
    background: #2A2D3F; border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    display: flex; flex-direction: column;
    overflow: hidden; z-index: 1002;
    border: 1px solid #444;
  }
  .chatbot-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 15px; background: #3a3e52;
  }
  .chatbot-header h3 { margin: 0; font-size: 1rem; font-weight: 600; }
  .chatbot-close-btn { background: none; border: none; cursor: pointer; padding: 0;}
  .chatbot-close-btn svg { width: 24px; height: 24px; stroke: #B0B0B0; }
  .chatbox { flex-grow: 1; padding: 15px; overflow-y: auto; }
  .chat-message { display: flex; margin-bottom: 12px; max-width: 85%; }
  .chat-message p { padding: 10px 15px; border-radius: 18px; margin: 0; font-size: 0.9rem; line-height: 1.5; }
  .chat-message.user { justify-content: flex-end; margin-left: auto; }
  .chat-message.user p { background-color: #007BFF; color: white; border-bottom-right-radius: 4px; }
  .chat-message.bot { justify-content: flex-start; margin-right: auto; }
  .chat-message.bot p { background-color: #3a3e52; color: #F0F0F0; border-bottom-left-radius: 4px; }
  .chat-input-form { display: flex; padding: 15px; background: #1A1D2F; }
  .chat-input {
    flex-grow: 1; background: #3a3e52; border: 1px solid #444;
    border-radius: 20px; padding: 10px 15px; color: white;
    font-family: 'Poppins', sans-serif; font-size: 0.9rem;
  }
  .chat-input:focus { outline: none; border-color: #007BFF; }
  .chat-send-btn {
    background: #007BFF; border: none; border-radius: 50%;
    width: 40px; height: 40px; display: flex;
    align-items: center; justify-content: center;
    cursor: pointer; margin-left: 10px;
    transition: background-color 0.2s ease;
  }
  .chat-send-btn svg { width: 20px; height: 20px; color: white; }
`}</style>;

// Data
const safetyTips = [
  { title: "Stay Aware of Your Surroundings", description: "Avoid distractions like headphones in unknown areas.", image: "https://source.unsplash.com/400x250/?safety,woman" },
  { title: "Emergency Contacts", description: "Keep important numbers like 1091 (Women's Helpline) on speed dial.", image: "https://source.unsplash.com/400x250/?phone,call" },
  { title: "Self-Defense Basics", description: "Learn basic self-defense moves to protect yourself.", image: "https://source.unsplash.com/400x250/?self-defense" },
];

// --- New SafetyChatbot Component ---
const SafetyChatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Hello! How can I help you stay safe today?' }]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatboxRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const messageText = userInput.trim();
    if (!messageText) return;

    const newMessages = [...messages, { sender: 'user', text: messageText }];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      const apiKey = ""; // Canvas will provide this
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
      
      const systemInstruction = {
        parts: [{ text: "You are 'She-Curity,' an empathetic and helpful AI assistant. Your purpose is to provide clear, concise, and supportive safety advice for women. Do not give medical or legal advice. Be calming and empowering in your tone." }]
      };
      
      const payload = {
        contents: [{ role: "user", parts: [{ text: messageText }] }],
        systemInstruction: systemInstruction
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const result = await response.json();
      const botReply = result.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I'm having trouble responding right now. Please try again later.";
      
      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    } catch (error) {
      console.error("Gemini API call failed:", error);
      setMessages(prev => [...prev, { sender: 'bot', text: "My apologies, I couldn't connect to my services. Please check your connection and try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-overlay">
      <div className="chatbot-header">
        <h3>Safety Chatbot</h3>
        <button className="chatbot-close-btn" onClick={onClose}><CloseIcon /></button>
      </div>
      <div className="chatbox" ref={chatboxRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        {isLoading && <div className="chat-message bot"><p>Typing...</p></div>}
      </div>
      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="chat-input"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask for safety tips..."
          disabled={isLoading}
        />
        <button type="submit" className="chat-send-btn" disabled={isLoading}><SendIcon /></button>
      </form>
    </div>
  );
};

// --- Main SafetyMeasures Component ---
const SafetyMeasures = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const navigate = useNavigate();

  const nextSlide = () => setCurrentIndex(prev => (prev + 1) % safetyTips.length);
  const prevSlide = () => setCurrentIndex(prev => (prev - 1 + safetyTips.length) % safetyTips.length);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <SafetyMeasuresStyles />
      <div className="safety-container">
        <header className="safety-header">
            <button className="back-btn" onClick={() => navigate("/")} style={{position: 'absolute', left: 0}}><BackIcon/></button>
            <h1 className="safety-title">Safety Measures</h1>
        </header>

        <div className="slideshow">
          <button className="nav-btn left" onClick={prevSlide}><ArrowLeftIcon /></button>
          <div className="slide">
            <img src={safetyTips[currentIndex].image} alt={safetyTips[currentIndex].title} className="slide-image" />
            <h2>{safetyTips[currentIndex].title}</h2>
            <p>{safetyTips[currentIndex].description}</p>
          </div>
          <button className="nav-btn right" onClick={nextSlide}><ArrowRightIcon /></button>
        </div>

        <div className="grid-container">
          <div className="grid-item">
            <h2><PhoneIcon /> Women's Helpline</h2>
            <ul>
              <li>1091 (Women's Helpline)</li>
              <li>112 (General Emergency)</li>
              <li>181 (Domestic Abuse)</li>
            </ul>
          </div>
          <div className="grid-item">
            <h2><CommentsIcon /> Women's Safety Stories</h2>
            <ul>
              <li>Share experiences, report incidents, and help others stay safe.</li>
            </ul>
            <button className="grid-btn" onClick={() => window.open("https://womensafetywing.telangana.gov.in/sahas/support-forum/", "_blank")}>
              Join Discussion
            </button>
          </div>
          <div className="grid-item">
            <h2><GadgetsIcon /> Recommended Safety Gadgets</h2>
            <ul>
              <li>Pepper Spray</li>
              <li>Personal Safety Alarm</li>
              <li>Anti-Harassment Wearables</li>
            </ul>
          </div>
          <div className="grid-item">
            <h2><RobotIcon /> Safety Chatbot</h2>
            <ul>
              <li>Ask for safety tips, emergency contacts, or report incidents anonymously.</li>
            </ul>
            <button className="grid-btn" onClick={() => setIsChatbotOpen(true)}>Chat Now</button>
          </div>
        </div>

        {isChatbotOpen && <SafetyChatbot onClose={() => setIsChatbotOpen(false)} />}
        <Navbar />
      </div>
    </>
  );
};

export default SafetyMeasures;
