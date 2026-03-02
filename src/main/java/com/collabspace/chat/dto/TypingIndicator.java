package com.collabspace.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for typing indicator events.
 * Sent when a user starts or stops typing.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TypingIndicator {

    // Username of the user who is typing
    private String username;

    // Username of the receiver (for one-to-one chat)
    private String receiver;

    // Chat room ID (for group chat)
    private String chatRoomId;

    // true if user is typing, false if stopped
    private boolean typing;

    // Display name to show (e.g., "Rahul is typing...")
    private String displayText;

    /**
     * Factory method to create a typing indicator
     */
    public static TypingIndicator of(String username, String receiver, String chatRoomId, boolean typing) {
        String displayText = typing ? username + " is typing..." : "";
        return TypingIndicator.builder()
                .username(username)
                .receiver(receiver)
                .chatRoomId(chatRoomId)
                .typing(typing)
                .displayText(displayText)
                .build();
    }
}
