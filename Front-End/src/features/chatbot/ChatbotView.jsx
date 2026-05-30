import React, { useState } from 'react';
import './chatbot.css';
import chatbotIcon from '../../assets/chatbot.png'; 

const ChatbotView = () => {
  const [isChatActive, setIsChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleFocus = () => {
    setIsChatActive(true);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: inputValue }];
    setMessages(newMessages);
    setInputValue('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Thank you for asking! I am here to help.' }
      ]);
    }, 1000);
  };

  return (
    <div className={`chatbot-container ${isChatActive ? 'chat-mode' : 'welcome-mode'}`}>
      
      {/* Background Decorative Circles */}
      <div className="bg-circle circle-top-left"></div>
      <div className="bg-circle circle-mid-right"></div>
      <div className="bg-circle circle-bottom-right"></div>

      {/* Hero Welcome Headers */}
      <div className="chatbot-hero">
        <h1 className="chatbot-title-top">Chatbot</h1>
        <h2 className="chatbot-title-main">
          Through <span className="gradient-text-pure">The Eye</span>
        </h2>
      </div>

      {/* Main Chat Box Container */}
      <div className="chat-card">
        
        {/* Chat History Window Area */}
        {isChatActive && (
          <div className="chat-history">
            <div className="system-greeting">How can I assist you with eye simulations today?</div>
            {messages.map((msg, index) => (
              <div key={index} className={`message-bubble ${msg.sender}-message`}>
                {msg.text}
              </div>
            ))}
          </div>
        )}

        {/* Input Field Area (Centered inside the box) */}
        <div className="chat-input-wrapper">
          <form onSubmit={handleSendMessage} className="input-field-container">
            <input 
              type="text" 
              placeholder="Ask anything..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={handleFocus}
              className="chatbot-input"
            />
            <button type="submit" className="send-btn-circle">
              {/* Arrow pointing up inside a circle */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
            </button>
          </form>
        </div>

        {/* Bot Character Positioned at the bottom-left corner */}
        <div className="bot-avatar-left">
          <img src={chatbotIcon} alt="Bot Avatar" className="bot-img-pure" />
        </div>

      </div>

    </div>
  );
};

export default ChatbotView;