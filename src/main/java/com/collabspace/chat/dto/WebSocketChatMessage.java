package com.collabspace.chat.dto;

import com.collabspace.chat.entity.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for WebSocket chat messages.
 * Used for sending and receiving messages over WebSocket.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WebSocketChatMessage {

    // Type of message
    private ChatMessage.MessageType type;

    // Content of the message
    private String content;

    // Sender's username
    private String sender;

    // Receiver's username (for one-to-one chat)
    private String receiver;

    // Chat room ID (for group chat)
    private String chatRoomId;

    // Timestamp of the message
    private LocalDateTime timestamp;

    // Optional: Sender's avatar URL
    private String senderAvatar;

    /**
     * Convert WebSocketChatMessage to ChatMessage entity
     */
    public ChatMessage toEntity() {
        return ChatMessage.builder()
                .type(this.type)
                .content(this.content)
                .sender(this.sender)
                .receiver(this.receiver)
                .chatRoomId(this.chatRoomId)
                .build();
    }

    /**
     * Create WebSocketChatMessage from ChatMessage entity
     */
    public static WebSocketChatMessage fromEntity(ChatMessage entity) {
        return WebSocketChatMessage.builder()
                .type(entity.getType())
                .content(entity.getContent())
                .sender(entity.getSender())
                .receiver(entity.getReceiver())
                .chatRoomId(entity.getChatRoomId())
                .timestamp(entity.getTimestamp())
                .build();
    }
}
