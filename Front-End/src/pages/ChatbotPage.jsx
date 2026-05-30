import React from 'react';
import Navbar from '../components/Layout/Navbar/Navbar';
import ChatbotView from '../features/chatbot/ChatbotView';

const ChatbotPage = () => {
  return (
    <>
    <Navbar />
    <main className="chatbot-main-page">
      <ChatbotView />
    </main>
    </>
  );
};

export default ChatbotPage;