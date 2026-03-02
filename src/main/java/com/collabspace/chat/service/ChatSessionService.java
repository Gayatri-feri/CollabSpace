package com.collabspace.chat.service;

import com.collabspace.chat.dto.ChatSessionDTO;
import com.collabspace.chat.dto.WebSocketChatMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ChatSessionService {

    // Map of sessionId to session info
    private final Map<String, ChatSessionDTO> sessions = new ConcurrentHashMap<>();
    
    // Map of username to sessionIds (a user can have multiple sessions)
    private final Map<String, Set<String>> userSessions = new ConcurrentHashMap<>();

    public void registerSession(String sessionId, String username) {
        ChatSessionDTO session = ChatSessionDTO.builder()
                .sessionId(sessionId)
                .username(username)
                .connectedAt(LocalDateTime.now())
                .lastActivity(LocalDateTime.now())
                .isTyping(false)
                .build();
        
        sessions.put(sessionId, session);
        userSessions.computeIfAbsent(username, k -> ConcurrentHashMap.newKeySet()).add(sessionId);
        
        log.info("Chat session registered: {} for user: {}", sessionId, username);
    }

    public void removeSession(String sessionId) {
        ChatSessionDTO session = sessions.remove(sessionId);
        if (session != null) {
            Set<String> userSessionSet = userSessions.get(session.getUsername());
            if (userSessionSet != null) {
                userSessionSet.remove(sessionId);
                if (userSessionSet.isEmpty()) {
                    userSessions.remove(session.getUsername());
                }
            }
            log.info("Chat session removed: {} for user: {}", sessionId, session.getUsername());
        }
    }

    public void updateLastActivity(String sessionId) {
        ChatSessionDTO session = sessions.get(sessionId);
        if (session != null) {
            session.setLastActivity(LocalDateTime.now());
        }
    }

    public void setTypingStatus(String sessionId, boolean isTyping) {
        ChatSessionDTO session = sessions.get(sessionId);
        if (session != null) {
            session.setTyping(isTyping);
        }
    }

    public void setCurrentChatRoom(String sessionId, String chatRoomId) {
        ChatSessionDTO session = sessions.get(sessionId);
        if (session != null) {
            session.setCurrentChatRoom(chatRoomId);
        }
    }

    public boolean isUserOnline(String username) {
        Set<String> userSessionSet = userSessions.get(username);
        return userSessionSet != null && !userSessionSet.isEmpty();
    }

    public Set<String> getOnlineUsers() {
        return userSessions.keySet();
    }

    public Set<String> getUserSessions(String username) {
        return userSessions.getOrDefault(username, ConcurrentHashMap.newKeySet());
    }

    public ChatSessionDTO getSession(String sessionId) {
        return sessions.get(sessionId);
    }

    public int getActiveSessionCount() {
        return sessions.size();
    }

    public void cleanupInactiveSessions(int minutesThreshold) {
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(minutesThreshold);
        Set<String> inactiveSessions = sessions.entrySet().stream()
                .filter(entry -> entry.getValue().getLastActivity().isBefore(threshold))
                .map(Map.Entry::getKey)
                .collect(Collectors.toSet());
        
        inactiveSessions.forEach(this::removeSession);
        
        if (!inactiveSessions.isEmpty()) {
            log.info("Cleaned up {} inactive sessions", inactiveSessions.size());
        }
    }
}
