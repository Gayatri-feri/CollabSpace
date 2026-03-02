import React from 'react';

/**
 * TopNav Component
 * Navigation bar with logo, tabs, and user profile
 */
const TopNav = ({ currentUser, activeTab, onTabChange, onLogout }) => {
  return (
    <nav className="top-nav">
      <div className="nav-left">
        <div className="logo">
          <div className="logo-icon">
            <i className="fas fa-comments"></i>
          </div>
          <span className="logo-text">CollabChat</span>
        </div>
      </div>
      
      <div className="nav-center">
        <div className="nav-tabs">
          <button 
            className={`nav-tab ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => onTabChange('chat')}
          >
            <i className="fas fa-comment-dots"></i>
            <span>Chat</span>
          </button>
          <button 
            className={`nav-tab ${activeTab === 'video' ? 'active' : ''}`}
            onClick={() => onTabChange('video')}
          >
            <i className="fas fa-video"></i>
            <span>Video</span>
          </button>
          <button 
            className={`nav-tab ${activeTab === 'groups' ? 'active' : ''}`}
            onClick={() => onTabChange('groups')}
          >
            <i className="fas fa-users"></i>
            <span>Groups</span>
          </button>
        </div>
      </div>
      
      <div className="nav-right">
        <button className="nav-btn notification-btn">
          <i className="fas fa-bell"></i>
          <span className="notification-badge">3</span>
        </button>
        <div className="user-profile" onClick={onLogout} title="Click to logout">
          <img 
            src={currentUser?.avatar} 
            alt={currentUser?.name} 
            className="profile-avatar"
          />
          <div className="profile-dropdown">
            <i className="fas fa-chevron-down"></i>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
