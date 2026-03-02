import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';

/**
 * ChatWindow Component
 * Center panel with chat header, messages, and input
 */
const ChatWindow = ({ selectedUser, messages, currentUser, isTyping, onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle send
  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const statusText = selectedUser.status === 'online' ? 'Online' : 
                     selectedUser.status === 'away' ? 'Away' : 'Offline';

  return (
    <main className="chat-panel">
      {/* Chat Header */}
      <header className="chat-header">
        <div className="chat-header-left">
          <div className="chat-user-avatar">
            <img src={selectedUser.avatar} alt={selectedUser.name} />
            {selectedUser.status === 'online' && <span className="header-online-dot"></span>}
          </div>
          <div className="chat-user-info">
            <h3>{selectedUser.name}</h3>
            <p className="status-text" style={{ 
              color: selectedUser.status === 'online' ? 'var(--success)' : 
                     selectedUser.status === 'away' ? 'var(--warning)' : 'var(--text-muted)'
            }}>
              {statusText}
            </p>
          </div>
        </div>
        <div className="chat-header-right">
          <button className="header-btn" title="Voice Call">
            <i className="fas fa-phone"></i>
          </button>
          <button className="header-btn" title="Video Call">
            <i className="fas fa-video"></i>
          </button>
          <button className="header-btn" title="More Options">
            <i className="fas fa-ellipsis-v"></i>
          </button>
        </div>
      </header>

      {/* Messages Container */}
      <div className="messages-container">
        <div className="messages-scroll">
          {messages.map(message => (
            <MessageBubble 
              key={message.id}
              message={message}
              isSent={message.type === 'sent'}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Typing Indicator */}
      {isTyping && (
        <div className="typing-indicator-container">
          <div className="typing-indicator">
            <span className="typing-text">{selectedUser.name} is typing</span>
            <span className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
        </div>
      )}

      {/* Message Input Area */}
      <div className="message-input-area">
        <button className="input-btn emoji-btn" title="Emoji">
          <i className="far fa-smile"></i>
        </button>
        <button className="input-btn attach-btn" title="Attach">
          <i className="fas fa-paperclip"></i>
        </button>
        <div className="input-wrapper">
          <input 
            type="text"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <button className="send-btn" onClick={handleSend} title="Send">
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </main>
  );
};

export default ChatWindow;
