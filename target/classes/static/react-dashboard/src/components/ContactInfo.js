import React from 'react';

/**
 * ContactInfo Component
 * Right panel with contact details and actions
 */
const ContactInfo = ({ user }) => {
  const statusText = user.status === 'online' ? 'Online' : 
                     user.status === 'away' ? 'Away' : 'Offline';

  return (
    <aside className="right-panel">
      <div className="contact-info">
        {/* Profile Section */}
        <div className="profile-section">
          <div className="profile-large">
            <img 
              src={user.avatar.replace('size=128', 'size=200')} 
              alt={user.name} 
            />
            {user.status === 'online' && <span className="profile-online-badge"></span>}
          </div>
          <h3>{user.name}</h3>
          <p className="contact-status-text">{statusText}</p>
        </div>

        {/* About Section */}
        <div className="info-section">
          <h4>About</h4>
          <p>{user.about}</p>
        </div>

        {/* Media Section */}
        <div className="info-section">
          <h4>Media, Links and Docs</h4>
          <div className="media-grid">
            <div className="media-item">
              <img src="https://via.placeholder.com/80/6366f1/ffffff?text=API" alt="Media 1" />
            </div>
            <div className="media-item">
              <img src="https://via.placeholder.com/80/10b981/ffffff?text=DB" alt="Media 2" />
            </div>
            <div className="media-item">
              <img src="https://via.placeholder.com/80/f59e0b/ffffff?text=UI" alt="Media 3" />
            </div>
            <div className="media-item">
              <img src="https://via.placeholder.com/80/ec4899/ffffff?text=WS" alt="Media 4" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="action-btn block-btn">
            <i className="fas fa-ban"></i>
            <span>Block {user.name.split(' ')[0]}</span>
          </button>
          <button className="action-btn report-btn">
            <i className="fas fa-exclamation-triangle"></i>
            <span>Report {user.name.split(' ')[0]}</span>
          </button>
          <button className="action-btn delete-btn">
            <i className="fas fa-trash-alt"></i>
            <span>Delete Chat</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ContactInfo;
