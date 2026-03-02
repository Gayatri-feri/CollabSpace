package com.collabspace.chat.listener;

import com.collabspace.chat.dto.OnlineUser;
import com.collabspace.chat.entity.ChatMessage;
import com.collabspace.chat.dto.WebSocketChatMessage;
import com.collabspace.chat.service.OnlineUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.List;

/**
 * Event listener for WebSocket session events.
 * Tracks user connections and disconnections.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

    private final OnlineUserService onlineUserService;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Handle WebSocket connection established event.
     */
    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = getUsernameFromHeaderAccessor(headerAccessor);

        if (username != null) {
            log.info("WebSocket connection established for user: {}", username);
            onlineUserService.userConnected(username);
            broadcastOnlineUsers();
        }
    }

    /**
     * Handle WebSocket disconnection event.
     */
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = getUsernameFromHeaderAccessor(headerAccessor);

        if (username != null) {
            log.info("WebSocket connection closed for user: {}", username);
            onlineUserService.userDisconnected(username);
            broadcastOnlineUsers();

            // Send leave notification
            WebSocketChatMessage leaveMessage = WebSocketChatMessage.builder()
                    .type(ChatMessage.MessageType.LEAVE)
                    .sender(username)
                    .content(username + " left the chat")
                    .build();

            messagingTemplate.convertAndSend("/topic/messages", leaveMessage);
        }
    }

    /**
     * Extract username from WebSocket session headers.
     */
    private String getUsernameFromHeaderAccessor(StompHeaderAccessor headerAccessor) {
        if (headerAccessor.getUser() != null) {
            return headerAccessor.getUser().getName();
        }
        return null;
    }

    /**
     * Broadcast updated online users list to all clients.
     */
    private void broadcastOnlineUsers() {
        List<OnlineUser> onlineUsers = onlineUserService.getOnlineUsers();
        messagingTemplate.convertAndSend("/topic/online-users", onlineUsers);
        log.debug("Broadcasted online users list. Count: {}", onlineUsers.size());
    }
}
