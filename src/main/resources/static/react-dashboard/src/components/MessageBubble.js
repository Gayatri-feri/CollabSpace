import React from 'react';

/**
 * MessageBubble Component
 * Individual chat message bubble
 */
const MessageBubble = ({ message, isSent }) => {
  return (
    <div className={`message ${isSent ? 'sent' : 'received'}`}>
      <div className="message-content">
        <div className="message-bubble">
          {escapeHtml(message.content)}
        </div>
        <span className="message-time">{message.timestamp}</span>
      </div>
    </div>
  );
};

// Helper function to escape HTML
const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

export default MessageBubble;
