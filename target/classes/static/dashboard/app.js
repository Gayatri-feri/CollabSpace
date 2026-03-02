/**
 * CollabChat Dashboard - Modern Chat Application
 * Professional WhatsApp/Slack-like UI with dummy data
 */

// ========================================
// Dummy Data
// ========================================

const users = [
    {
        id: 1,
        name: "Anjali Patel",
        email: "anjali.patel@collabspace.com",
        avatar: "https://ui-avatars.com/api/?name=Anjali+Patel&background=10b981&color=fff",
        status: "online",
        about: "Senior Backend Developer working on Spring Boot microservices. Passionate about clean code and real-time systems.",
        lastMessage: "Yes, STOMP messaging is working perfectly.",
        lastMessageTime: "10:18 AM",
        unreadCount: 0
    },
    {
        id: 2,
        name: "Vikram Singh",
        email: "vikram.singh@collabspace.com",
        avatar: "https://ui-avatars.com/api/?name=Vikram+Singh&background=f59e0b&color=fff",
        status: "online",
        about: "Full Stack Developer specializing in React and WebSocket integrations.",
        lastMessage: "I'll test the typing indicator feature now.",
        lastMessageTime: "10:19 AM",
        unreadCount: 2
    },
    {
        id: 3,
        name: "Priya Gupta",
        email: "priya.gupta@collabspace.com",
        avatar: "https://ui-avatars.com/api/?name=Priya+Gupta&background=ec4899&color=fff",
        status: "away",
        about: "UI/UX Designer creating beautiful and intuitive user experiences.",
        lastMessage: "The dashboard design looks amazing! 🎨",
        lastMessageTime: "09:45 AM",
        unreadCount: 0
    },
    {
        id: 4,
        name: "Arjun Kumar",
        email: "arjun.kumar@collabspace.com",
        avatar: "https://ui-avatars.com/api/?name=Arjun+Kumar&background=8b5cf6&color=fff",
        status: "offline",
        about: "DevOps Engineer automating deployments and managing cloud infrastructure.",
        lastMessage: "Deployment pipeline is configured.",
        lastMessageTime: "Yesterday",
        unreadCount: 0
    },
    {
        id: 5,
        name: "Backend Team",
        email: "backend@collabspace.com",
        avatar: "https://ui-avatars.com/api/?name=Backend+Team&background=6366f1&color=fff",
        status: "online",
        about: "Group chat for backend development team discussions.",
        lastMessage: "Rahul: Great, let's finalize before today's demo.",
        lastMessageTime: "10:20 AM",
        unreadCount: 5,
        isGroup: true
    }
];

const messages = [
    {
        id: 1,
        sender: "Rahul Sharma",
        senderEmail: "rahul.sharma@collabspace.com",
        content: "Hi there, how are you?",
        timestamp: "10:15 AM",
        type: "sent"
    },
    {
        id: 2,
        sender: "Anjali Patel",
        senderEmail: "anjali.patel@collabspace.com",
        content: "I'm doing great! Working on the Spring Boot project. How about you?",
        timestamp: "10:16 AM",
        type: "received"
    },
    {
        id: 3,
        sender: "Rahul Sharma",
        senderEmail: "rahul.sharma@collabspace.com",
        content: "I'm working on the Spring Boot project too! Did you complete the WebSocket integration?",
        timestamp: "10:17 AM",
        type: "sent"
    },
    {
        id: 4,
        sender: "Anjali Patel",
        senderEmail: "anjali.patel@collabspace.com",
        content: "Yes, real-time messaging is working! 🎉 The STOMP protocol implementation is complete.",
        timestamp: "10:18 AM",
        type: "received"
    },
    {
        id: 5,
        sender: "Rahul Sharma",
        senderEmail: "rahul.sharma@collabspace.com",
        content: "That's fantastic! Great job on the implementation. 👍",
        timestamp: "10:18 AM",
        type: "sent"
    },
    {
        id: 6,
        sender: "Anjali Patel",
        senderEmail: "anjali.patel@collabspace.com",
        content: "Thanks! I've also added the typing indicator feature. It shows when someone is typing.",
        timestamp: "10:19 AM",
        type: "received"
    },
    {
        id: 7,
        sender: "Rahul Sharma",
        senderEmail: "rahul.sharma@collabspace.com",
        content: "Perfect! Let's test the typing indicator feature now. Can you type something?",
        timestamp: "10:19 AM",
        type: "sent"
    },
    {
        id: 8,
        sender: "Anjali Patel",
        senderEmail: "anjali.patel@collabspace.com",
        content: "Sure! I'm typing this message to test the indicator. It should show 'Anjali is typing...' on your screen.",
        timestamp: "10:20 AM",
        type: "received"
    }
];

// ========================================
// State Management
// ========================================

let currentUser = {
    name: "Rahul Sharma",
    email: "rahul.sharma@collabspace.com",
    avatar: "https://ui-avatars.com/api/?name=Rahul+Sharma&background=6366f1&color=fff"
};

let selectedChat = users[0]; // Default to first user
let isTyping = false;
let typingTimeout = null;

// ========================================
// DOM Elements
// ========================================

const chatListEl = document.getElementById('chat-list');
const messagesContainerEl = document.getElementById('messages-scroll');
const messageInputEl = document.getElementById('message-input');
const sendBtnEl = document.getElementById('send-btn');
const typingIndicatorEl = document.getElementById('typing-indicator');
const searchInputEl = document.getElementById('search-input');

// ========================================
// Initialization
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    renderChatList();
    renderMessages();
    updateChatHeader();
    updateContactInfo();
    setupEventListeners();
    
    // Show typing indicator after 2 seconds
    setTimeout(() => {
        showTypingIndicator();
    }, 2000);
    
    // Hide typing indicator after 5 seconds
    setTimeout(() => {
        hideTypingIndicator();
    }, 5000);
});

// ========================================
// Render Functions
// ========================================

function renderChatList() {
    chatListEl.innerHTML = '';
    
    users.forEach(user => {
        const chatItem = createChatItem(user);
        chatListEl.appendChild(chatItem);
    });
}

function createChatItem(user) {
    const item = document.createElement('div');
    item.className = `chat-item ${selectedChat.id === user.id ? 'active' : ''}`;
    item.onclick = () => selectChat(user);
    
    const statusClass = user.status === 'online' ? '' : 
                       user.status === 'away' ? 'away' : 'offline';
    
    const unreadBadge = user.unreadCount > 0 
        ? `<span class="chat-item-badge">${user.unreadCount}</span>` 
        : '';
    
    const timeClass = user.unreadCount > 0 ? 'unread' : '';
    const messageClass = user.unreadCount > 0 ? 'unread' : '';
    
    item.innerHTML = `
        <div class="chat-item-avatar">
            <img src="${user.avatar}" alt="${user.name}">
            <span class="chat-item-status ${statusClass}"></span>
        </div>
        <div class="chat-item-content">
            <div class="chat-item-header">
                <span class="chat-item-name">${user.name}</span>
                <span class="chat-item-time ${timeClass}">${user.lastMessageTime}</span>
            </div>
            <div class="chat-item-preview">
                <span class="chat-item-message ${messageClass}">${user.lastMessage}</span>
                ${unreadBadge}
            </div>
        </div>
    `;
    
    return item;
}

function renderMessages() {
    messagesContainerEl.innerHTML = '';
    
    messages.forEach(message => {
        const messageEl = createMessageElement(message);
        messagesContainerEl.appendChild(messageEl);
    });
    
    scrollToBottom();
}

function createMessageElement(message) {
    const div = document.createElement('div');
    div.className = `message ${message.type}`;
    
    div.innerHTML = `
        <div class="message-content">
            <div class="message-bubble">${escapeHtml(message.content)}</div>
            <span class="message-time">${message.timestamp}</span>
        </div>
    `;
    
    return div;
}

function updateChatHeader() {
    const headerAvatar = document.getElementById('header-avatar');
    const headerName = document.getElementById('header-name');
    const headerStatus = document.getElementById('header-status');
    
    headerAvatar.src = selectedChat.avatar;
    headerName.textContent = selectedChat.name;
    headerStatus.textContent = selectedChat.status === 'online' ? 'Online' : 
                               selectedChat.status === 'away' ? 'Away' : 'Offline';
    headerStatus.style.color = selectedChat.status === 'online' ? 'var(--success)' : 
                               selectedChat.status === 'away' ? 'var(--warning)' : 'var(--text-muted)';
}

function updateContactInfo() {
    const contactAvatar = document.getElementById('contact-avatar');
    const contactName = document.getElementById('contact-name');
    const contactStatus = document.getElementById('contact-status');
    const contactAbout = document.getElementById('contact-about');
    
    contactAvatar.src = selectedChat.avatar.replace('size=128', 'size=200');
    contactName.textContent = selectedChat.name;
    contactStatus.textContent = selectedChat.status === 'online' ? 'Online' : 
                                 selectedChat.status === 'away' ? 'Away' : 'Offline';
    contactAbout.textContent = selectedChat.about;
}

// ========================================
// Chat Selection
// ========================================

function selectChat(user) {
    selectedChat = user;
    
    // Update active state in list
    document.querySelectorAll('.chat-item').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    // Update header and contact info
    updateChatHeader();
    updateContactInfo();
    
    // Clear unread count
    user.unreadCount = 0;
    renderChatList();
    
    // Show toast
    showToast(`Chat opened with ${user.name}`, 'info');
}

// ========================================
// Message Handling
// ========================================

function sendMessage() {
    const content = messageInputEl.value.trim();
    
    if (!content) return;
    
    // Add sent message
    const newMessage = {
        id: messages.length + 1,
        sender: currentUser.name,
        senderEmail: currentUser.email,
        content: content,
        timestamp: getCurrentTime(),
        type: "sent"
    };
    
    messages.push(newMessage);
    
    // Update UI
    const messageEl = createMessageElement(newMessage);
    messagesContainerEl.appendChild(messageEl);
    scrollToBottom();
    
    // Clear input
    messageInputEl.value = '';
    
    // Update last message in chat list
    selectedChat.lastMessage = content;
    selectedChat.lastMessageTime = getCurrentTime();
    renderChatList();
    
    // Simulate reply after 2 seconds
    setTimeout(() => {
        simulateReply();
    }, 2000);
}

function simulateReply() {
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
        sender: selectedChat.name,
        senderEmail: selectedChat.email,
        content: randomReply,
        timestamp: getCurrentTime(),
        type: "received"
    };
    
    messages.push(replyMessage);
    
    const messageEl = createMessageElement(replyMessage);
    messagesContainerEl.appendChild(messageEl);
    scrollToBottom();
    
    // Update last message in chat list
    selectedChat.lastMessage = randomReply;
    selectedChat.lastMessageTime = getCurrentTime();
    renderChatList();
    
    showToast(`New message from ${selectedChat.name}`, 'info');
}

// ========================================
// Typing Indicator
// ========================================

function showTypingIndicator() {
    typingIndicatorEl.classList.remove('hidden');
    typingIndicatorEl.style.display = 'block';
}

function hideTypingIndicator() {
    typingIndicatorEl.style.display = 'none';
}

function handleTyping() {
    if (!isTyping) {
        isTyping = true;
        // In real app, send typing event to server
    }
    
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        isTyping = false;
        // In real app, send stop typing event to server
    }, 2000);
}

// ========================================
// Event Listeners
// ========================================

function setupEventListeners() {
    // Send message on button click
    sendBtnEl.addEventListener('click', sendMessage);
    
    // Send message on Enter key
    messageInputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        } else {
            handleTyping();
        }
    });
    
    // Search functionality
    searchInputEl.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const chatItems = document.querySelectorAll('.chat-item');
        
        chatItems.forEach((item, index) => {
            const user = users[index];
            const isVisible = user.name.toLowerCase().includes(searchTerm) ||
                             user.lastMessage.toLowerCase().includes(searchTerm);
            item.style.display = isVisible ? 'flex' : 'none';
        });
    });
    
    // Navigation tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const tabName = tab.dataset.tab;
            showToast(`Switched to ${tabName} tab`, 'info');
        });
    });
    
    // Action buttons
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.classList.contains('block-btn') ? 'block' :
                          btn.classList.contains('report-btn') ? 'report' : 'delete';
            showToast(`${action.charAt(0).toUpperCase() + action.slice(1)} action triggered`, 'warning');
        });
    });
}

// ========================================
// Utility Functions
// ========================================

function scrollToBottom() {
    messagesContainerEl.scrollTop = messagesContainerEl.scrollHeight;
}

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'check-circle' :
                 type === 'error' ? 'exclamation-circle' :
                 type === 'warning' ? 'exclamation-triangle' : 'info-circle';
    
    toast.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ========================================
// Auto-scroll on load
// ========================================

window.addEventListener('load', () => {
    scrollToBottom();
});
