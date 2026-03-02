package com.collabspace.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO representing an online user.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OnlineUser {

    // Username
    private String username;

    // Display name
    private String displayName;

    // Avatar URL
    private String avatar;

    // Online status
    private boolean online;

    // Last seen timestamp
    private LocalDateTime lastSeen;

    // Current chat room (if any)
    private String currentRoom;
}
