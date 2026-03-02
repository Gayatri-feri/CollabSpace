package com.collabspace.chat.controller;

import com.collabspace.chat.dto.*;
import com.collabspace.chat.entity.ChatMessage;
import com.collabspace.chat.service.ChatMessageService;
import com.collabspace.chat.service.ChatRoomService;
import com.collabspace.chat.service.ChatSessionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

/**
 * Controller for handling chat messages via WebSocket and REST endpoints.
 */
@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageService chatMessageService;
    private final ChatRoomService chatRoomService;
    private final ChatSessionService chatSessionService;

    // ==================== WebSocket Message Handlers ====================

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload WebSocketChatMessage message, Principal principal) {
        String sender = principal.getName();
        message.setSender(sender);
        message.setTimestamp(LocalDateTime.now());

        log.info("Message from {}: {}", sender, message.getContent());

        // Save message to database
        chatMessageService.saveMessage(message);

        // Send to receiver if private message
        if (message.getReceiver() != null && !message.getReceiver().isEmpty()) {
            messagingTemplate.convertAndSendToUser(
                    message.getReceiver(),
                    "/queue/messages",
                    message
            );
            // Also send to sender
            messagingTemplate.convertAndSendToUser(
                    sender,
                    "/queue/messages",
                    message
            );
        }
        // Send to chat room if group message
        else if (message.getChatRoomId() != null && !message.getChatRoomId().isEmpty()) {
            messagingTemplate.convertAndSend(
                    "/topic/room/" + message.getChatRoomId(),
                    message
            );
        }
    }

    @MessageMapping("/chat.typing")
    public void handleTyping(@Payload TypingIndicator typing, Principal principal) {
        String username = principal.getName();
        typing.setUsername(username);

        // Broadcast typing status to the chat room or receiver
        if (typing.getChatRoomId() != null) {
            messagingTemplate.convertAndSend(
                    "/topic/room/" + typing.getChatRoomId() + "/typing",
                    typing
            );
        } else if (typing.getReceiver() != null) {
            messagingTemplate.convertAndSendToUser(
                    typing.getReceiver(),
                    "/queue/typing",
                    typing
            );
        }
    }

    @MessageMapping("/chat.joinRoom/{roomId}")
    public void joinRoom(@DestinationVariable String roomId, Principal principal, 
                         SimpMessageHeaderAccessor headerAccessor) {
        String username = principal.getName();
        String sessionId = headerAccessor.getSessionId();
        
        chatSessionService.setCurrentChatRoom(sessionId, roomId);
        
        // Send join notification
        WebSocketChatMessage joinMessage = WebSocketChatMessage.builder()
                .sender("SYSTEM")
                .chatRoomId(roomId)
                .content(username + " joined the room")
                .type(ChatMessage.MessageType.JOIN.name())
                .timestamp(LocalDateTime.now())
                .build();
        
        messagingTemplate.convertAndSend("/topic/room/" + roomId, joinMessage);
        chatMessageService.saveSystemMessage(joinMessage.getContent(), roomId, ChatMessage.MessageType.JOIN);
        
        log.info("User {} joined room {}", username, roomId);
    }

    @MessageMapping("/chat.leaveRoom/{roomId}")
    public void leaveRoom(@DestinationVariable String roomId, Principal principal) {
        String username = principal.getName();
        
        // Send leave notification
        WebSocketChatMessage leaveMessage = WebSocketChatMessage.builder()
                .sender("SYSTEM")
                .chatRoomId(roomId)
                .content(username + " left the room")
                .type(ChatMessage.MessageType.LEAVE.name())
                .timestamp(LocalDateTime.now())
                .build();
        
        messagingTemplate.convertAndSend("/topic/room/" + roomId, leaveMessage);
        chatMessageService.saveSystemMessage(leaveMessage.getContent(), roomId, ChatMessage.MessageType.LEAVE);
        
        log.info("User {} left room {}", username, roomId);
    }

    // ==================== REST API Endpoints ====================

    @GetMapping("/api/chat/history/private/{username}")
    @ResponseBody
    public ResponseEntity<List<WebSocketChatMessage>> getPrivateChatHistory(
            Principal principal,
            @PathVariable String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        String currentUser = principal.getName();
        List<WebSocketChatMessage> messages = chatMessageService.getPrivateChatHistory(
                currentUser, username, page, size);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/api/chat/history/room/{roomId}")
    @ResponseBody
    public ResponseEntity<List<WebSocketChatMessage>> getRoomChatHistory(
            @PathVariable String roomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        List<WebSocketChatMessage> messages = chatMessageService.getChatRoomHistory(roomId, page, size);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/api/chat/recent")
    @ResponseBody
    public ResponseEntity<List<WebSocketChatMessage>> getRecentMessages(
            Principal principal,
            @RequestParam(defaultValue = "20") int limit) {
        String username = principal.getName();
        List<WebSocketChatMessage> messages = chatMessageService.getRecentMessagesForUser(username, limit);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/api/chat/unread-count")
    @ResponseBody
    public ResponseEntity<Long> getUnreadCount(Principal principal) {
        String username = principal.getName();
        return ResponseEntity.ok(chatMessageService.getUnreadMessageCount(username));
    }

    @PostMapping("/api/chat/mark-read/{roomId}")
    @ResponseBody
    public ResponseEntity<Void> markMessagesAsRead(
            Principal principal,
            @PathVariable String roomId) {
        String username = principal.getName();
        chatMessageService.markMessagesAsRead(roomId, username);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/api/chat/online-users")
    @ResponseBody
    public ResponseEntity<Set<String>> getOnlineUsers() {
        return ResponseEntity.ok(chatSessionService.getOnlineUsers());
    }

    @DeleteMapping("/api/chat/message/{messageId}")
    @ResponseBody
    public ResponseEntity<Void> deleteMessage(
            Principal principal,
            @PathVariable Long messageId) {
        String username = principal.getName();
        chatMessageService.deleteMessage(messageId, username);
        return ResponseEntity.ok().build();
    }
}
