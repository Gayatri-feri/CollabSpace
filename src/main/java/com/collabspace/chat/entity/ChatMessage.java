package com.collabspace.chat.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Entity class representing a chat message in the system.
 * Supports both one-to-one and group chat messages.
 */
@Entity
@Table(name = "chat_messages")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Username of the sender
    @Column(nullable = false)
    private String sender;

    // Username of the receiver (null for group chat messages)
    @Column
    private String receiver;

    // Chat room ID for group chats (null for one-to-one messages)
    @Column(name = "chat_room_id")
    private String chatRoomId;

    // Message content
    @Column(nullable = false, length = 2000)
    private String content;

    // Type of message: CHAT, JOIN, LEAVE, TYPING
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MessageType type;

    // Timestamp when message was created
    @CreationTimestamp
    @Column(name = "timestamp", updatable = false)
    private LocalDateTime timestamp;

    // Whether the message has been read
    @Column(name = "is_read")
    private boolean read = false;

    /**
     * Enum representing different types of messages
     */
    public enum MessageType {
        CHAT,      // Regular chat message
        JOIN,      // User joined notification
        LEAVE,     // User left notification
        TYPING     // Typing indicator
    }
}
