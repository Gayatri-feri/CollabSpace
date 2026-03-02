package com.collabspace.chat.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Entity class representing a chat room for group conversations.
 */
@Entity
@Table(name = "chat_rooms")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Unique identifier for the chat room
    @Column(nullable = false, unique = true)
    private String roomId;

    // Display name of the chat room
    @Column(nullable = false)
    private String name;

    // Optional description of the chat room
    @Column(length = 500)
    private String description;

    // Username of the user who created the room
    @Column(nullable = false)
    private String createdBy;

    // Set of usernames who are members of this room
    @ElementCollection
    @CollectionTable(name = "chat_room_members", joinColumns = @JoinColumn(name = "room_id"))
    @Column(name = "username")
    @Builder.Default
    private Set<String> members = new HashSet<>();

    // Timestamp when room was created
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Timestamp of the last message in the room
    @Column(name = "last_message_at")
    private LocalDateTime lastMessageAt;
}
