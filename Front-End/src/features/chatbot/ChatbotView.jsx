import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./chatbot.css";
import chatbotIcon from "../../assets/chatbot.png";

import {sendMessage, getHistory, createConversation, getConversations,
  editMessage, getConversation, updateConversationTitle, deleteConversation,
} from "./services/chatService";

import { uploadVoice } from "./services/voiceService";

import {FiSearch, FiEdit3, FiPlus, FiCopy, FiCheck, FiEdit2, FiChevronDown,
  FiLayout, FiMoreHorizontal, FiMenu, FiMic, FiSquare, FiArrowUp, FiX,
} from "react-icons/fi";

const ChatbotView = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [pendingTranscript, setPendingTranscript] = useState("");
  const [showVoiceActions, setShowVoiceActions] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [editingConversationId, setEditingConversationId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [editingMessageIndex, setEditingMessageIndex] = useState(null);
  const [editingMessageText, setEditingMessageText] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const data = await getConversations();
      setConversations(data);

      if (data.length > 0 && !currentConversationId) {
        loadConversation(data[0].id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadConversation = async (conversationId) => {
    try {
      const data = await getConversation(conversationId);
      const formatted = [];

      data.forEach((chat) => {
        formatted.push({
          id: chat.id,
          sender: "user",
          text: chat.userMessage,
          isEdited: chat.isEdited,
          editedAt: chat.editedAt,
        });

        formatted.push({
          id: chat.id,
          sender: "bot",
          text: chat.botResponse,
          isEdited: chat.isEdited,
          editedAt: chat.editedAt,
        });
      });

      setMessages(formatted);
      setCurrentConversationId(conversationId);
      setIsSidebarOpen(false); 
    } catch (error) {
      console.error(error);
    }
  };

  const loadHistory = async () => {
    try {
      const history = await getHistory();
      const formatted = [];

      history.forEach((chat) => {
        formatted.push({ sender: "user", text: chat.userMessage });
        formatted.push({ sender: "bot", text: chat.botResponse });
      });

      setMessages(formatted);
    } catch (error) {
      console.error("History error:", error);
    }
  };

  const startNewChat = async () => {
    try {
      const conversation = await createConversation("New Chat");

      setMessages([]);
      setInputValue("");
      setCurrentConversationId(conversation.id);
      setIsSidebarOpen(false);
      await loadConversations();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRenameConversation = (conversationId, currentTitle) => {
    setEditingConversationId(conversationId);
    setEditingTitle(currentTitle);
    setMenuOpen(null);
  };

  const saveConversationTitle = async () => {
    if (!editingTitle.trim()) {
      setEditingConversationId(null);
      return;
    }

    try {
      await updateConversationTitle(editingConversationId, editingTitle);
      await loadConversations();
    } catch (error) {
      console.error(error);
    }

    setEditingConversationId(null);
  };

  const handleDeleteConversation = async (conversationId) => {
    try {
      await deleteConversation(conversationId);

      if (currentConversationId === conversationId) {
        setMessages([]);
        setCurrentConversationId(null);
      }

      await loadConversations();
      setMenuOpen(null);
    } catch (error) {
      console.error(error);
    }
  };

  const copyMessage = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch (error) {
      console.error(error);
    }
  };

  const startEditingMessage = (index, text) => {
    setEditingMessageIndex(index);
    setEditingMessageText(text);
  };

  const saveEditedMessage = async () => {
    if (editingMessageIndex === null) return;

    try {
      setIsRegenerating(true);

      const updatedMessages = [...messages];
      updatedMessages[editingMessageIndex].text = editingMessageText;
      updatedMessages[editingMessageIndex].isEdited = true;

      const editedMessage = updatedMessages[editingMessageIndex];
      const result = await editMessage(editedMessage.id, editingMessageText);

      const botIndex = editingMessageIndex + 1;
      if (updatedMessages[botIndex]?.sender === "bot") {
        updatedMessages[botIndex].text = result.answer;
      }

      setMessages([...updatedMessages]);
    } catch (error) {
      console.error(error);
    } finally {
      setEditingMessageIndex(null);
      setEditingMessageText("");
      setIsRegenerating(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });

        try {
          const result = await uploadVoice(audioBlob);
          setPendingTranscript(result.transcript);
          setShowVoiceActions(true);
        } catch (error) {
          console.error("Voice upload error:", error);
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error(error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const acceptTranscript = () => {
    setInputValue(pendingTranscript);
    setPendingTranscript("");
    setShowVoiceActions(false);
  };

  const rejectTranscript = () => {
    setPendingTranscript("");
    setShowVoiceActions(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    const shouldRenameConversation = messages.length === 0;
    const currentConversation = conversations.find(
      (c) => c.id === currentConversationId
    );

    if (currentConversation && currentConversation.title === "New Chat") {
      await updateConversationTitle(currentConversationId, userMessage);
      loadConversations();
    }

    setInputValue("");
    setIsLoading(true);

    try {
      const data = await sendMessage(userMessage, currentConversationId);

      setMessages((prev) => [
        ...prev,
        { id: data.messageId, sender: "user", text: userMessage },
        { id: data.messageId, sender: "bot", text: data.response },
      ]);

      if (shouldRenameConversation && currentConversationId) {
        const title =
          userMessage.length > 40
            ? userMessage.substring(0, 40) + "..."
            : userMessage;

        await updateConversationTitle(currentConversationId, title);
        loadConversations();
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: error.message || "Something went wrong." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => {
    if (window.innerWidth <= 1024) {
      setIsSidebarOpen((prev) => !prev);
    } else {
      setIsSidebarCollapsed((prev) => !prev);
    }
  };

  const filteredConversations =
  conversations.filter((conversation) =>
    conversation.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="chat-page">
      <div className="chat-shell">
        {/* SIDEBAR */}
        <aside
          className={`chat-sidebar ${isSidebarCollapsed ? "collapsed" : ""} ${
            isSidebarOpen ? "open" : ""
          }`}
        >
          <div className="sidebar-logo clickable-logo" onClick={() => navigate("/")}>
            <div className="sidebar-logo-icon">
              <img src={chatbotIcon} alt="" />
            </div>

            <span>Through The Eye</span>

            <button
              className="sidebar-collapse-btn"
              onClick={toggleSidebar}
              aria-label="Collapse sidebar"
            >
              <FiLayout size={16} />
            </button>
          </div>

          <div className="sidebar-search">
            <div className="search-wrap">
              <FiSearch className="search-icon" size={14} />
              <input type="text" placeholder="Search conversations" value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} aria-label="Search conversations" />
            </div>
          </div>

          <div className="sidebar-nav">
            <button className="nav-item" onClick={startNewChat}>
              <FiEdit3 size={15} />
              <span>New Chat</span>
            </button>
          </div>

          <div className="sidebar-title-row">
            <span className="sidebar-title">Recent</span>
          </div>

          <div className="conversation-list" role="list">
            {conversations.length === 0 && (
              <p className="conversation-empty">No conversations yet</p>
            )}

            {filteredConversations.map((conversation) => (
              <div key={conversation.id} className="conversation-wrapper" role="listitem">
                {editingConversationId === conversation.id ? (
                  <input
                    autoFocus
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={saveConversationTitle}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveConversationTitle();
                      if (e.key === "Escape") setEditingConversationId(null);
                    }}
                    className="rename-input"
                    aria-label="Rename conversation"
                  />
                ) : (
                  <button
                    className={`conversation-item ${
                      currentConversationId === conversation.id ? "active" : ""
                    }`}
                    onClick={() => loadConversation(conversation.id)}
                    title={conversation.title}
                  >
                    <span>{conversation.title}</span>
                  </button>
                )}

                <button
                  className="chat-menu-btn"
                  onClick={() =>
                    setMenuOpen(menuOpen === conversation.id ? null : conversation.id)
                  }
                  aria-label="Conversation options"
                  aria-haspopup="menu"
                >
                  <FiMoreHorizontal size={15} />
                </button>

                {menuOpen === conversation.id && (
                  <div className="chat-menu" role="menu">
                    <button
                      role="menuitem"
                      onClick={() =>
                        handleRenameConversation(conversation.id, conversation.title)
                      }
                    >
                      Rename
                    </button>
                    <button
                      role="menuitem"
                      className="danger"
                      onClick={() => handleDeleteConversation(conversation.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {isSidebarOpen && (
          <div
            className="sidebar-backdrop"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* MAIN */}
        <main className="chat-main">
          <div className="workspace-topbar">
            <button
              className="topbar-menu-btn"
              onClick={toggleSidebar}
              aria-label="Open conversation list"
            >
              <FiMenu size={18} />
            </button>
          </div>

          {/* HOME SCREEN */}
          {messages.length === 0 ? (
            <div className="chat-home">
              <img src={chatbotIcon} alt="" className="hero-avatar" />
              <h1>How can I help you today?</h1>

              <div className="suggestion-grid">
                <button
                  className="suggestion-card"
                  onClick={() => setInputValue("Tell me about AMD")}
                >
                  AMD
                </button>
                <button
                  className="suggestion-card"
                  onClick={() => setInputValue("Tell me about CSCR")}
                >
                  CSCR
                </button>
                <button
                  className="suggestion-card"
                  onClick={() => setInputValue("What diseases do you support?")}
                >
                  Supported Diseases
                </button>
              </div>
            </div>
          ) : (
            /* CHAT SCREEN */
            <div className="chat-conversation">
              <div className="conversation-inner" role="log" aria-live="polite">
                {messages.map((msg, index) =>
                  msg.sender === "user" ? (
                    <div key={index} className="message-wrapper user">
                      {editingMessageIndex === index ? (
                        <input
                          autoFocus
                          value={editingMessageText}
                          onChange={(e) => setEditingMessageText(e.target.value)}
                          onBlur={saveEditedMessage}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEditedMessage();
                          }}
                          className="edit-message-input"
                          aria-label="Edit message"
                        />
                      ) : (
                        <div className="message user">
                          {msg.text}
                          {msg.isEdited && <span className="edited-badge">edited</span>}
                        </div>
                      )}

                      <div className="message-actions">
                        <button
                          className="message-action-btn"
                          disabled={isLoading || isRegenerating}
                          onClick={() => startEditingMessage(index, msg.text)}
                          aria-label="Edit message"
                        >
                          <FiEdit2 size={13} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div key={index} className="message-wrapper bot">
                      <div className="bot-row">
                        <img src={chatbotIcon} alt="" className="bot-avatar" />
                        <div className="bot-content">
                          <div className="message bot">{msg.text}</div>
                          <div className="message-actions">
                            <button
                              className="message-action-btn"
                              onClick={() => copyMessage(msg.text, index)}
                              aria-label="Copy response"
                            >
                              {copiedIndex === index ? (
                                <FiCheck size={13} />
                              ) : (
                                <FiCopy size={13} />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}

                {(isLoading || isRegenerating) && (
                  <div className="typing-indicator" role="status" aria-label="Assistant is responding">
                    <img src={chatbotIcon} alt="" className="bot-avatar" />
                    <div className="typing-dots">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* INPUT BAR */}
          <div className="chat-input-bar">
            <div className="hero-input">
              <button className="plus-btn" aria-label="Add attachment" type="button">
                <FiPlus size={18} />
              </button>

              <input
                type="text"
                placeholder="Ask about an eye condition..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading) handleSendMessage();
                }}
                aria-label="Message"
              />

              <div className="voice-controls">
                <button
                  type="button"
                  className={`voice-btn ${isRecording ? "recording" : ""}`}
                  onClick={isRecording ? stopRecording : startRecording}
                  aria-label={isRecording ? "Stop recording" : "Start voice input"}
                >
                  {isRecording ? <FiSquare size={15} /> : <FiMic size={17} />}
                </button>
              </div>

              <button
                className="send-btn"
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                aria-label="Send message"
              >
                <FiArrowUp size={17} />
              </button>

              {showVoiceActions && (
                <div className="voice-transcript-card" role="dialog" aria-label="Voice transcript review">
                  <div className="voice-transcript-text">{pendingTranscript}</div>
                  <div className="voice-transcript-actions">
                    <button className="transcript-btn reject" onClick={rejectTranscript}>
                      <FiX size={14} /> Discard
                    </button>
                    <button className="transcript-btn accept" onClick={acceptTranscript}>
                      <FiCheck size={14} /> Use this
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatbotView;
