/**
 * CollabSpace - Real-Time Chat Application
 * WebSocket Client with STOMP Protocol
 */

// ========================================
// Global Variables
// ========================================
let stompClient = null;
let currentUser = null;
let authToken = null;
let selectedChat = null;
let typingTimeout = null;
let isTyping = false;

// WebSocket endpoints
const WS_ENDPOINT = '/ws';
const API_BASE_URL = 'http://localhost:8080';

// ========================================
// Authentication Functions
// ========================================

function switchTab(tab) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabs = document.querySelectorAll('.tab-btn');

    tabs.forEach(t => t.classList.remove('active'));

    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        tabs[0].classList.add('active');
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        tabs[1].classList.add('active');
    }

    document.getElementById('auth-error').textContent = '';
}

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && data.token) {
            authToken = data.token;
            currentUser = {
                id: data.id,
                name: data.name,
                email: data.email,
                role: data.role
            };
            showChat();
            connectWebSocket();
            showToast('Login successful!', 'success');
        } else {
            document.getElementById('auth-error').textContent = data.message || 'Login failed';
        }
    } catch (error) {
        document.getElementById('auth-error').textContent = 'Network error. Please try again.';
        console.error('Login error:', error);
    }
});

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const role = document.getElementById('register-role').value;

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role })
        });

        const data = await response.json();

        if (response.ok && data.token) {
            authToken = data.token;
            currentUser = {
                id: data.id,
                name: data.name,
                email: data.email,
                role: data.role
            };
            showChat();
            connectWebSocket();
            showToast('Registration successful!', 'success');
        } else {
            document.getElementById('auth-error').textContent = data.message || 'Registration failed';
        }
    } catch (error) {
        document.getElementById('auth-error').textContent = 'Network error. Please try again.';
        console.error('Registration error:', error);
    }
});

function logout() {
    if (stompClient) {
        stompClient.send('/app/leave', {}, JSON.stringify({}));
        stompClient.disconnect();
    }
    authToken = null;
    currentUser = null;
    selectedChat = null;
    document.getElementById('login-section').classList.remove('hidden');
    document.getElementById('chat-section').classList.add('hidden');
    document.getElementById('login-form').reset();
    document.getElementById('register-form').reset();
    showToast('Logged out successfully', 'info');
}

function showChat() {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('chat-section').classList.remove('hidden');
    
    // Update user info
    document.getElementById('current-user-name').textContent = currentUser.name;
    document.getElementById('current-user-avatar').src = generateAvatarUrl(currentUser.name);
}

// ========================================
// WebSocket Connection
// ========================================

function connectWebSocket() {
    const socket = new SockJS(`${API_BASE_URL}${WS_ENDPOINT}`);
    stompClient = Stomp.over(socket);

    // Disable debug logging in production
    stompClient.debug = null;

    const headers = {
        'Authorization': `Bearer ${authToken}`
    };

    stompClient.connect(headers, onConnected, onError);
}

function onConnected(frame) {
    console.log('WebSocket Connected:', frame);
    showToast('Connected to chat server', 'success');

    // Subscribe to public messages
    stompClient.subscribe('/topic/messages', onMessageReceived);

    // Subscribe to online users updates
    stompClient.subscribe('/topic/online-users', onOnlineUsersUpdate);

    // Subscribe to private messages
    stompClient.subscribe('/user/queue/messages', onPrivateMessageReceived);

    // Subscribe to typing indicators
    stompClient.subscribe('/user/queue/typing', onTypingReceived);

    // Send join message
    stompClient.send('/app/join', {}, JSON.stringify({}));

    // Enable message input
    document.getElementById('message-input').disabled = false;
    document.getElementById('send-btn').disabled = false;
}

function onError(error) {
    console.error('WebSocket Error:', error);
    showToast('Connection error. Retrying...', 'error');
    
    // Retry connection after 5 seconds
    setTimeout(connectWebSocket, 5000);
}

// ========================================
// Message Handling
// ========================================

function onMessageReceived(payload) {
    const message = JSON.parse(payload.body);
    
    if (message.type === 'JOIN' || message.type === 'LEAVE') {
        displaySystemMessage(message);
    } else if (selectedChat && selectedChat.type === 'public') {
        displayMessage(message);
    }
}

function onPrivateMessageReceived(payload) {
    const message = JSON.parse(payload.body);
    
    // Check if this message is for the currently selected chat
    if (selectedChat) {
        const isRelevant = 
            (selectedChat.type === 'private' && 
             (message.sender === selectedChat.id || message.receiver === selectedChat.id)) ||
            (selectedChat.type === 'room' && message.chatRoomId === selectedChat.id);
        
        if (isRelevant) {
            displayMessage(message);
        } else {
            // Show notification for other chats
            showToast(`New message from ${message.sender}`, 'info');
        }
    }
}

function sendMessage() {
    const input = document.getElementById('message-input');
    const content = input.value.trim();

    if (!content || !stompClient || !selectedChat) return;

    const message = {
        content: content,
        sender: currentUser.email,
        type: 'CHAT'
    };

    if (selectedChat.type === 'public') {
        stompClient.send('/app/chat', {}, JSON.stringify(message));
    } else if (selectedChat.type === 'private') {
        message.receiver = selectedChat.id;
        stompClient.send('/app/private-message', {}, JSON.stringify(message));
    } else if (selectedChat.type === 'room') {
        message.chatRoomId = selectedChat.id;
        stompClient.send('/app/group-message', {}, JSON.stringify(message));
    }

    input.value = '';
    stopTyping();
}

// Send message on Enter key
document.getElementById('message-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    } else {
        handleTyping();
    }
});

// ========================================
// Typing Indicator
// ========================================

function handleTyping() {
    if (!isTyping && selectedChat) {
        isTyping = true;
        sendTypingStatus(true);
    }

    // Clear existing timeout
    if (typingTimeout) {
        clearTimeout(typingTimeout);
    }

    // Set new timeout to stop typing after 2 seconds
    typingTimeout = setTimeout(stopTyping, 2000);
}

function stopTyping() {
    if (isTyping) {
        isTyping = false;
        sendTypingStatus(false);
    }
}

function sendTypingStatus(typing) {
    if (!stompClient || !selectedChat) return;

    const typingIndicator = {
        username: currentUser.email,
        typing: typing
    };

    if (selectedChat.type === 'private') {
        typingIndicator.receiver = selectedChat.id;
    } else if (selectedChat.type === 'room') {
        typingIndicator.chatRoomId = selectedChat.id;
    }

    stompClient.send('/app/typing', {}, JSON.stringify(typingIndicator));
}

function onTypingReceived(payload) {
    const typing = JSON.parse(payload.body);
    const indicator = document.getElementById('typing-indicator');
    const text = indicator.querySelector('.typing-text');

    if (typing.typing) {
        text.textContent = typing.displayText;
        indicator.classList.remove('hidden');
    } else {
        indicator.classList.add('hidden');
    }
}

// ========================================
// UI Functions - Messages
// ========================================

function displayMessage(message) {
    const messagesList = document.getElementById('messages-list');
    const isSent = message.sender === currentUser.email;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isSent ? 'sent' : 'received'}`;

    const avatar = generateAvatarUrl(message.sender);
    const time = formatTime(message.timestamp || new Date());

    messageDiv.innerHTML = `
        <img src="${avatar}" alt="${message.sender}" class="message-avatar">
        <div class="message-content">
            ${!isSent ? `<span class="message-sender">${message.sender}</span>` : ''}
            <div class="message-bubble">${escapeHtml(message.content)}</div>
            <span class="message-time">${time}</span>
        </div>
    `;

    messagesList.appendChild(messageDiv);
    scrollToBottom();
}

function displaySystemMessage(message) {
    const messagesList = document.getElementById('messages-list');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message system';
    messageDiv.innerHTML = `
        <div class="message-bubble">${escapeHtml(message.content)}</div>
    `;

    messagesList.appendChild(messageDiv);
    scrollToBottom();
}

function scrollToBottom() {
    const container = document.getElementById('messages-container');
    container.scrollTop = container.scrollHeight;
}

// ========================================
// UI Functions - Online Users
// ========================================

function onOnlineUsersUpdate(payload) {
    const users = JSON.parse(payload.body);
    updateOnlineUsersList(users);
}

function updateOnlineUsersList(users) {
    const list = document.getElementById('online-users-list');
    const count = document.getElementById('online-count');
    
    // Filter out current user
    const otherUsers = users.filter(u => u.username !== currentUser.email);
    count.textContent = otherUsers.length;

    list.innerHTML = '';

    otherUsers.forEach(user => {
        const li = document.createElement('li');
        li.className = 'user-item';
        li.onclick = () => selectPrivateChat(user);

        const isActive = selectedChat && 
                        selectedChat.type === 'private' && 
                        selectedChat.id === user.username;
        if (isActive) li.classList.add('active');

        li.innerHTML = `
            <div class="avatar-wrapper">
                <img src="${user.avatar || generateAvatarUrl(user.username)}" alt="${user.username}" class="avatar">
                <span class="online-indicator"></span>
            </div>
            <div class="user-details">
                <span class="name">${user.displayName || user.username}</span>
                <span class="status">Online</span>
            </div>
        `;

        list.appendChild(li);
    });
}

function selectPrivateChat(user) {
    selectedChat = {
        type: 'private',
        id: user.username,
        name: user.displayName || user.username,
        avatar: user.avatar || generateAvatarUrl(user.username)
    };

    updateChatHeader();
    showChatArea();
    loadChatHistory(user.username);
    
    // Update active state in list
    document.querySelectorAll('.user-item, .room-item').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
}

// ========================================
// UI Functions - Chat Rooms
// ========================================

function showCreateRoomModal() {
    document.getElementById('create-room-modal').classList.remove('hidden');
}

function hideCreateRoomModal() {
    document.getElementById('create-room-modal').classList.add('hidden');
    document.getElementById('room-name').value = '';
    document.getElementById('room-description').value = '';
}

async function createRoom() {
    const name = document.getElementById('room-name').value.trim();
    const description = document.getElementById('room-description').value.trim();

    if (!name) {
        showToast('Please enter a room name', 'error');
        return;
    }

    // For now, we'll create a room locally
    // In production, this should call the backend API
    const room = {
        roomId: 'room-' + Date.now(),
        name: name,
        description: description,
        createdBy: currentUser.email
    };

    addRoomToList(room);
    hideCreateRoomModal();
    showToast('Room created successfully!', 'success');
}

function addRoomToList(room) {
    const list = document.getElementById('chat-rooms-list');
    
    const li = document.createElement('li');
    li.className = 'room-item';
    li.onclick = () => selectRoom(room, li);

    li.innerHTML = `
        <div class="avatar-wrapper">
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(room.name)}&background=random&color=fff" 
                 alt="${room.name}" class="avatar">
        </div>
        <div class="room-details">
            <span class="name">${room.name}</span>
            <span class="preview">${room.description || 'Group chat'}</span>
        </div>
    `;

    list.appendChild(li);
}

function selectRoom(room, element) {
    selectedChat = {
        type: 'room',
        id: room.roomId,
        name: room.name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(room.name)}&background=random&color=fff`
    };

    updateChatHeader();
    showChatArea();
    
    // Subscribe to room messages
    stompClient.subscribe(`/topic/room/${room.roomId}`, onMessageReceived);
    stompClient.subscribe(`/topic/room/${room.roomId}/typing`, onTypingReceived);

    // Load room history
    loadRoomHistory(room.roomId);

    // Update active state
    document.querySelectorAll('.user-item, .room-item').forEach(item => {
        item.classList.remove('active');
    });
    element.classList.add('active');
}

// ========================================
// UI Functions - Chat Area
// ========================================

function updateChatHeader() {
    if (!selectedChat) return;

    document.getElementById('chat-title').textContent = selectedChat.name;
    document.getElementById('chat-avatar').src = selectedChat.avatar;
    document.getElementById('chat-status').textContent = 
        selectedChat.type === 'private' ? 'Online' : `${selectedChat.type === 'room' ? 'Group' : 'Public'} chat`;
}

function showChatArea() {
    document.getElementById('welcome-message').classList.add('hidden');
    document.getElementById('messages-list').classList.remove('hidden');
    document.getElementById('messages-list').innerHTML = '';
}

function loadChatHistory(otherUser) {
    if (!stompClient) return;

    stompClient.send('/app/history', {}, JSON.stringify(otherUser));
    
    // Subscribe to history response
    stompClient.subscribe('/user/queue/history', (payload) => {
        const messages = JSON.parse(payload.body);
        messages.forEach(msg => displayMessage(msg));
    });
}

function loadRoomHistory(roomId) {
    if (!stompClient) return;

    stompClient.send('/app/room-history', {}, JSON.stringify(roomId));
    
    // Subscribe to room history response
    stompClient.subscribe('/user/queue/room-history', (payload) => {
        const messages = JSON.parse(payload.body);
        messages.forEach(msg => displayMessage(msg));
    });
}

// ========================================
// Utility Functions
// ========================================

function generateAvatarUrl(name) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`;
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
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

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ========================================
// Search Functionality
// ========================================

document.getElementById('user-search').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const users = document.querySelectorAll('.user-item');
    
    users.forEach(user => {
        const name = user.querySelector('.name').textContent.toLowerCase();
        user.style.display = name.includes(searchTerm) ? 'flex' : 'none';
    });
});

// ========================================
// Initialize
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('CollabSpace Chat initialized');
});

// Handle window unload
window.addEventListener('beforeunload', () => {
    if (stompClient) {
        stompClient.send('/app/leave', {}, JSON.stringify({}));
        stompClient.disconnect();
    }
});
