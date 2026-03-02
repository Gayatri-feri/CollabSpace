package com.collabspace.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatSessionDTO {
    private String sessionId;
    private String username;
    private LocalDateTime connectedAt;
    private LocalDateTime lastActivity;
    private boolean isTyping;
    private String currentChatRoom;
}
