import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import ContactInfo from './components/ContactInfo';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { dummyUsers, dummyMessages } from './data/dummyData';
import './styles.css';

/**
 * Main App Component
 * Manages global state and layout
 */
// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Main Chat Layout
const ChatLayout = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState(dummyUsers);
  const [messages, setMessages] = useState(dummyMessages);
  const [selectedUser, setSelectedUser] = useState(dummyUsers[0]);
  const [isTyping, setIsTyping] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('chat');

  // Filter users based on search
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle user selection
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setUsers(prev => prev.map(u => 
      u.id === user.id ? { ...u, unreadCount: 0 } : u
    ));
  };

  // Handle sending message
  const handleSendMessage = (content) => {
    const newMessage = {
      id: messages.length + 1,
      sender: user.name,
      senderEmail: user.email,
      content,
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      type: "sent"
    };

    setMessages(prev => [...prev, newMessage]);
    
    setUsers(prev => prev.map(u => 
      u.id === selectedUser.id 
        ? { ...u, lastMessage: content, lastMessageTime: 'Just now' }
        : u
    ));

    setTimeout(() => simulateReply(), 2000);
  };

  // Simulate reply
  const simulateReply = () => {
    const replies = [
      "That sounds great! 👍",
      "I'll check it out right away.",
      "Thanks for the update!",
      "Can we discuss this in the team meeting?",
      "Perfect! Let me know if you need any help."
    ];
    
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    
    const replyMessage = {
      id: messages.length + 1,
      sender: selectedUser.name,
      senderEmail: selectedUser.email,
      content: randomReply,
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      type: "received"
    };

    setMessages(prev => [...prev, replyMessage]);
    
    setUsers(prev => prev.map(u => 
      u.id === selectedUser.id 
        ? { ...u, lastMessage: randomReply, lastMessageTime: 'Just now' }
        : u
    ));
  };

  // Simulate typing indicator
  useEffect(() => {
    const timer = setTimeout(() => setIsTyping(true), 2000);
    const hideTimer = setTimeout(() => setIsTyping(false), 5000);
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [selectedUser]);

  return (
    <div className="app">
      <TopNav 
        currentUser={user}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={logout}
      />
      
      <div className="dashboard-container">
        <Sidebar 
          users={filteredUsers}
          selectedUser={selectedUser}
          onSelectUser={handleSelectUser}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        <ChatWindow 
          selectedUser={selectedUser}
          messages={messages}
          currentUser={user}
          isTyping={isTyping}
          onSendMessage={handleSendMessage}
        />
        
        <ContactInfo user={selectedUser} />
      </div>
    </div>
  );
};

function App() {
  // State
  const [users, setUsers] = useState(dummyUsers);
  const [messages, setMessages] = useState(dummyMessages);
  const [selectedUser, setSelectedUser] = useState(dummyUsers[0]);
  const [currentUser] = useState({
    name: "Rahul Sharma",
    email: "rahul.sharma@collabspace.com",
    avatar: "https://ui-avatars.com/api/?name=Rahul+Sharma&background=6366f1&color=fff"
  });
  const [isTyping, setIsTyping] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('chat');

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle user selection
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    // Clear unread count
    setUsers(prev => prev.map(u => 
      u.id === user.id ? { ...u, unreadCount: 0 } : u
    ));
  };

  // Handle sending message
  const handleSendMessage = (content) => {
    const newMessage = {
      id: messages.length + 1,
      sender: currentUser.name,
      senderEmail: currentUser.email,
      content,
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      type: "sent"
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Update last message in user list
    setUsers(prev => prev.map(u => 
      u.id === selectedUser.id 
        ? { ...u, lastMessage: content, lastMessageTime: 'Just now' }
        : u
    ));

    // Simulate reply
    setTimeout(() => {
      simulateReply();
    }, 2000);
  };

  // Simulate typing indicator
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(true);
    }, 2000);

    const hideTimer = setTimeout(() => {
      setIsTyping(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [selectedUser]);

  // Simulate reply
  const simulateReply = () => {
    const replies = [
      "That sounds great! 👍",
      "I'll check it out right away.",
      "Thanks for the update!",
      "Can we discuss this in the team meeting?",
      "Perfect! Let me know if you need any help."
    ];
    
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    
    const replyMessage = {
      id: messages.length + 1,
      sender: selectedUser.name,
      senderEmail: selectedUser.email,
      content: randomReply,
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      type: "received"
    };

    setMessages(prev => [...prev, replyMessage]);
    
    setUsers(prev => prev.map(u => 
      u.id === selectedUser.id 
        ? { ...u, lastMessage: randomReply, lastMessageTime: 'Just now' }
        : u
    ));
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <ChatLayout />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
