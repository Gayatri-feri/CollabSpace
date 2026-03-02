package com.collabspace.chat.service;

import com.collabspace.chat.dto.OnlineUser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service for tracking online users.
 * Uses in-memory storage for active user sessions.
 */
@Service
@Slf4j
public class OnlineUserService {

    // Map to store online users: username -> OnlineUser
    private final Map<String, OnlineUser> onlineUsers = new ConcurrentHashMap<>();

    /**
     * Mark a user as connected (online).
     */
    public void userConnected(String username) {
        OnlineUser user = OnlineUser.builder()
                .username(username)
                .displayName(username)
                .online(true)
                .lastSeen(LocalDateTime.now())
                .avatar(generateAvatarUrl(username))
                .build();

        onlineUsers.put(username, user);
        log.info("User connected: {}. Total online: {}", username, onlineUsers.size());
    }

    /**
     * Mark a user as disconnected (offline).
     */
    public void userDisconnected(String username) {
        onlineUsers.remove(username);
        log.info("User disconnected: {}. Total online: {}", username, onlineUsers.size());
    }

    /**
     * Get list of all online users.
     */
    public List<OnlineUser> getOnlineUsers() {
        return new ArrayList<>(onlineUsers.values());
    }

    /**
     * Check if a user is online.
     */
    public boolean isUserOnline(String username) {
        return onlineUsers.containsKey(username);
    }

    /**
     * Get count of online users.
     */
    public int getOnlineUserCount() {
        return onlineUsers.size();
    }

    /**
     * Update user's current room.
     */
    public void updateUserRoom(String username, String roomId) {
        OnlineUser user = onlineUsers.get(username);
        if (user != null) {
            user.setCurrentRoom(roomId);
            user.setLastSeen(LocalDateTime.now());
        }
    }

    /**
     * Generate avatar URL based on username.
     * Uses UI Avatars service to generate initials-based avatars.
     */
    private String generateAvatarUrl(String username) {
        return "https://ui-avatars.com/api/?name=" + username + "&background=random&color=fff&size=128";
    }
}
