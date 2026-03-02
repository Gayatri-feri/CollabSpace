import React from 'react';
import { activeUsers } from '../data/dummyData';

/**
 * Sidebar Component
 * Left panel with active users and chat list
 */
const Sidebar = ({ users, selectedUser, onSelectUser, searchTerm, onSearchChange }) => {
  const onlineCount = users.filter(u => u.status === 'online').length;

  return (
    <aside className="left-sidebar">
      {/* Active Users Section */}
      <div className="sidebar-section">
        <div className="section-header">
          <h3>Active Users</h3>
          <span className="online-count">{onlineCount} online</span>
        </div>
        <div className="active-users-scroll">
          {activeUsers.map((user, index) => (
            <div key={index} className="active-user" title={user.name}>
              <div className="active-user-avatar">
                <img src={user.avatar} alt={user.name} />
                <span className="online-dot"></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <i className="fas fa-search"></i>
        <input 
          type="text" 
          placeholder="Search or start new chat"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Chat List */}
      <div className="chat-list-container">
        <div className="chat-list-header">
          <h4>Recent Chats</h4>
        </div>
        <div className="chat-list">
          {users.map(user => (
            <ChatItem 
              key={user.id}
              user={user}
              isActive={selectedUser.id === user.id}
              onClick={() => onSelectUser(user)}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};

/**
 * ChatItem Component
 * Individual chat list item
 */
const ChatItem = ({ user, isActive, onClick }) => {
  const statusClass = user.status === 'online' ? '' : 
                     user.status === 'away' ? 'away' : 'offline';

  return (
    <div 
      className={`chat-item ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className="chat-item-avatar">
        <img src={user.avatar} alt={user.name} />
        <span className={`chat-item-status ${statusClass}`}></span>
      </div>
      <div className="chat-item-content">
        <div className="chat-item-header">
          <span className="chat-item-name">{user.name}</span>
          <span className={`chat-item-time ${user.unreadCount > 0 ? 'unread' : ''}`}>
            {user.lastMessageTime}
          </span>
        </div>
        <div className="chat-item-preview">
          <span className={`chat-item-message ${user.unreadCount > 0 ? 'unread' : ''}`}>
            {user.lastMessage}
          </span>
          {user.unreadCount > 0 && (
            <span className="chat-item-badge">{user.unreadCount}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
