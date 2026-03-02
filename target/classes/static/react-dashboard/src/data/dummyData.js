/**
 * Dummy Data for CollabChat React Dashboard
 */

export const dummyUsers = [
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

export const dummyMessages = [
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

export const activeUsers = [
  { name: "Rahul Sharma", avatar: "https://ui-avatars.com/api/?name=Rahul+Sharma&background=6366f1&color=fff" },
  { name: "Anjali Patel", avatar: "https://ui-avatars.com/api/?name=Anjali+Patel&background=10b981&color=fff" },
  { name: "Vikram Singh", avatar: "https://ui-avatars.com/api/?name=Vikram+Singh&background=f59e0b&color=fff" },
  { name: "Priya Gupta", avatar: "https://ui-avatars.com/api/?name=Priya+Gupta&background=ec4899&color=fff" },
  { name: "Arjun Kumar", avatar: "https://ui-avatars.com/api/?name=Arjun+Kumar&background=8b5cf6&color=fff" }
];
